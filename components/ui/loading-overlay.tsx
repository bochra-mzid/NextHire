'use client';

import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
	message?: string;
}

function LoadingOverlay({ message }: LoadingOverlayProps) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
			<div className="flex flex-col items-center gap-4">
				<Loader2 className="size-12 animate-spin text-primary" />
				{message && <p className="text-lg font-medium text-foreground">{message}</p>}
			</div>
		</div>
	);
}

export { LoadingOverlay };

