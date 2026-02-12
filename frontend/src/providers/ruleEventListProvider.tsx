import { useCallback, useMemo, useState } from 'react';
import RuleEventListContext from '../context/ruleEventListContext';
import { EventTypeEnum } from '../types/enum/eventType';
import { ListRuleEventsPayload } from '../types/interfaces/listRuleEventsPayload';
import { UserStore } from '../store/userStore';

interface RuleEventListProviderProps {
    children: React.ReactNode;
    defaultSize?: number;
    type: EventTypeEnum;
}

export const RuleEventListProvider: React.FC<RuleEventListProviderProps> = ({
    children,
    defaultSize = 10,
    type: initialType,
}) => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(defaultSize);
    const [type, setType] = useState<EventTypeEnum | undefined>(initialType);
    const [fromDate, setFromDate] = useState<string | undefined>(undefined);
    const [toDate, setToDate] = useState<string | undefined>(undefined);

    const offset = useMemo(() => (page - 1) * size, [page, size]);

    const getPayload = useCallback(async (): Promise<ListRuleEventsPayload> => {
        const userStore = UserStore.getInstance();
        const userId = await userStore.getUserId();

        return {
            userId,
            page,
            size,
            offset,
            ...(type && { type }),
            ...(fromDate && { fromDate: new Date(fromDate) }),
            ...(toDate && { toDate: new Date(toDate) }),
        };
    }, [page, size, offset, type, fromDate, toDate]);

    const resetFilters = useCallback(() => {
        setPage(1);
        setSize(defaultSize);
        setType(initialType);
        setFromDate(undefined);
        setToDate(undefined);
    }, [defaultSize, initialType]);

    const value = {
        page,
        size,
        type,
        fromDate,
        toDate,
        setPage,
        setSize,
        setType,
        setFromDate,
        setToDate,
        getPayload,
        resetFilters,
    };

    return (
        <RuleEventListContext.Provider value={value}>
            {children}
        </RuleEventListContext.Provider>
    );
};
