'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BriefcaseIcon, CalendarIcon, ChevronRight, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteJob } from '@/actions/job.action';
import { toast } from 'sonner';
import { getExperienceLevelLabel } from '@/lib/utils';
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

function JobCard({ job }: JobCardProps) {
	const router = useRouter();

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	const handleDelete = async () => {
		try {
			const result = await deleteJob(job.id);
			if (result.success) {
				router.refresh();
			} else {
				toast.error(result.message);
			}
		} catch {
			toast.error('Failed to delete job');
		}
	};

	return (
		<Card className="hover:shadow-md transition-shadow">
			<CardHeader>
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<CardTitle className="text-lg">{job.name}</CardTitle>
						<CardDescription className="mt-2 flex items-center gap-2">
							<BriefcaseIcon className="size-4" />
							{job.jobTitle} • {getExperienceLevelLabel(job.level)}
						</CardDescription>
					</div>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="hover:bg-destructive hover:text-destructive-foreground -mt-1 -mr-2"
								title="Delete Job"
							>
								<Trash2 className="size-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This will permanently delete the job ${job.name} and all associated
									interviews, technical tests, and resume analyses. This action cannot be undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleDelete}
									className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
								>
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
				<div className="flex items-center justify-between pt-2">
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<CalendarIcon className="size-3" />
						{formatDate(job.createdAt)}
					</div>
					<Button size="sm" onClick={() => router.push(`/jobs/${job.id}`)}>
						Open
						<ChevronRight />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

export default JobCard;

