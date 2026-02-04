'use server';

import { db } from '@/firebase/admin';
import { getCurrentUser } from './auth.action';

export async function getInterviewsByJobId(
	jobId: string,
): Promise<{ success: boolean; interviews?: Interview[]; message?: string }> {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return { success: false, message: 'User not authenticated' };
		}

		const interviewsSnapshot = await db
			.collection('interviews')
			.where('jobId', '==', jobId)
			.where('userId', '==', user.id)
			.get();
		const interviews: Interview[] = interviewsSnapshot.docs.map((doc) => ({
			interviewId: doc.id,
			...doc.data(),
		})) as Interview[];

		return { success: true, interviews };
	} catch {
		return { success: false, message: `Error fetching interviews` };
	}
}

export async function createInterview(
	jobId: string,
	type: 'technical' | 'behavioral' | 'mixed',
	questionCount: number,
): Promise<{ success: boolean; interviewId?: string; message?: string }> {
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

		const interviewData = {
			jobId,
			userId: user.id,
			type,
			questionCount,
			createdAt: new Date().toISOString(),
		};

		const { id: interviewId } = await db.collection('interviews').add(interviewData);

		return {
			success: true,
			message: 'Interview created successfully',
			interviewId,
		};
	} catch {
		return { success: false, message: `Error creating interview` };
	}
}

export async function getInterviewById(
	interviewId: string,
): Promise<{ success: boolean; interview?: Interview; message?: string }> {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return { success: false, message: 'User not authenticated' };
		}

		const interviewDoc = await db.collection('interviews').doc(interviewId).get();

		if (!interviewDoc.exists) {
			return { success: false, message: 'Interview not found' };
		}

		const interviewData = interviewDoc.data();

		if (interviewData?.userId !== user.id) {
			return { success: false, message: 'Unauthorized access' };
		}

		const interview: Interview = {
			interviewId: interviewDoc.id,
			...interviewData,
		} as Interview;

		return { success: true, interview };
	} catch {
		return { success: false, message: `Error fetching interview` };
	}
}
