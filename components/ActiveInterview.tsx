'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Card } from '@/components/ui/card';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { PhoneOff } from 'lucide-react';
import { toast } from 'sonner';
import Vapi from '@vapi-ai/web';

interface ActiveInterviewProps {
	vapi: Vapi;
	activeInterviewId: string;
	onInterviewEnded: () => void;
	user: User;
}

interface VapiMessage {
	type: string;
	transcriptType?: string;
	role?: string;
	transcript?: string;
}

function ActiveInterview({ vapi, activeInterviewId, onInterviewEnded, user }: ActiveInterviewProps) {
	const router = useRouter();
	const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
	const [isUserSpeaking, setIsUserSpeaking] = useState(false);
	const [isFinalizing, setIsFinalizing] = useState(false);
	const transcriptRef = useRef<TranscriptMessage[]>([]);

	const finalizeInterview = useCallback(async () => {
		if (!activeInterviewId) return;
		setIsFinalizing(true);
		try {
			const formattedTranscript = transcriptRef.current
				.map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
				.join('\n\n');

			const response = await fetch('/api/interview/finalize', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					interviewId: activeInterviewId,
					transcript: formattedTranscript,
				}),
			});

			const data = await response.json();
			if (data.success) {
				onInterviewEnded();
				const jobId = data.interview?.jobId;
				if (jobId) {
					router.push(`/jobs/${jobId}/interviews/${activeInterviewId}`);
				} else {
					router.push('/jobs');
				}
			} else {
				toast.error('Failed to finalize interview');
			}
		} catch {
			toast.error('Error finalizing interview');
		} finally {
			setIsFinalizing(false);
		}
	}, [activeInterviewId, onInterviewEnded, router]);

	useEffect(() => {
		const handleSpeechStart = () => {
			setIsAssistantSpeaking(true);
		};

		const handleSpeechEnd = () => {
			setIsAssistantSpeaking(false);
		};

		const handleMessage = (message: VapiMessage) => {
			if (message.type === 'transcript') {
				if (message.transcriptType === 'final') {
					transcriptRef.current.push({
						role: message.role || '',
						content: message.transcript || '',
						timestamp: Date.now(),
					});
				}

				if (message.role === 'user') {
					setIsUserSpeaking(true);
					setTimeout(() => setIsUserSpeaking(false), 1000);
				}
			}
		};

		const handleCallEnd = () => {
			finalizeInterview();
		};

		vapi.on('speech-start', handleSpeechStart);
		vapi.on('speech-end', handleSpeechEnd);
		vapi.on('message', handleMessage);
		vapi.on('call-end', handleCallEnd);

		return () => {
			vapi.off('speech-start', handleSpeechStart);
			vapi.off('speech-end', handleSpeechEnd);
			vapi.off('message', handleMessage);
			vapi.off('call-end', handleCallEnd);
		};
	}, [vapi, activeInterviewId, finalizeInterview]);

	if (isFinalizing) {
		return <LoadingOverlay message="Generating feedback and score..." />;
	}

	return (
		<div className="flex flex-col gap-10 justify-center items-center p-6 md:p-8 lg:p-10">
			<div className="flex sm:flex-row flex-col items-center justify-between w-full gap-10 ">
				<Card className="h-[400px] flex-1 sm:basis-1/2 w-full justify-center items-center">
					<div className="flex items-center justify-center size-[120px] relative">
						<Image
							src="/ai-agent.jpg"
							alt="profile-image"
							width={65}
							height={54}
							className="rounded-full object-cover size-[120px]"
						/>
						{isAssistantSpeaking && (
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
						)}
					</div>
					<h3>AI Interviewer</h3>
				</Card>
				<Card className="h-[400px] flex-1 sm:basis-1/2 w-full justify-center items-center">
					<div className="flex items-center justify-center size-[120px] relative">
						<Image
							src="/user-avatar.jpg"
							alt="profile-image"
							width={539}
							height={539}
							className="rounded-full object-cover size-[120px]"
						/>
						{isUserSpeaking && (
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
						)}
					</div>
					<h3>{user?.username}</h3>
				</Card>
			</div>
			<div className="w-full max-w-md">
				<Button
					variant="destructive"
					size="lg"
					className="w-full"
					onClick={() => {
						vapi.stop();
					}}
				>
					<PhoneOff className="mr-2" />
					End Interview
				</Button>
			</div>
		</div>
	);
}

export default ActiveInterview;
