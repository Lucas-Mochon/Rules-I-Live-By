'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Background from '@/src/components/background';
import Card from '@/src/components/card';
import { RuleEventService } from '@/src/services/ruleEventService';
import { RuleEventStore } from '@/src/store/ruleEventStore';
import { MdEdit, MdAdd } from 'react-icons/md';
import { useI18n } from '@/src/i18n/useI18n';
import RuleEventFilters from '@/src/components/ruleEventFilter';
import RulePagination from '@/src/components/rulePagination';
import { useRuleEventListContext } from '../context/ruleEventListContext';
import { RuleEvent } from '../models/ruleEvent';

export default function RuleEventContent() {
    const { t } = useI18n();
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;
    const [ruleEvents, setRuleEvents] = useState<RuleEvent[]>([]);

    const ruleEventStore = RuleEventStore.getInstance();
    const ruleEventService = RuleEventService.getInstance();

    const {
        page,
        size,
        type,
        fromDate,
        toDate,
        setPage,
        setSize,
        setFromDate,
        setToDate,
        getPayload,
        resetFilters,
    } = useRuleEventListContext();

    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    const ruleEventServiceRef = useRef(ruleEventService);
    const ruleEventStoreRef = useRef(ruleEventStore);
    const getPayloadRef = useRef(getPayload);

    useEffect(() => {
        ruleEventServiceRef.current = ruleEventService;
        ruleEventStoreRef.current = ruleEventStore;
        getPayloadRef.current = getPayload;
    }, [ruleEventService, ruleEventStore, getPayload]);

    const fetchRuleEvents = useCallback(async () => {
        setLoading(true);
        try {
            const payload = await getPayloadRef.current();
            await ruleEventServiceRef.current.list(payload);
            const response = ruleEventStoreRef.current.getRuleEvents();

            if (response != null) {
                const events = response.rules || [];

                if (Array.isArray(events) && events.length > 0) {
                    if (response.totalElements && response.size) {
                        setTotalPages(
                            Math.ceil(response.totalElements / response.size)
                        );
                    }
                    setRuleEvents(events);
                } else {
                    setRuleEvents([]);
                    setTotalPages(1);
                }
            } else {
                setRuleEvents([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Error fetching rule events:', error);
            setRuleEvents([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRuleEvents();
    }, [page, size, type, fromDate, toDate, fetchRuleEvents]);

    const handleRuleEventClick = (ruleEventId: string) => {
        router.push(`/${locale}/rule-event/${ruleEventId}`);
    };

    const handleEditClick = (ruleEventId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/${locale}/rule-event/${ruleEventId}/edit`);
    };

    const handleCreateRuleEvent = () => {
        router.push(`/${locale}/rule-event/create`);
    };

    return (
        <Background>
            <RuleEventFilters
                fromDate={fromDate}
                toDate={toDate}
                onFromDateChange={(date) => {
                    setFromDate(date);
                    setPage(1);
                }}
                onToDateChange={(date) => {
                    setToDate(date);
                    setPage(1);
                }}
                onReset={resetFilters}
            />

            <div className="px-4 sm:px-6 md:px-8 lg:px-12 mb-6">
                <button
                    onClick={handleCreateRuleEvent}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition duration-200"
                >
                    <MdAdd size={20} />
                    {t('ruleEvent.create' as keyof typeof t)}
                </button>
            </div>

            <div className="px-4 sm:px-6 md:px-8 lg:px-12">
                <div className="flex flex-wrap justify-around gap-6 min-h-96">
                    {loading ? (
                        <div className="w-full text-center py-12">
                            <p className="text-neutral-600">
                                {t('common.loading' as keyof typeof t)}
                            </p>
                        </div>
                    ) : ruleEvents.length > 0 ? (
                        ruleEvents.map((ruleEvent) => (
                            <div
                                key={ruleEvent.id}
                                onClick={() =>
                                    handleRuleEventClick(ruleEvent.id)
                                }
                                className="w-full sm:w-5/12 lg:w-5/12 cursor-pointer transition-all duration-200 hover:shadow-md"
                            >
                                <Card>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between gap-3 min-w-0">
                                            <h1 className="text-2xl font-bold text-neutral-800 overflow-wrap wrap-break-word max-w-lg">
                                                {ruleEvent.rule?.title || 'N/A'}
                                            </h1>
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 bg-orange-100 text-orange-700">
                                                {t(
                                                    `ruleEvent.type.${ruleEvent.type}` as keyof typeof t
                                                )}
                                            </span>
                                        </div>

                                        <p className="text-xs text-neutral-500">
                                            {t(
                                                'ruleEvent.occurredOn' as keyof typeof t
                                            )}{' '}
                                            {new Date(
                                                ruleEvent.occuredAt
                                            ).toLocaleString(locale, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>

                                        <div className="space-y-2">
                                            {ruleEvent.emotion && (
                                                <p className="text-sm text-neutral-700">
                                                    <span className="font-semibold">
                                                        {t(
                                                            'ruleEvent.emotion' as keyof typeof t
                                                        )}
                                                        :
                                                    </span>{' '}
                                                    {ruleEvent.emotion}
                                                </p>
                                            )}
                                            {ruleEvent.context && (
                                                <p className="text-sm text-neutral-700">
                                                    <span className="font-semibold">
                                                        {t(
                                                            'ruleEvent.context' as keyof typeof t
                                                        )}
                                                        :
                                                    </span>{' '}
                                                    {ruleEvent.context}
                                                </p>
                                            )}
                                            {ruleEvent.note && (
                                                <p className="text-sm text-neutral-700 overflow-wrap wrap-break-word">
                                                    <span className="font-semibold">
                                                        {t(
                                                            'ruleEvent.note' as keyof typeof t
                                                        )}
                                                        :
                                                    </span>{' '}
                                                    {ruleEvent.note}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 h-10 pt-2 border-t border-neutral-200">
                                            <button
                                                title={t(
                                                    'ruleEvent.edit' as keyof typeof t
                                                )}
                                                onClick={(e) =>
                                                    handleEditClick(
                                                        ruleEvent.id,
                                                        e
                                                    )
                                                }
                                                className="p-1.5 text-black hover:bg-neutral-100 rounded-lg transition duration-200"
                                            >
                                                <MdEdit className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))
                    ) : (
                        <div className="w-full text-center py-12">
                            <p className="text-neutral-600">
                                {t('ruleEvent.noRuleEvents' as keyof typeof t)}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-4 sm:px-6 md:px-8 lg:px-12 mt-8">
                <RulePagination
                    page={page}
                    totalPages={totalPages}
                    size={size}
                    onPageChange={setPage}
                    onSizeChange={setSize}
                />
            </div>
        </Background>
    );
}
