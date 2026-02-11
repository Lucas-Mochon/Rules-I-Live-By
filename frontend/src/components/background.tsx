import { ReactNode } from 'react';
import clsx from 'clsx';

interface BackgroundProps {
    children: ReactNode;
    className?: string;
}

export default function Background({ children, className }: BackgroundProps) {
    return (
        <main
            className={clsx('min-h-screen', className)}
            style={{
                backgroundImage: "url('/background.jpg')",
                backgroundBlendMode: 'overlay',
                backgroundColor: 'rgba(255,255,255,0.5)',
            }}
        >
            {children}
        </main>
    );
}
