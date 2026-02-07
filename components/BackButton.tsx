'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

function BackButton() {
	const router = useRouter();
	return (
		<Button variant="ghost" onClick={() => router.back()}>
			<ArrowLeft className="mr-2" />
			Back
		</Button>
	);
}

export default BackButton;

