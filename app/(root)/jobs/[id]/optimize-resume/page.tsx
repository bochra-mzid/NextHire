import { getJobById } from '@/actions/job.action';
import { redirect } from 'next/navigation';
import BackButton from '@/components/BackButton';
import ResumeOptimizer from '@/components/ResumeOptimizer';

async function OptimizeResumePage({ params }: OptimizeResumePageProps) {
	const { id: jobId } = await params;
	const { success, job } = await getJobById(jobId);

	if (!success || !job) {
		redirect('/jobs');
	}

	return (
		<>
			<div className="mb-4">
				<BackButton />
			</div>
			<div className="mb-6">
				<h1 className="text-3xl font-bold">Optimize Resume</h1>
				<p className="text-muted-foreground mt-1">
					Get AI-powered suggestions to tailor your resume for
					<span className="font-medium text-foreground">{job.jobTitle}</span> at
					<span className="font-medium text-foreground">{job.name}</span>
				</p>
			</div>
			<ResumeOptimizer job={job} />
		</>
	);
}

export default OptimizeResumePage;
