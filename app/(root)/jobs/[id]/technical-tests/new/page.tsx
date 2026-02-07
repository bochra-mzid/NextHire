'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TechnicalTestConfiguration from '@/components/TechnicalTestConfiguration';
import ActiveTechnicalTest from '@/components/ActiveTechnicalTest';
import { getJobById } from '@/actions/job.action';
import { getCurrentUser } from '@/actions/auth.action';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import BackButton from '@/components/BackButton';

function NewTechnicalTestPage() {
	const params = useParams();
	const router = useRouter();
	const jobId = params.id as string;

	const [job, setJob] = useState<Job | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [activeTestId, setActiveTestId] = useState<string | null>(null);
	const [activeTest, setActiveTest] = useState<TechnicalTest | null>(null);

	useEffect(() => {
		async function loadData() {
			const jobResult = await getJobById(jobId);
			if (!jobResult.success || !jobResult.job) {
				router.push('/jobs');
				return;
			}

			const currentUser = await getCurrentUser();
			setJob(jobResult.job);
			setUser(currentUser);
			setLoading(false);
		}

		loadData();
	}, [jobId, router]);

	const handleTestStarted = (testId: string, test: TechnicalTest) => {
		setActiveTestId(testId);
		setActiveTest(test);
	};

	if (loading) {
		return <LoadingOverlay />;
	}

	return (
		<>
			{!activeTestId || !activeTest ? (
				<>
					<div className="mb-4">
						<BackButton />
					</div>
					<div className="flex flex-col gap-10 justify-center items-center">
						<TechnicalTestConfiguration
							job={job}
							user={user}
							onTestStarted={handleTestStarted}
						/>
					</div>
				</>
			) : (
				<ActiveTechnicalTest test={activeTest} testId={activeTestId} />
			)}
		</>
	);
}

export default NewTechnicalTestPage;

