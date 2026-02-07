import { google } from '@ai-sdk/google';
import { generateText, Output } from 'ai';
import { z } from 'zod';

const resumeAnalysisSchema = z.object({
	overallScore: z.number().min(0).max(100),
	summary: z.string(),
	strengths: z.array(z.string()),
	weaknesses: z.array(z.string()),
	suggestions: z.array(
		z.object({
			category: z.string(),
			issue: z.string(),
			recommendation: z.string(),
			priority: z.enum(['high', 'medium', 'low']),
		}),
	),
	keywordMatch: z.object({
		matched: z.array(z.string()),
		missing: z.array(z.string()),
	}),
	tailoredSummary: z.string(),
});

export async function POST(request: Request) {
	try {
		const formData = await request.formData();
		const resumeFile = formData.get('resume') as File | null;
		const jobTitle = formData.get('jobTitle') as string;
		const jobDescription = formData.get('jobDescription') as string;
		const experienceLevel = formData.get('experienceLevel') as string;

		if (!resumeFile || !jobTitle || !jobDescription) {
			return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
		}

		const { output } = await generateText({
			model: google('gemini-2.5-flash'),
			output: Output.object({ schema: resumeAnalysisSchema }),
			messages: [
				{
					role: 'user',
					content: [
						{
							type: 'file',
							data: await resumeFile.arrayBuffer(),
							mediaType: resumeFile.type,
						},
					],
				},
			],
			system: `You are an expert resume analyst and career coach. Analyze the uploaded resume against the job requirements and provide detailed feedback.
			JOB DETAILS:
			- Job Title: ${jobTitle}
			- Experience Level: ${experienceLevel}
			- Job Description: ${jobDescription}

			Provide a comprehensive analysis including:

			1. **Overall Score (0-100)**: Rate how well this resume matches the job requirements.

			2. **Summary**: A brief 2-3 sentence overview of the resume's fit for this role.

			3. **ats**: Analysis of how well the resume matches ATS (Applicant Tracking System) requirements.
			- Consider layout simplicity, use of standard section headings, avoidance of graphics or columns, consistent formatting, etc.

			4. **jobMatch** - Analysis of how well the resume aligns with the job description and experience level.
   			- Assess skills, technologies, achievements, and relevance.

			5. **Strengths**: List 3-5 specific things the resume does well that align with this job.

			6. **Weaknesses**: List 3-5 areas where the resume could be improved for this specific job.

			7. **writingAndFormatting**: Analysis of the writing quality, tone, grammar, clarity, and formatting.
   			- Comment on structure, readability, section organization, and consistency.
   			- Be sure to consider the wording and formatting of the job description when evaluating the resume so you can recommend specific wording or formatting changes that would improve the resume's alignment with the job requirements.

			8. **Suggestions**: Provide 4-6 actionable suggestions for improvement, categorized by type (e.g., "Keywords", "Experience", "Skills", "Format", "Summary"). Include the issue, recommendation, and priority level (high/medium/low).

			9. **Keyword Match**: Identify important keywords from the job description that are:
			- Present in the resume (matched)
			- Missing from the resume (missing)

			10. **Tailored Summary**: Write a professional summary (2-3 sentences) that the candidate could use at the top of their resume, specifically tailored for this job.

			Be specific, actionable, and constructive in your feedback. Focus on how to better align the resume with this specific job opportunity.`,
		});

		return Response.json({ success: true, analysis: output }, { status: 200 });
	} catch {
		return Response.json({ success: false, error: 'Failed to analyze resume' }, { status: 500 });
	}
}
