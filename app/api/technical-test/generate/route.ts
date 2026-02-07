import { db } from '@/firebase/admin';
import { google } from '@ai-sdk/google';
import { generateText, Output } from 'ai';
import { z } from 'zod';

const questionSchema = z.object({
	questions: z.array(
		z.object({
			id: z.string(),
			type: z.enum(['multiple-choice', 'written', 'riddle']),
			question: z.string(),
			options: z.array(z.string()).optional(),
			correctAnswer: z.string(),
			explanation: z.string(),
		}),
	),
});

export async function POST(request: Request) {
	const { questionType, title, level, questionCount, userId, description, jobId } = await request.json();

	const getQuestionTypePrompt = (type: string) => {
		switch (type) {
			case 'multiple-choice':
				return `Generate multiple choice questions. Each question should have exactly 2 to 4 options with one correct answer.`;
			case 'written':
				return `Generate short answer questions that require brief, concise responses (1-5 words or a single short phrase/term).
				Examples of good written questions: "What does API stand for?", "Name the HTTP method used to update a resource", "What is the time complexity of binary search?".
				The correct answer should be a single term, acronym, short phrase, or number - NOT a lengthy explanation.`;
			case 'riddles':
				return `Generate brain teasers, logic puzzles, and riddles commonly used in technical interviews. These should test problem-solving and logical thinking. Answers should be brief and specific.`;
			case 'mixed':
				return `Generate a mix of multiple choice, written answer, and riddle/puzzle questions. For multiple choice, include 2 to 4 options. For written questions, design them to require only brief answers (1-5 words).`;
			default:
				return `Generate multiple choice questions with 4 options each.`;
		}
	};

	try {
		const { output } = await generateText({
			model: google('gemini-2.5-flash'),
			output: Output.object({
				schema: questionSchema,
			}),
			prompt: `You are an expert technical interviewer creating assessment questions.

			Context:
			- Target job title: ${title}
			- Job description: ${description}
			- Experience level: ${level}
			- Question type: ${questionType}
			- Number of questions: ${questionCount}

			${getQuestionTypePrompt(questionType)}

			Instructions:
			Generate exactly ${questionCount} questions relevant to the job description and experience level.
			For multiple choice questions, include the "options" array with 2 to 4 choices.
			For written and riddle type questions, omit the "options" field.
			Ensure all questions are professional, clear, and appropriate for the experience level.
			Return only the question, clearly formatted (e.g., with code snippets or bullet points if needed). Do not include the answer.
			 It is ok to ask a question about just a single part of the job description, such as a specific technology or skill (e.g., if the job description is for a Next.js, Drizzle, and TypeScript developer, you can ask a TypeScript only question).
			`,
		});

		const questions = output?.questions;

		const test = {
			jobId,
			userId,
			questionType,
			questions,
			answers: [],
			score: 0,
			totalQuestions: questions.length,
			createdAt: new Date().toISOString(),
			status: 'in-progress',
		};

		const docRef = await db.collection('technicalTests').add(test);
		return Response.json({ test: { ...test, id: docRef.id }, success: true }, { status: 200 });
	} catch {
		return Response.json({ success: false, error: 'Failed to generate test' }, { status: 500 });
	}
}
