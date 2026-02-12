'use client';

import Background from '@/src/components/background';
import Card from '@/src/components/card';
import { useI18n } from '@/src/i18n/useI18n';
import { RuleStore } from '@/src/store/rulesStore';
import { RuleService } from '@/src/services/ruleService';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Rule } from '@/src/models/Rule';
import { RuleStatus } from '@/src/types/enum/ruleStatus';
import { MdEdit, MdArchive } from 'react-icons/md';

export default function RuleDetail() {
    const { t, locale } = useI18n();
    const router = useRouter();
    const pathname = usePathname();
    const ruleStore = RuleStore.getInstance();
    const ruleService = RuleService.getInstance();

    const [rule, setRule] = useState<Rule | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [archiving, setArchiving] = useState(false);

    useEffect(() => {
        const initRule = async () => {
            try {
                const pathSegments = pathname.split('/');
                const ruleId = pathSegments[pathSegments.length - 1];

                if (!ruleId) {
                    router.push(`/${locale}/rules`);
                    return;
                }

                const storedRule = await ruleStore.getRule();

                if (storedRule && storedRule.id === ruleId) {
                    setRule(storedRule);
                    setLoading(false);
                    return;
                }

                await ruleService.getOne(ruleId);

                setRule(ruleStore.getRule());

                setLoading(false);
            } catch (err) {
                void err;
                setError('error');
                setLoading(false);
            }
        };

        initRule();
    }, [pathname, ruleStore, ruleService, router, locale, t]);

    const handleEditClick = (ruleId: string) => {
        router.push(`/${locale}/rules/${ruleId}/edit`);
    };

    const handleArchiveClick = async (ruleId: string) => {
        setArchiving(true);
        try {
            await ruleService.archive(ruleId);

            router.push(`/${locale}/rules`);
        } catch (err) {
            void err;
            setError(t('error.archiveRuleFailed' as keyof typeof t));
            setArchiving(false);
        }
    };

    if (loading) {
        return (
            <Background className="flex items-center justify-center min-h-screen">
                <div className="text-neutral-600">{t('loading')}</div>
            </Background>
        );
    }

    if (error || !rule) {
        return (
            <Background className="flex items-center justify-center min-h-screen">
                <Card>
                    <p className="text-neutral-600">
                        {error || t('error.ruleNotFound' as keyof typeof t)}
                    </p>
                    <button
                        onClick={() => router.push(`/${locale}/rules`)}
                        className="mt-4 text-orange-500 hover:text-orange-600 font-semibold transition"
                    >
                        {t('common.goBack')}
                    </button>
                </Card>
            </Background>
        );
    }

    const getStatusStyles = (status: RuleStatus) => {
        switch (status) {
            case RuleStatus.ACTIVE:
                return 'bg-green-100 text-green-700';
            case RuleStatus.ARCHIVED:
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <Background className="flex items-center justify-center min-h-screen p-4">
            <div className="max-w-2xl mx-auto w-full">
                <button
                    onClick={() => router.back()}
                    className="mb-6 text-orange-500 hover:text-orange-600 font-semibold transition"
                >
                    ← {t('common.goBack')}
                </button>

                <Card>
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                <h1 className="text-4xl font-bold text-neutral-800 overflow-wrap wrap-break-word max-w-lg">
                                    {rule.title}
                                </h1>
                                <span
                                    className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 ${getStatusStyles(
                                        rule.status
                                    )}`}
                                >
                                    {t(
                                        `rule.status.${rule.status}` as keyof typeof t
                                    )}
                                </span>
                            </div>
                            <p className="text-sm text-neutral-500">
                                {t('rule.createdOn')}{' '}
                                {new Date(rule.createdAt).toLocaleString(
                                    locale,
                                    {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    }
                                )}
                            </p>
                        </div>

                        <div className="mb-8 p-4 bg-neutral-50 rounded-lg border border-neutral-200 max-w-lg">
                            <h2 className="text-lg font-semibold text-neutral-800 mb-3">
                                {t('rule.description')}
                            </h2>
                            <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap overflow-wrap  wrap-break-word max-w-lg">
                                {rule.description}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 text-sm font-medium">
                                    {error}
                                </p>
                            </div>
                        )}

                        {rule.status === RuleStatus.ACTIVE && (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleEditClick(rule.id)}
                                    title={t('rule.edit')}
                                    disabled={archiving}
                                    className="p-2 text-black hover:bg-neutral-100 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <MdEdit className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleArchiveClick(rule.id)}
                                    title={t('rule.archive')}
                                    disabled={archiving}
                                    className="p-2 text-black hover:bg-red-100 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {archiving ? (
                                        <span className="animate-spin">⏳</span>
                                    ) : (
                                        <MdArchive className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </Background>
    );
}
