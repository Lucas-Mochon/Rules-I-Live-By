'use client';

import { useI18n } from '@/src/i18n/useI18n';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

interface RulePaginationProps {
    page: number;
    totalPages: number;
    size: number;
    onPageChange: (page: number) => void;
    onSizeChange: (size: number) => void;
}

export default function RulePagination({
    page,
    totalPages,
    size,
    onPageChange,
    onSizeChange,
}: RulePaginationProps) {
    const { t } = useI18n();

    const handleSizeChange = (newSize: number) => {
        onSizeChange(newSize);
        onPageChange(1);
    };

    return (
        <div className="flex items-center justify-between gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200 shadow-sm">
            <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-neutral-700 whitespace-nowrap">
                    {t('rule.itemsPerPage' as keyof typeof t)}
                </label>
                <select
                    value={size}
                    onChange={(e) => handleSizeChange(Number(e.target.value))}
                    className="px-3 py-2 border border-orange-300 rounded-lg bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm font-medium"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition duration-200 font-medium"
                >
                    <MdChevronLeft size={20} />
                    {t('pagination.previous' as keyof typeof t)}
                </button>

                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-orange-200 min-w-fit">
                    <span className="text-sm font-semibold text-neutral-800">
                        {page}
                    </span>
                    <span className="text-sm text-neutral-500">/</span>
                    <span className="text-sm font-semibold text-neutral-800">
                        {totalPages}
                    </span>
                </div>

                <button
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    disabled={page >= totalPages}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition duration-200 font-medium"
                >
                    {t('pagination.next' as keyof typeof t)}
                    <MdChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
