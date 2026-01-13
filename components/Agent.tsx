import Image from 'next/image';
import { Button } from './ui/button';
import { Card } from '@/components/ui/card';

enum CallStatus {
	INACTIVE = 'INACTIVE',
	ACTIVE = 'ACTIVE',
	CONNECTING = 'CONNECTING',
	FINISHED = 'FINISHED',
}

function Agent() {
	const callStatus = CallStatus.INACTIVE;
	const isSpeaking = true;
	return (
		<div className="flex flex-col gap-10 justify-center items-center">
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
						{isSpeaking && (
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
						/>{' '}
						{!isSpeaking && (
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
						)}
					</div>
					<h3>You</h3>
				</Card>
			</div>
			<div>
				{(callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED) && (
					<Button>Start Interview</Button>
				)}
				{callStatus === CallStatus.ACTIVE && <Button>End Interview</Button>}
				{callStatus === CallStatus.CONNECTING && <Button>Connecting...</Button>}
			</div>
		</div>
	);
}

export default Agent;
