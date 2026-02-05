import JobForm from '@/components/JobForm';
import BackButton from '@/components/BackButton';

function NewJobPage() {
	return (
		<div className="flex flex-col flex-1">
			<div className="mb-4">
				<BackButton />
			</div>
			<JobForm />
		</div>
	);
}

export default NewJobPage;
