import { ReactNode } from 'react';
import clsx from 'clsx';

interface BackgroundProps {
    children: ReactNode;
    className?: string;
}

export default function Background({ children, className }: BackgroundProps) {
    return (
        <main
            className={clsx(
                'min-h-screen',
                'mt-10',
                'bg-cover bg-center bg-no-repeat bg-fixed',
                'bg-[url("/background.jpg")]',
                'bg-white/50 bg-blend-overlay',
                'py-10 sm:py-12 md:py-14 lg:py-16',
                'px-4 sm:px-6 md:px-8 lg:px-12',
                'overflow-x-hidden',

                className
            )}
        >
            <div className="max-w-7xl mx-auto">{children}</div>
        </main>
    );
}
