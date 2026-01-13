'use server';

import { auth, db } from '@/firebase/admin';
import { cookies } from 'next/headers';

const ONE_WEEk = 60 * 60 * 24 * 7;

export async function signup(params: { uid: string; username: string; email: string; password: string }) {
	const { uid, username, email, password } = params;
	try {
		const userRecord = await db.collection('users').doc(uid).get();
		if (userRecord.exists) {
			return { success: false, message: 'User already exists' };
		}
		await db.collection('users').doc(uid).set({
			username,
			email,
			password,
		});
		return { success: true, message: 'User created successfully' };
	} catch (error: any) {
		if (error.code === 'auth/email-already-exists') {
			return { success: false, message: 'Email already in use' };
		}
		return { success: false, message: 'Error creating a user' };
	}
}

export async function setSessionCookies(idToken: string) {
	const cookiesStore = await cookies();
	const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: ONE_WEEk * 1000 });
	cookiesStore.set('session', sessionCookie, {
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: ONE_WEEk,
		path: '/',
	});
}

export async function signIn(params: { email: string; idToken: string }) {
	const { email, idToken } = params;
	try {
		const userRecord = await auth.getUserByEmail(email);

		if (!userRecord) {
			return { success: false, message: 'User not found' };
		}
		await setSessionCookies(idToken);
		return { success: true, message: 'User signed in successfully' };
	} catch {
		return { success: false, message: 'Error signing in' };
	}
}

export async function getCurrentUser(): Promise<User | null> {
	const cookiesStore = await cookies();
	const sessionCookie = cookiesStore.get('session')?.value;
	if (!sessionCookie) {
		return null;
	}
	try {
		const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
		const user = await db.collection('users').doc(decodedClaims.uid).get();
		if (!user.exists) {
			return null;
		}
		return {
			...user.data(),
			id: user.id,
		} as User;
	} catch (error) {
		return null;
	}
}

export async function isAuthenticated() {
	const user = await getCurrentUser();
	return !!user;
}
