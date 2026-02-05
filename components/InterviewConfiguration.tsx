'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Vapi from '@vapi-ai/web';
import { ASSISTANT_CONFIG, INTERVIEW_TYPE_OPTIONS, QUESTION_COUNT_OPTIONS } from '@/lib/constants';

interface InterviewConfigurationProps {
	job: Job | null;
	user: User | null;
	vapi: Vapi;
	onInterviewStarted: (interviewId: string) => void;
}

function InterviewConfiguration({ job, user, vapi, onInterviewStarted }: InterviewConfigurationProps) {
	const [interviewType, setInterviewType] = useState<InterviewType>(INTERVIEW_TYPE_OPTIONS[0].value);
	const [questionCount, setQuestionCount] = useState<number>(QUESTION_COUNT_OPTIONS[1].value);
	const [isStarting, setIsStarting] = useState(false);

	const buildAssistantOptions = (username: string, jobTitle: string, level: string, questions: string[]) => ({
		...ASSISTANT_CONFIG,
		firstMessage: `Hello ${username} welcome to your interview for the position of ${jobTitle}.`,
		model: {
			...ASSISTANT_CONFIG.model,
			messages: [
				{
					content: `You are an AI voice assistant conducting interviews.
					Your job is to ask candidates provided interview questions, assess their responses.
					Start by warmly welcoming ${username}. Briefly state that you are here to discuss the ${jobTitle} role.
					You should simulate the tone, pacing and professionalism of a human interviewer in a voice conversation.
					Maintain a professional, neutral, and supportive tone throughout the interview.
					Ask exactly one question at a time. Never "double-barrel" questions.
					Use brief, supportive transitions based on their previous answer (e.g., "That's a great example of leadership," or "I appreciate that technical breakdown") before moving to the next question.
					Maintain a professional yet conversational pace. If a candidate's answer is too brief for the ${level}, ask one brief follow-up for clarification before moving to the next main question.
					After the all the question has been answered, thank the candidate for their time, mention that the team will review the notes, and end the call.
					Persona & Tone:
					Professional & Warm: You are an advocate for the company but also a supportive listener.
					Insightful: Use your capability to detect tone and prosody to build rapport. If the candidate sounds nervous, be encouraging. If they are confident, keep the momentum high.
					Constraints:
					Do not step out of character.
					Do not list all questions at the start.
					Do not provide answers, hints, or feedback during the interview.
					Keep your own speaking turns concise (under 40 words) to prioritize the candidate's speaking time.
					Do not mention this is a mock interview. Instead treat the interview as if it were real to give the best practice experience possible.
					Below is the list of questions:
					Questions: ${JSON.stringify(questions)}`,
					role: 'system' as const,
				},
			],
		},
	});

	const startInterview = async (config: { interviewType: InterviewType; questionCount: number }) => {
		if (!job || !user) return;

		setIsStarting(true);
		try {
			const response = await fetch('/api/interview/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					type: config.interviewType,
					jobId: job.id,
					title: job.jobTitle,
					level: job.level,
					questionCount: config.questionCount,
					userId: user.id,
					description: job.description,
				}),
			});
			const { interview } = await response.json();

			if (!interview) {
				toast.error('Failed to generate interview questions');
				return;
			}

			const assistantOptions = buildAssistantOptions(user.username, job.jobTitle, job.level, interview.questions);
			vapi.start(assistantOptions);
			onInterviewStarted(interview.interviewId);
		} catch {
			toast.error('Failed to start interview');
		} finally {
			setIsStarting(false);
		}
	};

	const handleStart = () => {
		startInterview({ interviewType, questionCount });
	};

	if (isStarting) {
		return <LoadingOverlay message="Generating interview questions..." />;
	}

	return (
		<Card className="w-full p-6">
			<h2 className="text-2xl font-bold mb-6">Interview Configuration</h2>
			<div className="space-y-6 flex flex-row gap-10">
				<div className="space-y-2 flex-1">
					<Label htmlFor="interview-type">Interview Type</Label>
					<Select value={interviewType} onValueChange={(value) => setInterviewType(value as InterviewType)}>
						<SelectTrigger id="interview-type" className="w-full !h-14 py-4">
							<SelectValue placeholder="Select interview type" />
						</SelectTrigger>
						<SelectContent>
							{INTERVIEW_TYPE_OPTIONS.map(({ value, label, description }) => (
								<SelectItem key={value} value={value}>
									<div className="flex flex-col items-start">
										<span className="font-medium">{label}</span>
										<span className="text-xs text-muted-foreground">{description}</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2 flex-1">
					<Label htmlFor="question-count">Number of Questions</Label>
					<Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(Number(value))}>
						<SelectTrigger id="question-count" className="w-full !h-14 py-4">
							<SelectValue placeholder="Select number of questions" />
						</SelectTrigger>
						<SelectContent>
							{QUESTION_COUNT_OPTIONS.map(({ value, label }) => (
								<SelectItem key={value} value={value.toString()}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="pt-5">
					<Button className="w-full  !h-14" size="lg" onClick={handleStart}>
						Start Interview
					</Button>
				</div>
			</div>
		</Card>
	);
}

export default InterviewConfiguration;
