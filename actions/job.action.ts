'use server';

import { db } from '@/firebase/admin';
import { getCurrentUser } from './auth.action';
import { revalidatePath } from 'next/cache';

export async function createJob(params: { name: string; description: string; level: string; jobTitle: string }) {
	const { name, description, level, jobTitle } = params;
	try {
		const user = await getCurrentUser();
		if (!user) {
			return { success: false, message: 'User not authenticated' };
		}

		const jobData = {
			name,
			description,
			level,
			jobTitle,
			userId: user.id,
			createdAt: new Date().toISOString(),
		};

		const { id } = await db.collection('jobs').add(jobData);

		return {
			success: true,
			message: 'Job created successfully',
			jobId: id,
		};
	} catch {
		return { success: false, message: `Error creating job` };
	}
}

export async function getJobs(): Promise<{ success: boolean; jobs?: Job[]; message?: string }> {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return { success: false, message: 'User not authenticated' };
		}

		const jobsSnapshot = await db.collection('jobs').where('userId', '==', user.id).get();

		const jobs = jobsSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as Job[];

		return { success: true, jobs };
	} catch {
		return { success: false, message: `Error fetching jobs` };
	}
}

export async function getJobById(jobId: string): Promise<{ success: boolean; job?: Job; message?: string }> {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return { success: false, message: 'User not authenticated' };
		}

		const jobDoc = await db.collection('jobs').doc(jobId).get();

		if (!jobDoc.exists) {
			return { success: false, message: 'Job not found' };
		}

		const jobData = jobDoc.data();

		if (jobData?.userId !== user.id) {
			return { success: false, message: 'Unauthorized access' };
		}

		const job: Job = {
			id: jobDoc.id,
			...jobDoc.data(),
		} as Job;

		return { success: true, job };
	} catch {
		return { success: false, message: `Error fetching job` };
	}
}

export async function updateJob(
	jobId: string,
	params: {
		name: string;
		description: string;
		level: string;
		jobTitle: string;
	},
): Promise<{ success: boolean; message: string }> {
	const { name, description, level, jobTitle } = params;
	try {
		const user = await getCurrentUser();
		if (!user) {
			return { success: false, message: 'User not authenticated' };
		}

		const jobDoc = await db.collection('jobs').doc(jobId).get();

		if (!jobDoc.exists) {
			return { success: false, message: 'Job not found' };
		}

		const jobData = jobDoc.data();

		if (jobData?.userId !== user.id) {
			return { success: false, message: 'Unauthorized access' };
		}

		await db.collection('jobs').doc(jobId).update({
			name,
			description,
			level,
			jobTitle,
			updatedAt: new Date().toISOString(),
		});

		return { success: true, message: 'Job updated successfully' };
	} catch {
		return { success: false, message: `Error updating job` };
	}
}

export async function deleteJob(jobId: string): Promise<{ success: boolean; message: string }> {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return { success: false, message: 'User not authenticated' };
		}

		const jobDoc = await db.collection('jobs').doc(jobId).get();

		if (!jobDoc.exists) {
			return { success: false, message: 'Job not found' };
		}

		const jobData = jobDoc.data();

		if (jobData?.userId !== user.id) {
			return { success: false, message: 'Unauthorized access' };
		}

		await db.collection('jobs').doc(jobId).delete();

		revalidatePath('/jobs');

		return { success: true, message: 'Job deleted successfully' };
	} catch {
		return { success: false, message: `Error deleting job` };
	}
}
