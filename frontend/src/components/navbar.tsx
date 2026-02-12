'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/src/i18n/useI18n';
import { useEffect, useState } from 'react';
import { UserService } from '../services/userService';
import { AuthService } from '../services/authService';
import { HiMenu, HiX } from 'react-icons/hi';
import { GiExitDoor } from 'react-icons/gi';

export default function Navbar() {
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
        { key: 'profile', path: '/profile' },
    ];

    const items = user
        ? [{ key: 'dashboard', path: '/dashboard' }, ...commonItems]
        : [];

    const handleLogout = () => {
        authService.logout();
        setMobileOpen(false);
    };

    return (
        <nav className="w-full fixed top-0 left-0 z-50 bg-orange-50/90 backdrop-blur-md shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="shrink-0 font-bold text-xl text-neutral-900">
                        {t('appName')}
                    </div>

                    <ul className="hidden md:flex flex-row items-center gap-6">
                        {items.map((item) => {
                            const active = pathname.includes(item.path);
                            return (
                                <li key={item.key}>
                                    <Link
                                        href={`/${locale}${item.path}`}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition
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
                                        className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:text-orange-500"
                                    >
                                        {t('auth.login')}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={`/${locale}/user/register`}
                                        className="px-3 py-2 rounded-md text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition"
                                    >
                                        {t('auth.register')}
                                    </Link>
                                </li>
                            </>
                        )}

                        {user && (
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-2 rounded-md text-sm font-medium text-black cursor-pointer"
                                    title={t('auth.logout')}
                                >
                                    <GiExitDoor size={18} />
                                </button>
                            </li>
                        )}
                    </ul>

                    <div className="md:hidden flex items-center">
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
                <div className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40">
                    <div className="fixed right-0 top-0 h-full w-64 bg-orange-50/95 shadow-lg p-6 flex flex-col gap-4">
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
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition
                    ${active ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:text-orange-500'}`}
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
                                    className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:text-orange-500"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {t('auth.login')}
                                </Link>
                                <Link
                                    href={`/${locale}/user/register`}
                                    className="px-3 py-2 rounded-md text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {t('auth.register')}
                                </Link>
                            </>
                        )}

                        {user && (
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-2 rounded-md text-sm font-medium text-black"
                                    title={t('auth.logout')}
                                >
                                    <GiExitDoor size={18} />
                                </button>
                            </li>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
