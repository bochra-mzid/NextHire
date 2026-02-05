import { redirect } from 'next/navigation';
import { getJobById } from '@/actions/job.action';
import { getCurrentUser } from '@/actions/auth.action';
import NewInterview from '@/components/NewInterview';

async function NewInterviewPage({ params }: NewInterviewPageProps) {
	const { id: jobId } = await params;
	const [jobResult, user] = await Promise.all([getJobById(jobId), getCurrentUser()]);

	if (!jobResult.success || !jobResult.job) {
		redirect('/jobs');
	}
	if (!user) {
		redirect('/sign-in');
	}

	return <NewInterview job={jobResult.job} user={user} />;
}

export default NewInterviewPage;

