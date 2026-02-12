import { createContext, useContext } from 'react';
import { ListRuleEventsPayload } from '../types/interfaces/listRuleEventsPayload';
import { EventTypeEnum } from '../types/enum/eventType';

interface RuleEventListContextType {
    page: number;
    size: number;
    type?: EventTypeEnum;
    fromDate?: string;
    toDate?: string;

    setPage: (page: number) => void;
    setSize: (size: number) => void;
    setType: (type?: EventTypeEnum) => void;
    setFromDate: (date?: string) => void;
    setToDate: (date?: string) => void;

    getPayload: () => Promise<ListRuleEventsPayload>;

    resetFilters: () => void;
}

const RuleEventListContext = createContext<
    RuleEventListContextType | undefined
>(undefined);

export const useRuleEventListContext = () => {
    const context = useContext(RuleEventListContext);
    if (!context) {
        throw new Error(
            'useRuleEventListContext must be used within RuleListProvider'
        );
    }
    return context;
};

export default RuleEventListContext;
