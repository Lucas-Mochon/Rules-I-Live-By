import React, { useState, useCallback, useMemo } from 'react';
import RuleListContext from '../context/ruleListContext';
import { RuleStatus } from '../types/enum/ruleStatus';
import { UserStore } from '../store/userStore';
import { ListRulesPayload } from '../types/interfaces/listRulesPayload';

interface RuleListProviderProps {
    children: React.ReactNode;
    defaultSize?: number;
}

export const RuleListProvider: React.FC<RuleListProviderProps> = ({
    children,
    defaultSize = 10,
}) => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(defaultSize);
    const [status, setStatus] = useState<RuleStatus | undefined>(undefined);
    const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
    const [toDate, setToDate] = useState<Date | undefined>(undefined);

    const offset = useMemo(() => (page - 1) * size, [page, size]);

    const getPayload = useCallback(async (): Promise<ListRulesPayload> => {
        const userStore = UserStore.getInstance();
        const userId = await userStore.getUserId();

        return {
            userId,
            page,
            size,
            offset,
            ...(status && { status }),
            ...(fromDate && { fromDate }),
            ...(toDate && { toDate }),
        };
    }, [page, size, offset, status, fromDate, toDate]);

    const resetFilters = useCallback(() => {
        setPage(1);
        setSize(defaultSize);
        setStatus(undefined);
        setFromDate(undefined);
        setToDate(undefined);
    }, [defaultSize]);

    const value = {
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
    };

    return (
        <RuleListContext.Provider value={value}>
            {children}
        </RuleListContext.Provider>
    );
};
