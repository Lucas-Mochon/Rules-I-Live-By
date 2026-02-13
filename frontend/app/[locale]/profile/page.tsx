'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Background from '@/src/components/background';
import Card from '@/src/components/card';
import { useI18n } from '@/src/i18n/useI18n';
import { UserStore } from '@/src/store/userStore';
import { User } from '@/src/models/User';
import { MdEdit, MdLogout, MdEmail, MdPerson } from 'react-icons/md';
import Loading from '@/src/components/loading';

export default function ProfilePage() {
    const { t, locale } = useI18n();
    const router = useRouter();
    const userStore = UserStore.getInstance();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = userStore.getUser();
                if (!currentUser) {
                    router.push(`/${locale}/user/login`);
                    return;
                }
                setUser(currentUser);
                setLoading(false);
            } catch (err) {
                console.error('Error loading user:', err);
                setError(t('error.loadProfileFailed' as keyof typeof t));
                setLoading(false);
            }
        };

        loadUser();
    }, [userStore, router, locale, t]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            userStore.removeUser();
            router.push(`/${locale}/user/login`);
        } catch (err) {
            console.error('Logout error:', err);
            setError(t('error.logoutFailed' as keyof typeof t));
            setIsLoggingOut(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error && !user) {
        return (
            <Background className="flex items-center justify-center min-h-screen p-4">
                <Card>
                    <div className="text-center">
                        <p className="text-neutral-600 mb-4">{error}</p>
                        <button
                            onClick={() => router.push(`/${locale}/dashboard`)}
                            className="text-orange-500 hover:text-orange-600 font-semibold transition"
                        >
                            {t('common.goBack' as keyof typeof t)}
                        </button>
                    </div>
                </Card>
            </Background>
        );
    }

    return (
        <Background className="flex items-center justify-center min-h-screen p-4">
            <div className="max-w-2xl mx-auto w-full">
                <Card>
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 pb-8 border-b border-neutral-200">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0">
                                    <span className="text-3xl font-bold text-white">
                                        {user?.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>

                                <div>
                                    <h1 className="text-3xl font-bold text-neutral-800">
                                        {user?.username}
                                    </h1>
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    router.push(`/${locale}/profile/edit`)
                                }
                                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition duration-200 whitespace-nowrap h-fit"
                            >
                                <MdEdit size={18} />
                                {t('profile.edit' as keyof typeof t)}
                            </button>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 text-sm font-medium">
                                    {error}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-orange-300 transition duration-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                        <MdEmail className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <span className="text-sm font-semibold text-neutral-600">
                                        {t('profile.email' as keyof typeof t)}
                                    </span>
                                </div>
                                <p className="text-lg font-semibold text-neutral-800 break-all">
                                    {user?.email}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-orange-300 transition duration-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                        <MdPerson className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <span className="text-sm font-semibold text-neutral-600">
                                        {t(
                                            'profile.username' as keyof typeof t
                                        )}
                                    </span>
                                </div>
                                <p className="text-lg font-semibold text-neutral-800">
                                    {user?.username}
                                </p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-neutral-200">
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-semibold transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isLoggingOut ? (
                                    <>
                                        <span className="animate-spin">⏳</span>
                                        {t(
                                            'profile.loggingOut' as keyof typeof t
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <MdLogout size={18} />
                                        {t('profile.logout' as keyof typeof t)}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
        </Background>
    );
}
