'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { locales, Locale } from '@/src/i18n/config';
import { UserStore } from '@/src/store/userStore';
import { useAuthInit } from '@/src/hooks/useAuthInit';
import { useI18n } from '../i18n/useI18n';
import {
    isPublicRoute,
    isProtectedRoute,
    extractLocale,
    extractRoute,
} from '@/src/config/routes';

export function AuthRedirectWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const { locale } = useI18n();
    const router = useRouter();
    const store = UserStore.getInstance();
    const { isLoading } = useAuthInit();
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const handleRedirect = () => {
            if (isLoading) return;

            const user = store.getUser();
            const currentPath = window.location.pathname;
            const currentLocale = extractLocale(currentPath);
            const currentRoute = extractRoute(currentPath);

            if (!locales.includes(currentLocale as Locale)) {
                router.replace(`/${locale}${currentPath}`);
                return;
            }

            if (user) {
                if (isPublicRoute(currentRoute)) {
                    router.replace(`/${currentLocale}/dashboard`);
                    return;
                }
                setShouldRender(true);
                return;
            }

            if (isProtectedRoute(currentRoute)) {
                router.replace(`/${currentLocale}/login`);
                return;
            }

            setShouldRender(true);
        };

        handleRedirect();
    }, [isLoading, router, store, locale]);

    if (isLoading || !shouldRender) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}
