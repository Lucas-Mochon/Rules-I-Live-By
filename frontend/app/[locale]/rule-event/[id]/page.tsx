'use client';

import Background from '@/src/components/background';
import Card from '@/src/components/card';
import { useI18n } from '@/src/i18n/useI18n';
import { RuleEventStore } from '@/src/store/ruleEventStore';
import { RuleEventService } from '@/src/services/ruleEventService';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RuleEvent } from '@/src/models/ruleEvent';
import { MdEdit } from 'react-icons/md';
import Loading from '@/src/components/loading';

export default function RuleEventDetail() {
    const { t, locale } = useI18n();
    const router = useRouter();
    const pathname = usePathname();
    const ruleEventStore = RuleEventStore.getInstance();
    const ruleEventService = RuleEventService.getInstance();

    const [ruleEvent, setRuleEvent] = useState<RuleEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initRuleEvent = async () => {
            try {
                const pathSegments = pathname.split('/');
                const ruleEventId = pathSegments[pathSegments.length - 1];

                if (!ruleEventId) {
                    router.push(`/${locale}/rule-event`);
                    return;
                }

                const storedRuleEvent = await ruleEventStore.getRuleEvent();

                if (storedRuleEvent && storedRuleEvent.id === ruleEventId) {
                    setRuleEvent(storedRuleEvent);
                    setLoading(false);
                    return;
                }

                await ruleEventService.getOne(ruleEventId);
                const fetchedRuleEvent = await ruleEventStore.getRuleEvent();
                setRuleEvent(fetchedRuleEvent);
                setLoading(false);
            } catch (err) {
                console.error('Error loading rule event:', err);
                setError(t('error.ruleEventNotFound' as keyof typeof t));
                setLoading(false);
            }
        };

        initRuleEvent();
    }, [pathname, ruleEventStore, ruleEventService, router, locale, t]);

    const handleEditClick = (ruleEventId: string) => {
        router.push(`/${locale}/rule-event/${ruleEventId}/edit`);
    };

    if (loading) {
        return <Loading />;
    }

    if (error || !ruleEvent) {
        return (
            <Background className="flex items-center justify-center min-h-screen p-4">
                <Card>
                    <p className="text-neutral-600 mb-4">
                        {error ||
                            t('error.ruleEventNotFound' as keyof typeof t)}
                    </p>
                    <button
                        onClick={() => router.push(`/${locale}/rule-event`)}
                        className="text-orange-500 hover:text-orange-600 font-semibold transition"
                    >
                        {t('common.goBack' as keyof typeof t)}
                    </button>
                </Card>
            </Background>
        );
    }

    const getTypeStyles = (type: string) => {
        if (type === 'RESPECTED') {
            return 'bg-green-100 text-green-700';
        } else if (type === 'BROKEN') {
            return 'bg-red-100 text-red-700';
        }
        return 'bg-gray-100 text-gray-700';
    };

    return (
        <Background className="flex items-center justify-center min-h-screen p-4">
            <div className="max-w-2xl mx-auto w-full">
                <button
                    onClick={() => router.back()}
                    className="mb-6 text-orange-500 hover:text-orange-600 font-semibold transition"
                >
                    ← {t('common.goBack' as keyof typeof t)}
                </button>

                <Card>
                    <div className="flex flex-col gap-6">
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                <h1 className="text-4xl font-bold text-neutral-800 overflow-wrap wrap-break-word max-w-lg">
                                    {ruleEvent.rule?.title || 'N/A'}
                                </h1>
                                <span
                                    className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 ${getTypeStyles(
                                        ruleEvent.type
                                    )}`}
                                >
                                    {t(
                                        `ruleEvent.type.${ruleEvent.type}` as keyof typeof t
                                    )}
                                </span>
                            </div>
                            <p className="text-sm text-neutral-500">
                                {t('ruleEvent.occurredOn' as keyof typeof t)}{' '}
                                {new Date(ruleEvent.occuredAt).toLocaleString(
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

                        {ruleEvent.emotion && (
                            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                                <h2 className="text-lg font-semibold text-neutral-800 mb-2">
                                    {t('ruleEvent.emotion' as keyof typeof t)}
                                </h2>
                                <p className="text-neutral-700">
                                    {ruleEvent.emotion}
                                </p>
                            </div>
                        )}

                        {ruleEvent.context && (
                            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                                <h2 className="text-lg font-semibold text-neutral-800 mb-2">
                                    {t('ruleEvent.context' as keyof typeof t)}
                                </h2>
                                <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap overflow-wrap wrap-break-word">
                                    {ruleEvent.context}
                                </p>
                            </div>
                        )}

                        {ruleEvent.note && (
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h2 className="text-lg font-semibold text-neutral-800 mb-2">
                                    {t('ruleEvent.note' as keyof typeof t)}
                                </h2>
                                <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap overflow-wrap wrap-break-word">
                                    {ruleEvent.note}
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 text-sm font-medium">
                                    {error}
                                </p>
                            </div>
                        )}

                        <div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
                            <button
                                onClick={() => handleEditClick(ruleEvent.id)}
                                title={t('ruleEvent.edit' as keyof typeof t)}
                                className="p-2 text-black hover:bg-neutral-100 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <MdEdit className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
        </Background>
    );
}
