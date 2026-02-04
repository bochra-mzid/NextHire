'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

function InterviewList({ interviews, jobId }: InterviewListProps) {
	const router = useRouter();

	const formatDuration = (seconds?: number) => {
		if (!seconds) return 'N/A';
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}m ${remainingSeconds}s`;
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const handleInterviewClick = (interviewId: string) => {
		router.push(`/jobs/${jobId}/interviews/${interviewId}`);
	};

	if (interviews.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Interviews History</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8 text-muted-foreground">
						<p>No interviews yet. Start your first interview to practice!</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Interviews History ({interviews.length})</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					{interviews.map(({ interviewId, type, questionCount, score, createdAt, duration }) => (
						<div
							key={interviewId}
							onClick={() => handleInterviewClick(interviewId)}
							className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
						>
							<div className="flex-1 space-y-1">
								<div className="flex items-center gap-2 flex-wrap">
									<Badge variant="outline" className="capitalize">
										{type}
									</Badge>
									<Badge variant="outline">{questionCount} Questions</Badge>
									{score !== undefined && (
										<Badge variant="outline">Score: {score}%</Badge>
									)}
								</div>
								<div className="flex items-center gap-4 text-sm text-muted-foreground">
									<span>{formatDate(createdAt)}</span>
									{duration && <span>Duration: {formatDuration(duration)}</span>}
								</div>
							</div>
							<ChevronRight className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export default InterviewList;
