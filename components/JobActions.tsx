'use client';

import { useRouter } from 'next/navigation';
import { deleteJob } from '@/actions/job.action';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Code, FileText, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

function JobActions({ job, isEditing = false, setIsEditing }: JobActionsProps) {
	const router = useRouter();

	const handleDeleteJob = async () => {
		try {
			const result = await deleteJob(job.id);
			if (result.success) {
				router.push('/jobs');
			} else {
				toast.error(result.message);
			}
		} catch {
			toast.error('Failed to delete job');
		}
	};

	return (
		<>
			<div className="mb-4 flex items-center justify-between">
				<Button variant="ghost" onClick={() => router.push('/jobs')}>
					<ArrowLeft className="mr-2" />
					Back to Jobs
				</Button>
				{!isEditing && (
					<div className="flex gap-1">
						<Button
							variant="ghost"
							size="icon"
							title="Edit Job"
							onClick={() => setIsEditing?.(true)}
						>
							<Pencil className="size-5" />
						</Button>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="hover:bg-destructive hover:text-destructive-foreground"
									title="Delete Job"
								>
									<Trash2 className="size-5" />
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This will permanently delete the job {job.name} and all associated interviews,
										technical tests, and resume analyses. This action cannot be undone.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={handleDeleteJob}
										className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
									>
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				)}
			</div>
			{!isEditing && (
				<div className="mb-4">
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
						<Button
							variant="outline"
							size="lg"
							className="h-auto flex-col gap-3 py-6 hover:bg-primary hover:text-primary-foreground transition-colors"
							onClick={() => router.push(`/jobs/${job.id}/interviews`)}
						>
							<MessageSquare className="size-8" />
							<div className="text-center">
								<div className="font-semibold">Practice Interviewing</div>
								<div className="text-xs font-normal opacity-70 mt-1">Mock interview with AI</div>
							</div>
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="h-auto flex-col gap-3 py-6 hover:bg-primary hover:text-primary-foreground transition-colors"
							onClick={() => router.push(`/jobs/${job.id}/technical-tests`)}
						>
							<Code className="size-8" />
							<div className="text-center">
								<div className="font-semibold">Technical Tests</div>
								<div className="text-xs font-normal opacity-70 mt-1">Coding challenges</div>
							</div>
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="h-auto flex-col gap-3 py-6 hover:bg-primary hover:text-primary-foreground transition-colors"
							onClick={() => router.push(`/jobs/${job.id}/optimize-resume`)}
						>
							<FileText className="size-8" />
							<div className="text-center">
								<div className="font-semibold">Refine Resume</div>
								<div className="text-xs font-normal opacity-70 mt-1">Optimize for this job</div>
							</div>
						</Button>
					</div>
				</div>
			)}
		</>
	);
}

export default JobActions;

