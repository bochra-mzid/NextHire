import { redirect } from 'next/navigation';
import { getInterviewById } from '@/actions/interview.action';
import { getJobById } from '@/actions/job.action';
import InterviewDetail from '@/components/InterviewDetail';

async function InterviewDetailPage({ params }: InterviewDetailPageProps) {
	const { id: jobId, interviewId } = await params;

	const [interviewResult, jobResult] = await Promise.all([
		getInterviewById(interviewId),
		getJobById(jobId),
	]);

	if (!interviewResult.success || !interviewResult.interview) {
		redirect(`/jobs/${jobId}/interviews`);
	}
	if (!jobResult.success || !jobResult.job) {
		redirect('/jobs');
	}
	const interview = interviewResult.interview;
	const job = jobResult.job;

	return <InterviewDetail interview={interview} job={job} />;
}

export default InterviewDetailPage;

