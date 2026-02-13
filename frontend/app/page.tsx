'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RedirectHome() {
    const router = useRouter();

    useEffect(() => {
        router.push('/fr');
    }, [router]);
    return <></>;
}
