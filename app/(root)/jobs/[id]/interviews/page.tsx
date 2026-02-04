import { getInterviewsByJobId } from '@/actions/interview.action';
import InterviewList from '@/components/InterviewList';
import InterviewsPageHeader from '@/components/InterviewsPageHeader';

async function InterviewsPage({ params }: InterviewsPageProps) {
	const { id: jobId } = await params;
	const { interviews = [] } = await getInterviewsByJobId(jobId);

	return (
		<>
			<InterviewsPageHeader jobId={jobId} />
			<div className="mb-8">
				<div className="border rounded-lg p-6 bg-muted/50 mb-6">
					<h2 className="text-lg font-semibold mb-2">About Interview Practice</h2>
					<p className="text-sm text-muted-foreground">
						Practice mock interviews with AI to prepare for your real interview. You can choose between
						technical, behavioral, or mixed interview types. Each session will be recorded and you will
						receive feedback on your performance.
					</p>
				</div>
			</div>
			<InterviewList interviews={interviews} jobId={jobId} />
		</>
	);
}

export default InterviewsPage;
