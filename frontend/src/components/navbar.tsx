'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/src/i18n/useI18n';
import { useEffect, useState } from 'react';
import { UserService } from '../services/userService';
import { AuthService } from '../services/authService';
import { HiMenu, HiX, HiGlobe } from 'react-icons/hi';
import { GiExitDoor } from 'react-icons/gi';
import { useRouter } from 'next/navigation';
import { locales } from '@/src/i18n/config';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { t, locale } = useI18n();
    const userService = UserService.getInstance();
    const authService = AuthService.getInstance();

    const [user, setUser] = useState(userService.getUser());
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = userService.subscribe(setUser);
        return () => unsubscribe();
    }, [userService]);

    const commonItems = [
        { key: 'rules', path: '/rules' },
        { key: 'fractures', path: '/broken' },
        { key: 'respect', path: '/respected' },
        { key: 'profile', path: '/profile' },
    ];

    const items = user
        ? [{ key: 'dashboard', path: '/dashboard' }, ...commonItems]
        : [];

    const handleLogout = () => {
        authService.logout();
        router.push(`/${locale}/user/login`);
        setMobileOpen(false);
    };

    const handleLocaleChange = (newLocale: string) => {
        const segments = pathname.split('/').filter(Boolean);
        segments[0] = newLocale;
        router.push('/' + segments.join('/'));
        setMobileOpen(false);
    };

    return (
        <nav className="w-full fixed top-0 left-0 z-50 bg-orange-50/90 backdrop-blur-md shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="shrink-0 font-bold text-xl text-neutral-900">
                        {t('appName')}
                    </div>

                    <ul className="hidden lg:flex flex-row items-center gap-4">
                        {items.map((item) => {
                            const active = pathname.includes(item.path);
                            return (
                                <li key={item.key}>
                                    <Link
                                        href={`/${locale}${item.path}`}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition whitespace-nowrap
                      ${active ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:text-orange-500'}`}
                                    >
                                        {t(`nav.${item.key}` as keyof typeof t)}
                                    </Link>
                                </li>
                            );
                        })}

                        {!user && (
                            <>
                                <li>
                                    <Link
                                        href={`/${locale}/user/login`}
                                        className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:text-orange-500 transition whitespace-nowrap"
                                    >
                                        {t('auth.login')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={`/${locale}/user/register`}
                                        className="px-3 py-2 rounded-md text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition whitespace-nowrap"
                                    >
                                        {t('auth.register')}
                                    </Link>
                                </li>
                            </>
                        )}

                        <li className="relative group">
                            <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border border-neutral-300 hover:border-orange-400 transition">
                                <HiGlobe
                                    className="text-orange-500"
                                    size={18}
                                />
                                <span className="text-sm font-medium text-neutral-800">
                                    {locale.toUpperCase()}
                                </span>
                            </button>

                            <div className="absolute right-0 mt-0 w-32 bg-white border border-neutral-300 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                {locales.map((loc) => (
                                    <button
                                        key={loc}
                                        onClick={() => handleLocaleChange(loc)}
                                        className={`w-full px-4 py-2 text-left text-sm font-medium transition ${
                                            locale === loc
                                                ? 'bg-orange-500 text-white'
                                                : 'text-neutral-700 hover:bg-orange-50'
                                        }`}
                                    >
                                        {loc.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </li>

                        {user && (
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-md text-neutral-900 hover:text-orange-500 hover:bg-orange-50 transition"
                                    title={t('auth.logout')}
                                >
                                    <GiExitDoor size={20} />
                                </button>
                            </li>
                        )}
                    </ul>

                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2 rounded-md text-neutral-900 hover:text-orange-500 transition"
                        >
                            {mobileOpen ? (
                                <HiX size={24} />
                            ) : (
                                <HiMenu size={24} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {mobileOpen && (
                <>
                    <div
                        className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-64 bg-orange-50/90 shadow-lg p-6 flex flex-col gap-4 z-50 overflow-y-auto">
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="self-end p-2 rounded-md text-neutral-900 hover:text-orange-500 transition"
                        >
                            <HiX size={24} />
                        </button>
                        {items.map((item) => {
                            const active = pathname.includes(item.path);
                            return (
                                <Link
                                    key={item.key}
                                    href={`/${locale}${item.path}`}
                                    className={`px-4 py-3 rounded-md text-sm font-medium transition
                    ${active ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-orange-100 hover:text-orange-600'}`}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {t(`nav.${item.key}` as keyof typeof t)}
                                </Link>
                            );
                        })}

                        {!user && (
                            <>
                                <Link
                                    href={`/${locale}/user/login`}
                                    className="px-4 py-3 rounded-md text-sm font-medium text-neutral-700 hover:bg-orange-100 hover:text-orange-600 transition"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {t('auth.login')}
                                </Link>
                                <Link
                                    href={`/${locale}/user/register`}
                                    className="px-4 py-3 rounded-md text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {t('auth.register')}
                                </Link>
                            </>
                        )}

                        <div className="mt-4 pt-4 border-t border-neutral-300">
                            <p className="px-4 py-2 text-xs font-semibold text-neutral-600 uppercase">
                                {t('nav.language' as keyof typeof t)}
                            </p>
                            <div className="flex gap-2 px-4">
                                {locales.map((loc) => (
                                    <button
                                        key={loc}
                                        onClick={() => handleLocaleChange(loc)}
                                        className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                                            locale === loc
                                                ? 'bg-orange-500 text-white'
                                                : 'bg-white text-neutral-700 border border-neutral-300 hover:border-orange-400'
                                        }`}
                                    >
                                        {loc.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {user && (
                            <button
                                onClick={handleLogout}
                                className="mt-2 flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-neutral-700 hover:bg-red-50 hover:text-red-600 transition"
                                title={t('auth.logout')}
                            >
                                <GiExitDoor size={20} />
                                <span>{t('auth.logout')}</span>
                            </button>
                        )}
                    </div>
                </>
            )}
        </nav>
    );
}
