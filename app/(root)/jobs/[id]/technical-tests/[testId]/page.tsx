import { redirect } from 'next/navigation';
import { getTechnicalTestById } from '@/actions/technicalTest.action';
import { getJobById } from '@/actions/job.action';
import TechnicalTestDetail from '@/components/TechnicalTestDetail';

async function TechnicalTestDetailPage({ params }: TechnicalTestDetailPageProps) {
	const { id: jobId, testId } = await params;

	const [testResult, jobResult] = await Promise.all([
		getTechnicalTestById(testId),
		getJobById(jobId),
	]);

	if (!testResult.success || !testResult.test) {
		redirect(`/jobs/${jobId}/technical-tests`);
	}

	if (!jobResult.success || !jobResult.job) {
		redirect('/jobs');
	}

	const test = testResult.test;
	const job = jobResult.job;

	return <TechnicalTestDetail test={test} job={job} />;
}

export default TechnicalTestDetailPage;

