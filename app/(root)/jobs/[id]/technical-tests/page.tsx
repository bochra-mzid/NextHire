import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getJobById } from '@/actions/job.action';
import { getTechnicalTestsByJobId } from '@/actions/technicalTest.action';
import TechnicalTestList from '@/components/TechnicalTestList';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

async function TechnicalTestsPage({ params }: TechnicalTestsPageProps) {
	const { id: jobId } = await params;
	const [jobResult, testsResult] = await Promise.all([
		getJobById(jobId),
		getTechnicalTestsByJobId(jobId),
	]);

	if (!jobResult.success || !jobResult.job) {
		redirect('/jobs');
	}

	const job = jobResult.job;
	const tests = testsResult.tests || [];

	return (
		<>
			<div className="mb-4">
				<BackButton />
			</div>
			<div className="mb-8">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-3xl font-bold">Technical Tests</h1>
						<p className="text-muted-foreground mt-2">
							{job.name} • {job.jobTitle}
						</p>
					</div>
					<Button asChild size="lg">
						<Link href={`/jobs/${job.id}/technical-tests/new`}>
							<Play className="mr-2" />
							New Technical Test
						</Link>
					</Button>
				</div>
			</div>
			<div className="mb-8">
				<div className="border rounded-lg p-6 bg-muted/50 mb-6">
					<h2 className="text-lg font-semibold mb-2">About Technical Tests</h2>
					<p className="text-sm text-muted-foreground">
						Practice technical assessments with AI-generated questions tailored to this job.
						Choose from multiple choice, written answers, or brain teasers and riddles.
						After each question, you&apos;ll receive immediate feedback with the correct answer and explanation.
					</p>
				</div>
			</div>
			<TechnicalTestList tests={tests} jobId={jobId} />
		</>
	);
}

export default TechnicalTestsPage;

