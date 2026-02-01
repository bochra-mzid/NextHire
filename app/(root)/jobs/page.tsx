import Link from 'next/link';
import JobCard from '@/components/JobCard';
import { Button } from '@/components/ui/button';
import { getJobs } from '@/actions/job.action';
import { PlusIcon, Briefcase } from 'lucide-react';

async function JobsPage() {
	const result = await getJobs();
	const jobs = result?.jobs || [];

	return (
		<>
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold">My Jobs</h1>
					<p className="text-muted-foreground mt-2">Manage your job applications and practice interviews</p>
				</div>
				<Button asChild>
					<Link href="/jobs/new">
						<PlusIcon />
						Add Job
					</Link>
				</Button>
			</div>
			{jobs.length === 0 ? (
				<div className="flex-1 flex flex-col items-center justify-center text-center">
					<div className="rounded-full bg-muted p-6 mb-4">
						<Briefcase className="size-12 text-muted-foreground" />
					</div>
					<h3 className="text-lg font-semibold mb-2">No jobs yet</h3>
					<p className="text-muted-foreground mb-6 max-w-md">
						Get started by adding your first job to practice interviewing for.
					</p>
					<Button asChild>
						<Link href="/jobs/new">
							<PlusIcon />
							Add Job
						</Link>
					</Button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{jobs.map((job) => (
						<JobCard key={job.id} job={job} />
					))}
				</div>
			)}
		</>
	);
}

export default JobsPage;
