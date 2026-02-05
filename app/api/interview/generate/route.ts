import { db } from '@/firebase/admin';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(request: Request) {
	const { type, title, level, questionCount, userId, description, jobId } = await request.json();

	try {
		const { text: questions } = await generateText({
			model: google('gemini-2.5-flash'),
			prompt: `You are an expert, empathetic, and highly observant Lead Recruiter.
			Your task is to generate high-quality interview questions based on the information provided below.
			Interview Context:
			Target job title: ${title}
			Target job description: ${description}
			Target experience level: ${level}
			Interview type: ${type}
			Total Questions to Ask: ${questionCount}
			Interview Objectives
			Assess the candidate's suitability for the role based on the job description and experience level.
			Instructions
			Generate exactly ${questionCount} questions.
			Tailor the questions to the experience level.
			Ensure questions are relevant to the job description.
			Use clear, concise, and professional language.
			Avoid duplicate or overly generic questions.
			If the interview type is:
			Behavioral: Focus on past experiences, soft skills, decision-making, teamwork, and problem-solving.
			Technical: Focus on technical skills, tools, concepts, coding, system design (if applicable), and best practices.
			Mixed: Include both behavioral and technical questions, clearly labeled.
			Please return only the questions, without any additional text.
                The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
                Return the questions formatted like this:
                ["Question 1", "Question 2", "Question 3"]`,
		});
		const interview = {
			title,
			type,
			level,
			jobId,
			questions: JSON.parse(questions),
			questionCount,
			userId,
			finalized: true,
			createdAt: new Date().toISOString(),
		};
		const docRef = await db.collection('interviews').add(interview);
		return Response.json({ interview: { ...interview, interviewId: docRef.id }, success: true }, { status: 200 });
	} catch {
		return Response.json({ success: false, error: 'Failed to generate interview' }, { status: 500 });
	}
}
