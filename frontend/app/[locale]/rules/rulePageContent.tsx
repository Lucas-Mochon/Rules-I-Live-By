'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Background from '@/src/components/background';
import Card from '@/src/components/card';
import { RuleService } from '@/src/services/ruleService';
import { RuleStore } from '@/src/store/rulesStore';
import { useRuleListContext } from '@/src/context/ruleListContext';
import { MdEdit, MdArchive, MdAdd } from 'react-icons/md';
import { useI18n } from '@/src/i18n/useI18n';
import RuleFilters from '@/src/components/ruleFilter';
import RulePagination from '@/src/components/rulePagination';
import { RuleStatus } from '@/src/types/enum/ruleStatus';
import Loading from '@/src/components/loading';
import ErrorComponents from '@/src/components/error';

export default function RulesPageContent() {
    const { t } = useI18n();
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;

    const ruleStore = RuleStore.getInstance();
    const ruleService = RuleService.getInstance();

    const {
        page,
        size,
        status,
        fromDate,
        toDate,
        setPage,
        setSize,
        setStatus,
        setFromDate,
        setToDate,
        getPayload,
        resetFilters,
    } = useRuleListContext();

    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const fetchRules = useCallback(async () => {
        setLoading(true);
        try {
            const payload = await getPayload();
            await ruleService.list(payload);
            const response = ruleStore.getRules();

            if (response?.totalElements && response.size) {
                setTotalPages(
                    Math.ceil(response.totalElements / response.size)
                );
            }
        } catch {
            setError(t('error.error'));
        } finally {
            setLoading(false);
        }
    }, [getPayload, ruleService, ruleStore, t]);

    useEffect(() => {
        fetchRules();
    }, [page, size, status, fromDate, toDate]);

    const rules = ruleStore.getRules()?.rules || [];

    const handleRuleClick = (ruleId: string) => {
        router.push(`/${locale}/rules/${ruleId}`);
    };

    const handleEditClick = (ruleId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/${locale}/rules/${ruleId}/edit`);
    };

    const handleArchiveClick = async (ruleId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await ruleService.archive(ruleId);
        await fetchRules();
    };

    const handleCreateRule = () => {
        router.push(`/${locale}/rules/create`);
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <ErrorComponents message={error} />;
    }

    return (
        <Background>
            <RuleFilters
                status={status}
                fromDate={fromDate}
                toDate={toDate}
                onStatusChange={(newStatus) => {
                    setStatus(newStatus);
                    setPage(1);
                }}
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
                    onClick={handleCreateRule}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition duration-200"
                >
                    <MdAdd size={20} />
                    {t('rule.create' as keyof typeof t)}
                </button>
            </div>

            <div className="px-4 sm:px-6 md:px-8 lg:px-12">
                <div className="flex flex-wrap justify-around gap-6 min-h-96">
                    {rules.length > 0 ? (
                        rules.map((rule) => (
                            <div
                                key={rule.id}
                                onClick={() => handleRuleClick(rule.id)}
                                className="w-full sm:w-5/12 lg:w-5/12 cursor-pointer transition-all duration-200 hover:shadow-md"
                            >
                                <Card className="w-full">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between gap-3 min-w-0">
                                            <h1 className="text-2xl font-bold text-neutral-800 wrap-break-word max-w-96">
                                                {rule.title}
                                            </h1>
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0">
                                                {t(
                                                    `rule.status.${rule.status}` as keyof typeof t
                                                )}
                                            </span>
                                        </div>

                                        <p className="text-xs text-neutral-500">
                                            {t(
                                                'rule.createdOn' as keyof typeof t
                                            )}{' '}
                                            {new Date(
                                                rule.createdAt
                                            ).toLocaleString(locale, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>

                                        <p className="text-sm text-neutral-700 overflow-wrap wrap-break-word max-w-lg">
                                            {rule.description}
                                        </p>
                                        {rule.status === RuleStatus.ACTIVE && (
                                            <div className="flex items-center gap-2 h-10">
                                                <button
                                                    title={t(
                                                        'rule.edit' as keyof typeof t
                                                    )}
                                                    onClick={(e) =>
                                                        handleEditClick(
                                                            rule.id,
                                                            e
                                                        )
                                                    }
                                                    className="p-1.5 text-black hover:bg-neutral-100 rounded-lg transition duration-200"
                                                >
                                                    <MdEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    title={t(
                                                        'rule.archive' as keyof typeof t
                                                    )}
                                                    onClick={(e) => {
                                                        handleArchiveClick(
                                                            rule.id,
                                                            e
                                                        );
                                                    }}
                                                    className="p-1.5 text-black hover:bg-neutral-100 rounded-lg transition duration-200 cursor-pointer"
                                                >
                                                    <MdArchive className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        ))
                    ) : (
                        <div className="w-full text-center py-12">
                            <p className="text-neutral-600">
                                {t('rule.noRules' as keyof typeof t)}
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
