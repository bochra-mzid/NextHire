'use client';

import { useMemo, useState } from 'react';
import Vapi from '@vapi-ai/web';
import ActiveInterview from '@/components/ActiveInterview';
import InterviewConfiguration from '@/components/InterviewConfiguration';
import BackButton from '@/components/BackButton';

function NewInterview({ job, user }: NewInterviewProps) {
	const vapi = useMemo(() => new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!), []);
	const [activeInterviewId, setActiveInterviewId] = useState<string | null>(null);

	return (
		<>
			{!activeInterviewId ? (
				<>
					<div className="mb-4">
						<BackButton />
					</div>
					<div className="flex flex-col gap-10 justify-center items-center">
						<InterviewConfiguration
							job={job}
							user={user}
							vapi={vapi}
							onInterviewStarted={setActiveInterviewId}
						/>
					</div>
				</>
			) : (
				<ActiveInterview
					vapi={vapi}
					activeInterviewId={activeInterviewId}
					onInterviewEnded={() => setActiveInterviewId(null)}
					user={user}
				/>
			)}
		</>
	);
}

export default NewInterview;

