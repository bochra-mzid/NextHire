import { db } from '@/firebase/admin';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, Output } from 'ai';
import { z } from 'zod';

const google = createGoogleGenerativeAI({
	apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(request: Request) {
	const { interviewId, transcript } = await request.json();
	if (!interviewId || !transcript) {
		return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
	}

	try {
		const interviewDoc = await db.collection('interviews').doc(interviewId).get();
		if (!interviewDoc.exists) {
			return Response.json({ success: false, error: 'Interview not found' }, { status: 404 });
		}

		const interviewData = interviewDoc.data();
		const evaluationSchema = z.object({
			score: z.number().min(0).max(100).describe('Overall interview score out of 100'),
			feedback: z.string().describe('Comprehensive evaluation of the candidate\'s performance'),
			strengths: z.array(z.string()).describe('List of strengths demonstrated during the interview'),
			improvements: z.array(z.string()).describe('List of areas for improvement'),
			questionExamples: z.array(
				z.object({
					question: z.string().describe('The interview question that was asked'),
					exampleAnswer: z.string().describe('A high-quality example answer that demonstrates best practices for answering this question'),
				})
			).describe('Example answers for each interview question to help the candidate improve'),
		});

		const { output: evaluationData } = await generateText({
			model: google('gemini-2.5-flash'),
			prompt: `You are an expert interview evaluator. Analyze the following interview transcript and provide detailed feedback.

			Interview Details:
			- Job Title: ${interviewData?.title}
			- Experience Level: ${interviewData?.level}
			- Interview Type: ${interviewData?.type}
			- Questions Asked: ${JSON.stringify(interviewData?.questions || [])}

			Interview Transcript:
			${transcript}

			Please provide:
			1. A comprehensive evaluation of the candidate's performance
			2. Strengths demonstrated during the interview (at least 3-5 specific strengths)
			3. Areas for improvement (at least 3-5 specific areas)
			4. Specific feedback on communication skills, technical knowledge (if applicable), and overall presentation
			5. An overall score out of 100
			6. For each question that was asked, provide a high-quality example answer that demonstrates best practices, proper structure, and the level of detail expected for the ${interviewData?.level} level and ${interviewData?.type} interview type`,
			output: Output.object({
				schema: evaluationSchema,
			}),
		});

		const createdAt = interviewData?.createdAt ? new Date(interviewData.createdAt).getTime() : Date.now();
		const completedAt = new Date().toISOString();
		const duration = Math.floor((new Date(completedAt).getTime() - createdAt) / 1000);

		await db
			.collection('interviews')
			.doc(interviewId)
			.update({
				transcript,
				feedback: evaluationData.feedback,
				score: evaluationData.score,
				strengths: evaluationData.strengths || [],
				improvements: evaluationData.improvements || [],
				questionExamples: evaluationData.questionExamples || [],
				completedAt,
				duration,
				finalized: true,
			});

		return Response.json({
			success: true,
			interview: {
				interviewId,
				jobId: interviewData?.jobId,
				transcript,
				feedback: evaluationData.feedback,
				score: evaluationData.score,
				strengths: evaluationData.strengths,
				improvements: evaluationData.improvements,
				questionExamples: evaluationData.questionExamples,
				completedAt,
				duration,
			},
		});
	} catch {
		return Response.json({ success: false, error: 'Failed to finalize interview' }, { status: 500 });
	}
}
