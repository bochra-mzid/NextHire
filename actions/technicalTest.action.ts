'use server';

import { db } from '@/firebase/admin';
import { getCurrentUser } from './auth.action';

export async function getTechnicalTestsByJobId(
	jobId: string,
): Promise<{ success: boolean; tests?: TechnicalTest[]; message?: string }> {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return { success: false, message: 'User not authenticated' };
		}

		const testsSnapshot = await db
			.collection('technicalTests')
			.where('jobId', '==', jobId)
			.where('userId', '==', user.id)
			.get();
		const tests: TechnicalTest[] = testsSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as TechnicalTest[];

		return { success: true, tests };
	} catch {
		return { success: false, message: 'Error fetching technical tests' };
	}
}

export async function getTechnicalTestById(
	testId: string,
): Promise<{ success: boolean; test?: TechnicalTest; message?: string }> {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return { success: false, message: 'User not authenticated' };
		}
		const testDoc = await db.collection('technicalTests').doc(testId).get();
		if (!testDoc.exists) {
			return { success: false, message: 'Technical test not found' };
		}
		const testData = testDoc.data();
		if (testData?.userId !== user.id) {
			return { success: false, message: 'Unauthorized access' };
		}

		return {
			success: true,
			test: { id: testDoc.id, ...testData } as TechnicalTest,
		};
	} catch {
		return { success: false, message: 'Error fetching technical test' };
	}
}

export async function updateTechnicalTest(
	testId: string,
	updates: Partial<TechnicalTest>,
): Promise<{ success: boolean; message?: string }> {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return { success: false, message: 'User not authenticated' };
		}
		const testDoc = await db.collection('technicalTests').doc(testId).get();
		if (!testDoc.exists) {
			return { success: false, message: 'Technical test not found' };
		}
		const testData = testDoc.data();
		if (testData?.userId !== user.id) {
			return { success: false, message: 'Unauthorized access' };
		}
		await db.collection('technicalTests').doc(testId).update(updates);

		return { success: true, message: 'Technical test updated successfully' };
	} catch {
		return { success: false, message: 'Error updating technical test' };
	}
}


