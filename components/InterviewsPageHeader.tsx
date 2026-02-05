'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import BackButton from '@/components/BackButton';

function InterviewsPageHeader({ jobId }: InterviewsPageHeaderProps) {
	const router = useRouter();

	const handleNewInterview = () => {
		router.push(`/jobs/${jobId}/interviews/new`);
	};

	return (
		<>
			<div className="mb-6">
				<BackButton />
			</div>

			<div className="mb-8">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-3xl font-bold">Practice Interviewing</h1>
					<Button onClick={handleNewInterview} size="lg">
						<Play className="mr-2" />
						Start New Interview
					</Button>
				</div>
			</div>
		</>
	);
}

export default InterviewsPageHeader;
