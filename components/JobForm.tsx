'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { Save } from 'lucide-react';
import { createJob, updateJob } from '@/actions/job.action';
import JobFormFields from '@/components/JobFormFields';

function JobForm({ job, isEditing = true, setIsEditing }: JobFormProps) {
	const router = useRouter();
	const [saving, setSaving] = useState(false);
	const [formData, setFormData] = useState<JobFormData>({
		name: job?.name || '',
		jobTitle: job?.jobTitle || '',
		level: job?.level || '',
		description: job?.description || '',
	});

	const isCreateMode = !job;

	const handleSave = async () => {
		if (!formData.name || !formData.jobTitle || !formData.level || !formData.description) {
			toast.error('Please fill in all fields');
			return;
		}
		setSaving(true);
		try {
			if (isCreateMode) {
				const result = await createJob(formData);
				if (result.success && result.jobId) {
					router.push(`/jobs/${result.jobId}`);
				} else {
					toast.error(result.message);
					setSaving(false);
				}
			} else {
				const result = await updateJob(job.id, formData);
				if (result.success) {
					setIsEditing?.(false);
					setSaving(false);
				} else {
					toast.error(result.message);
					setSaving(false);
				}
			}
		} catch {
			toast.error(isCreateMode ? 'Failed to create job' : 'Failed to update job');
			setSaving(false);
		}
	};

	const handleCancel = () => {
		if (isCreateMode) {
			router.push('/jobs');
		} else {
			setFormData({
				name: job.name,
				jobTitle: job.jobTitle,
				level: job.level,
				description: job.description,
			});
			setIsEditing?.(false);
		}
	};

	if (saving) {
		return <LoadingOverlay />;
	}

	return (
		<div className="border rounded-lg p-6 flex-1 flex flex-col">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold">{isCreateMode ? 'Add New Job' : 'Job Details'}</h1>
				{isEditing && (
					<div className="flex gap-2">
						<Button variant="outline" onClick={handleCancel}>
							Cancel
						</Button>
						<Button onClick={handleSave}>
							<Save className="mr-2" />
							{isCreateMode ? 'Create Job' : 'Save Changes'}
						</Button>
					</div>
				)}
			</div>
			{isCreateMode && (
				<p className="text-muted-foreground mb-6">
					Fill in the details for the job you want to practice interviewing for.
				</p>
			)}
			<JobFormFields formData={formData} onChange={setFormData} readOnly={!isEditing} />
			{job && (
				<div className="pt-4 border-t mt-6">
					<div className="flex justify-between text-sm text-muted-foreground">
						<span>Created: {new Date(job.createdAt).toLocaleDateString()}</span>
						{job.updatedAt && <span>Last updated: {new Date(job.updatedAt).toLocaleDateString()}</span>}
					</div>
				</div>
			)}
		</div>
	);
}

export default JobForm;
