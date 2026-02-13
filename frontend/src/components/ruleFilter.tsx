'use client';

import { RuleStatus } from '@/src/types/enum/ruleStatus';
import { useI18n } from '@/src/i18n/useI18n';
import { MdFilterList, MdRefresh, MdClose } from 'react-icons/md';

interface RuleFiltersProps {
    status?: RuleStatus;
    fromDate?: Date;
    toDate?: Date;
    onStatusChange: (status?: RuleStatus) => void;
    onFromDateChange: (date?: Date) => void;
    onToDateChange: (date?: Date) => void;
    onReset: () => void;
}

export default function RuleFilters({
    status,
    fromDate,
    toDate,
    onStatusChange,
    onFromDateChange,
    onToDateChange,
    onReset,
}: RuleFiltersProps) {
    const { t } = useI18n();

    const hasActiveFilters = status || fromDate || toDate;

    const handleClearStatus = () => {
        onStatusChange(undefined);
    };

    const handleClearFromDate = () => {
        onFromDateChange(undefined);
    };

    const handleClearToDate = () => {
        onToDateChange(undefined);
    };

    return (
        <div className="mb-8 p-6 bg-linear-to-br from-orange-50 via-white to-orange-50 rounded-xl border border-orange-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-lg">
                    <MdFilterList
                        size={24}
                        className="text-orange-600"
                    />
                </div>
                <h2 className="text-lg font-bold text-neutral-800">
                    {t('rule.filters' as keyof typeof t)}
                </h2>
                {hasActiveFilters && (
                    <div className="ml-auto px-3 py-1 bg-orange-100 rounded-full">
                        <span className="text-xs font-semibold text-orange-700">
                            {t('rule.filtersActive' as keyof typeof t) ||
                                'Filtres actifs'}
                        </span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-neutral-700 mb-2.5 block">
                        {t('rule.status.label' as keyof typeof t)}
                    </label>
                    <div className="relative group">
                        <select
                            value={status || ''}
                            onChange={(e) =>
                                onStatusChange(
                                    e.target.value
                                        ? (e.target.value as RuleStatus)
                                        : undefined
                                )
                            }
                            className="w-full px-4 py-2.5 pr-10 bg-white border-2 border-orange-200 rounded-lg text-neutral-800 font-medium appearance-none cursor-pointer transition-all duration-200 hover:border-orange-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200/50 focus:ring-offset-1"
                        >
                            <option value="">
                                {t('rule.status.all' as keyof typeof t)}
                            </option>
                            <option value={RuleStatus.ACTIVE}>
                                {t('rule.status.active' as keyof typeof t)}
                            </option>
                            <option value={RuleStatus.ARCHIVED}>
                                {t('rule.status.archived' as keyof typeof t)}
                            </option>
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 transition-transform duration-200 group-hover:scale-110">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                />
                            </svg>
                        </div>
                        {status && (
                            <button
                                onClick={handleClearStatus}
                                className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-orange-500 transition-colors"
                                title="Effacer"
                            >
                                <MdClose size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-neutral-700 mb-2.5 block">
                        {t('rule.fromDate' as keyof typeof t)}
                    </label>
                    <div className="relative group">
                        <input
                            type="date"
                            value={
                                fromDate
                                    ? fromDate.toISOString().split('T')[0]
                                    : ''
                            }
                            onChange={(e) =>
                                onFromDateChange(
                                    e.target.value
                                        ? new Date(e.target.value)
                                        : undefined
                                )
                            }
                            className="w-full px-4 py-2.5 bg-white border-2 border-orange-200 rounded-lg text-neutral-800 font-medium transition-all duration-200 hover:border-orange-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200/50 focus:ring-offset-1 cursor-pointer"
                        />
                        {fromDate && (
                            <button
                                onClick={handleClearFromDate}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-orange-500 transition-colors"
                                title="Effacer"
                            >
                                <MdClose size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-neutral-700 mb-2.5 block">
                        {t('rule.toDate' as keyof typeof t)}
                    </label>
                    <div className="relative group">
                        <input
                            type="date"
                            value={
                                toDate ? toDate.toISOString().split('T')[0] : ''
                            }
                            onChange={(e) =>
                                onToDateChange(
                                    e.target.value
                                        ? new Date(e.target.value)
                                        : undefined
                                )
                            }
                            className="w-full px-4 py-2.5 bg-white border-2 border-orange-200 rounded-lg text-neutral-800 font-medium transition-all duration-200 hover:border-orange-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200/50 focus:ring-offset-1 cursor-pointer"
                        />
                        {toDate && (
                            <button
                                onClick={handleClearToDate}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-orange-500 transition-colors"
                                title="Effacer"
                            >
                                <MdClose size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col justify-end">
                    <button
                        onClick={onReset}
                        disabled={!hasActiveFilters}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 active:scale-95 transition-all duration-200 font-semibold shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-md"
                    >
                        <MdRefresh
                            size={18}
                            className="group-hover:rotate-180 transition-transform"
                        />
                        {t('rule.resetFilters' as keyof typeof t)}
                    </button>
                </div>
            </div>
        </div>
    );
}
