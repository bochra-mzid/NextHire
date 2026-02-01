import { ReactNode } from 'react';
import { isAuthenticated } from '@/actions/auth.action';
import { redirect } from 'next/navigation';

const RootLayout = async ({ children }: { children: ReactNode }) => {
	const isUserAuthenticated = await isAuthenticated();
	if (!isUserAuthenticated) {
		redirect('/sign-in');
	}
	return (
		<div className="h-screen flex flex-col">
			<main className="container mx-auto py-6 px-8 flex-1 flex flex-col">{children}</main>
		</div>
	);
};

export default RootLayout;
