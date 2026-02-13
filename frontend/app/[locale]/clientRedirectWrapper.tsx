'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { useI18n } from '@/src/i18n/useI18n';
import { UserService } from '@/src/services/userService';
import {
    isPublicRoute,
    isProtectedRoute,
    extractRoute,
    extractLocale,
} from '@/src/config/routes';

export function ClientRedirectWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { locale } = useI18n();
    const userService = UserService.getInstance();
    const user = userService.getUser();
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const route = extractRoute(pathname);
        const currentLocale = extractLocale(pathname);
        let shouldRedirect = false;
        let redirectPath = '';

        if (!isPublicRoute(route) && !isProtectedRoute(route)) {
            shouldRedirect = true;
            redirectPath = user ? '/dashboard' : '/';
        } else if (isProtectedRoute(route) && !user) {
            shouldRedirect = true;
            redirectPath = '/user/login';
        } else if (
            (route === '/user/login' || route === '/user/register') &&
            user
        ) {
            shouldRedirect = true;
            redirectPath = '/dashboard';
        }

        if (shouldRedirect) {
            startTransition(() => {
                router.push(`/${currentLocale}${redirectPath}`);
            });
        }
    }, [pathname, user, router, locale]);

    if (isPending) {
        return null;
    }

    return <>{children}</>;
}
