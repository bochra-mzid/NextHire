import { db } from '@/firebase/admin';
import { google } from '@ai-sdk/google';
import { generateText, Output } from 'ai';
import { z } from 'zod';

const evaluationSchema = z.object({
	evaluations: z.array(
		z.object({
			questionId: z.string(),
			isCorrect: z.boolean(),
			feedback: z.string(),
		}),
	),
	overallFeedback: z.string(),
});

export async function POST(request: Request) {
	const { testId, answers } = await request.json();

	try {
		const testDoc = await db.collection('technicalTests').doc(testId).get();
		if (!testDoc.exists) {
			return Response.json({ success: false, error: 'Test not found' }, { status: 404 });
		}

		const testData = testDoc.data();
		const questions = testData?.questions || [];

		const questionsWithAnswers = questions.map((q: TechnicalTestQuestion, index: number) => {
			const userAnswer = answers.find((a: { questionId: string }) => a.questionId === q.id);
			return {
				questionNumber: index + 1,
				questionId: q.id,
				type: q.type,
				question: q.question,
				options: q.options,
				correctAnswer: q.correctAnswer,
				userAnswer: userAnswer?.userAnswer || 'No answer provided',
			};
		});

		const { output } = await generateText({
			model: google('gemini-2.5-flash'),
			output: Output.object({
				schema: evaluationSchema,
			}),
			prompt: `You are an expert technical interviewer evaluating a candidate's test answers.

			For each question, determine if the answer is correct and provide brief, constructive feedback.

			Questions and Answers:
			${questionsWithAnswers
				.map(
					(qa: {
						questionNumber: number;
						questionId: string;
						type: string;
						question: string;
						options?: string[];
						correctAnswer: string;
						userAnswer: string;
					}) => `
			Question ${qa.questionNumber} (ID: ${qa.questionId}):
			Type: ${qa.type}
			Question: ${qa.question}
			${qa.options ? `Options: ${qa.options.join(', ')}` : ''}
			Correct Answer: ${qa.correctAnswer}
			User's Answer: ${qa.userAnswer}
			`,
				)
				.join('\n---\n')}

			Instructions:
				1. For multiple choice: The answer is correct if the user selected the right option (match by letter or full text).
				2. For written/riddle: Be flexible - accept answers that convey the same meaning, even if worded differently.
				3. Provide concise feedback (1-2 sentences) explaining why the answer is correct or what the correct answer should be.
				4. At the end, provide overall feedback summarizing the candidate's performance.`,
		});

		const evaluatedAnswers = answers.map((answer: { questionId: string; userAnswer: string }) => {
			const evaluation = output?.evaluations.find((e) => e.questionId === answer.questionId);
			return {
				...answer,
				isCorrect: evaluation?.isCorrect ?? false,
				feedback: evaluation?.feedback ?? 'No feedback available',
			};
		});

		const correctCount = evaluatedAnswers.filter((a: TechnicalTestAnswer) => a.isCorrect).length;
		const totalQuestions = questions.length;
		const score = Math.round((correctCount / totalQuestions) * 100);

		await db.collection('technicalTests').doc(testId).update({
			answers: evaluatedAnswers,
			score,
			overallFeedback: output?.overallFeedback,
			status: 'completed',
			completedAt: new Date().toISOString(),
		});

		return Response.json({
			success: true,
			score,
			correctCount,
			totalQuestions,
			answers: evaluatedAnswers,
			overallFeedback: output?.overallFeedback,
		});
	} catch {
		return Response.json({ success: false, error: 'Failed to evaluate test' }, { status: 500 });
	}
}
