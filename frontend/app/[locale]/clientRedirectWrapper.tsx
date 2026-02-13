'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { useI18n } from '@/src/i18n/useI18n';
import { UserStore } from '@/src/store/userStore';
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
    const userStore = UserStore.getInstance();
    const [isPending, startTransition] = useTransition();
    const [user, setUser] = useState(userStore.getUser());

    useEffect(() => {
        const unsubscribe = userStore.subscribe((updatedUser) => {
            setUser(updatedUser);
        });

        return unsubscribe;
    }, [userStore]);

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
