'use client';

import Navbar from '@/src/components/navbar';
import { AuthRedirectWrapper } from '@/src/components/authRedirectWrapper';

export default function ClientRedirectWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <AuthRedirectWrapper>{children}</AuthRedirectWrapper>
        </>
    );
}
