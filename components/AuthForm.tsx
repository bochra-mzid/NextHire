'use client';
import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import FormField from './FormField';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { signIn, signup } from '@/actions/auth.action';

const authFormSchema = (type: FormType) => {
	return z.object({
		username: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
		email: z.string().email(),
		password: z.string().min(3),
	});
};

function AuthForm(props: AuthFormProps) {
	const { type } = props;
	const router = useRouter();
	const isSignIn = type === 'sign-in';
	const formSchema = authFormSchema(type);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: '',
			email: '',
			password: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			if (isSignIn) {
				const { email, password } = values;
				const userCredentials = await signInWithEmailAndPassword(auth, email, password);
				const idToken = await userCredentials.user.getIdToken();
				if (!idToken) {
					toast.error('Sign in failed!');
					return;
				}
				await signIn({ email, idToken });
				toast.success('Signed in successfully!');
				router.push('/');
			} else {
				const { username, email, password } = values;
				const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
				const result = await signup({
					username: username!,
					email,
					password,
					uid: userCredentials.user.uid,
				});
				if (!result.success) {
					toast.error(result.message);
					return;
				}
				toast.success('Account created successfully. Please sign in.');
				router.push('/sign-in');
			}
		} catch {
			toast.error('Something went wrong!');
		}
	}
	return (
		<div className="border rounded-lg lg:min-w-[566px]">
			<div className="flex flex-col gap-6 card py-14 px-10">
				<div className="flex flex-col gap-2 justify-center items-center">
					<h1 className="text-xl font-bold">{isSignIn ? 'Sign In' : 'Sign Up'}</h1>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
						{!isSignIn && (
							<FormField
								control={form.control}
								name="username"
								label="Username"
								placeholder="Your Name"
								type="text"
							/>
						)}
						<FormField
							control={form.control}
							name="email"
							label="Email"
							placeholder="Your email address"
							type="email"
						/>
						<FormField
							control={form.control}
							name="password"
							label="Password"
							placeholder="Enter your password"
							type="password"
						/>
						<Button className="w-full" type="submit">
							{isSignIn ? 'Sign In' : 'Create an Account'}
						</Button>
					</form>
				</Form>
				<p className="text-center">
					{isSignIn ? 'No account yet?' : 'Have an account already?'}
					<Link href={!isSignIn ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-1">
						{!isSignIn ? 'Sign In' : 'Sign Up'}
					</Link>
				</p>
			</div>
		</div>
	);
}

export default AuthForm;
