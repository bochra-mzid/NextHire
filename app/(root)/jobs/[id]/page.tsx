import { redirect } from 'next/navigation';
import { getJobById } from '@/actions/job.action';
import JobDetails from '@/components/JobDetails';

async function JobDetailsPage({ params }: JobDetailsPageProps) {
	const { id: jobId } = await params;
	const result = await getJobById(jobId);

	if (!result.success || !result.job) {
		redirect('/jobs');
	}

	const job = result.job;

	return <JobDetails job={job} />;
}

export default JobDetailsPage;
