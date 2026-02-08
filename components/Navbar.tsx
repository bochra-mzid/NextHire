'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, User, LogOut } from 'lucide-react';
import { logout } from '@/actions/auth.action';
import { toast } from 'sonner';

function Navbar() {
	const router = useRouter();
	const [theme, setTheme] = useState<'light' | 'dark'>('dark');

	const toggleTheme = () => {
		const newTheme = theme === 'dark' ? 'light' : 'dark';
		setTheme(newTheme);
		localStorage.setItem('theme', newTheme);
		document.documentElement.classList.toggle('dark', newTheme === 'dark');
	};

	const handleLogout = async () => {
		try {
			await logout();
			router.push('/sign-in');
		} catch {
			toast.error('Failed to log out');
		}
	};

	return (
		<nav className="border-b bg-background">
			<div className="container mx-auto px-4 h-16 flex items-center justify-between">
				<Link href="/" className="flex items-center gap-2">
					<div className="relative h-30 w-30">
						<Image src="/logo.png" alt="Logo" fill className="object-contain" />
					</div>{' '}
				</Link>
				<div className="flex items-center gap-2">
					<button
						onClick={toggleTheme}
						className="relative w-14 h-7 rounded-full bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
					>
						<span
							className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center transition-transform ${
								theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
							}`}
						>
							{theme === 'dark' ? (
								<Moon className="size-3.5 text-primary-foreground" />
							) : (
								<Sun className="size-3.5 text-primary-foreground" />
							)}
						</span>
					</button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<User className="size-5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
								<LogOut className="mr-2 size-4" />
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
