'use client';

import Background from '@/src/components/background';
import Card from '@/src/components/card';
import { useI18n } from '@/src/i18n/useI18n';
import { RuleService } from '@/src/services/ruleService';
import { UserStore } from '@/src/store/userStore';
import { DashboardStats } from '@/src/types/interfaces/dashboardStats';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MdTrendingUp, MdTrendingDown, MdShowChart } from 'react-icons/md';

export default function Dashboard() {
    const { t, locale } = useI18n();
    const router = useRouter();
    const userStore = UserStore.getInstance();
    const ruleService = RuleService.getInstance();

    const [dashboardData, setDashboardData] = useState<DashboardStats | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const userStoreRef = useRef(userStore);
    const ruleServiceRef = useRef(ruleService);

    useEffect(() => {
        userStoreRef.current = userStore;
        ruleServiceRef.current = ruleService;
    }, [userStore, ruleService]);

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const userId = await userStoreRef.current.getUserId();

            if (!userId) {
                router.push(`/${locale}/user/login`);
                return;
            }

            const stats = await ruleServiceRef.current.dashboardStats(userId);
            setDashboardData(stats);
        } catch {
            setError(t('error.dashboardLoadFailed' as keyof typeof t));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <Background className="flex items-center justify-center min-h-screen">
                <Card>
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin text-3xl mb-4">
                            ⏳
                        </div>
                        <p className="text-neutral-600">
                            {t('loading' as keyof typeof t)}
                        </p>
                    </div>
                </Card>
            </Background>
        );
    }

    return (
        <Background className="min-h-screen p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-neutral-800 mb-2">
                        {t('dashboard.title' as keyof typeof t)}
                    </h1>
                    <p className="text-neutral-600">
                        {t('dashboard.subtitle' as keyof typeof t)}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 font-medium text-sm">
                            {error}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
                    <div className="group">
                        <Card className="h-full">
                            {dashboardData?.mostBroken?.id ? (
                                <Link
                                    href={`/${locale}/rules/${dashboardData.mostBroken.id}`}
                                    className="block h-full"
                                >
                                    <div className="flex flex-col gap-4 h-full">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-semibold text-neutral-700">
                                                {t(
                                                    'dashboard.mostBroken' as keyof typeof t
                                                )}
                                            </h2>
                                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition">
                                                <MdTrendingDown className="w-5 h-5 text-red-600" />
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <p className="text-2xl font-bold text-neutral-800 line-clamp-2 group-hover:text-red-600 transition overflow-wrap">
                                                {dashboardData.mostBroken.title}
                                            </p>
                                            <p className="text-xs text-neutral-500 mt-3">
                                                {t(
                                                    'dashboard.clickToView' as keyof typeof t
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold text-neutral-700">
                                            {t(
                                                'dashboard.mostBroken' as keyof typeof t
                                            )}
                                        </h2>
                                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                            <MdTrendingDown className="w-5 h-5 text-red-600" />
                                        </div>
                                    </div>
                                    <p className="text-neutral-500 text-sm py-8 text-center">
                                        {t(
                                            'dashboard.noData' as keyof typeof t
                                        )}
                                    </p>
                                </div>
                            )}
                        </Card>
                    </div>

                    <div className="group">
                        <Card className="h-full">
                            {dashboardData?.mostRespected?.id ? (
                                <Link
                                    href={`/${locale}/rules/${dashboardData.mostRespected.id}`}
                                    className="block h-full"
                                >
                                    <div className="flex flex-col gap-4 h-full">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-semibold text-neutral-700">
                                                {t(
                                                    'dashboard.mostRespected' as keyof typeof t
                                                )}
                                            </h2>
                                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition">
                                                <MdTrendingUp className="w-5 h-5 text-green-600" />
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <p className="text-2xl font-bold text-neutral-800 line-clamp-2 group-hover:text-green-600 transition overflow-wrap">
                                                {
                                                    dashboardData.mostRespected
                                                        .title
                                                }
                                            </p>
                                            <p className="text-xs text-neutral-500 mt-3">
                                                {t(
                                                    'dashboard.clickToView' as keyof typeof t
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold text-neutral-700">
                                            {t(
                                                'dashboard.mostRespected' as keyof typeof t
                                            )}
                                        </h2>
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                            <MdTrendingUp className="w-5 h-5 text-green-600" />
                                        </div>
                                    </div>
                                    <p className="text-neutral-500 text-sm py-8 text-center">
                                        {t(
                                            'dashboard.noData' as keyof typeof t
                                        )}
                                    </p>
                                </div>
                            )}
                        </Card>
                    </div>

                    <div className="group">
                        <Card className="h-full">
                            <div className="flex flex-col gap-4 h-full">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-neutral-700">
                                        {t(
                                            'dashboard.respectRate' as keyof typeof t
                                        )}
                                    </h2>
                                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition">
                                        <MdShowChart className="w-5 h-5 text-orange-600" />
                                    </div>
                                </div>

                                {dashboardData?.taux?.taux !== undefined &&
                                dashboardData?.taux?.taux !== null ? (
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span className="text-5xl font-bold text-orange-600">
                                                {Number(
                                                    dashboardData.taux.taux
                                                ).toFixed(1)}
                                            </span>
                                            <span className="text-xl text-neutral-600">
                                                %
                                            </span>
                                        </div>

                                        <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden mb-4">
                                            <div
                                                className="bg-linear-to-r from-orange-400 to-orange-600 h-full transition-all duration-500 ease-out"
                                                style={{
                                                    width: `${Math.min(
                                                        Number(
                                                            dashboardData.taux
                                                                .taux
                                                        ),
                                                        100
                                                    )}%`,
                                                }}
                                            />
                                        </div>

                                        <p className="text-sm font-semibold text-neutral-700">
                                            {Number(dashboardData.taux.taux) >=
                                            75
                                                ? t(
                                                      'dashboard.excellent' as keyof typeof t
                                                  )
                                                : Number(
                                                        dashboardData.taux.taux
                                                    ) >= 50
                                                  ? t(
                                                        'dashboard.good' as keyof typeof t
                                                    )
                                                  : t(
                                                        'dashboard.needsImprovement' as keyof typeof t
                                                    )}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-neutral-500 text-sm py-8 text-center">
                                        {t(
                                            'dashboard.noData' as keyof typeof t
                                        )}
                                    </p>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <p className="text-sm text-neutral-600">
                        💡 {t('dashboard.tip' as keyof typeof t)}
                    </p>
                </div>
            </div>
        </Background>
    );
}
