'use client';

import { useI18n } from '@/src/i18n/useI18n';
import { MdFilterList, MdRefresh, MdClose } from 'react-icons/md';

interface RuleEventFiltersProps {
    fromDate?: string;
    toDate?: string;
    onFromDateChange: (date?: string) => void;
    onToDateChange: (date?: string) => void;
    onReset: () => void;
}

export default function RuleEventFilters({
    fromDate,
    toDate,
    onFromDateChange,
    onToDateChange,
    onReset,
}: RuleEventFiltersProps) {
    const { t } = useI18n();

    const formatDateForInput = (dateString?: string): string => {
        if (!dateString) return '';
        return dateString.split('T')[0];
    };

    const formatDateForApi = (dateString: string): string => {
        if (!dateString) return '';
        return `${dateString}T00:00:00`;
    };

    const hasActiveFilters = fromDate || toDate;

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-neutral-700 mb-2.5 block">
                        {t('rule.fromDate' as keyof typeof t)}
                    </label>
                    <div className="relative group">
                        <input
                            type="date"
                            value={formatDateForInput(fromDate)}
                            onChange={(e) =>
                                onFromDateChange(
                                    e.target.value
                                        ? formatDateForApi(e.target.value)
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
                            value={formatDateForInput(toDate)}
                            onChange={(e) =>
                                onToDateChange(
                                    e.target.value
                                        ? formatDateForApi(e.target.value)
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
