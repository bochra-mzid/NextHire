'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import JobForm from '@/components/JobForm';

function NewJobPage() {
	const router = useRouter();

	return (
		<div className="flex flex-col flex-1">
			<div className="mb-4">
				<Button variant="ghost" onClick={() => router.push('/jobs')}>
					<ArrowLeft className="mr-2" />
					Back to Jobs
				</Button>
			</div>
			<JobForm />
		</div>
	);
}

export default NewJobPage;
