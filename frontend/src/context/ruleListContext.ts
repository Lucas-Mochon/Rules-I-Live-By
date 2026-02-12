import { createContext, useContext } from 'react';
import { RuleStatus } from '../types/enum/ruleStatus';
import { ListRulesPayload } from '../types/interfaces/listRulesPayload';

interface RuleListContextType {
    page: number;
    size: number;
    status?: RuleStatus;
    fromDate?: string;
    toDate?: string;

    setPage: (page: number) => void;
    setSize: (size: number) => void;
    setStatus: (status?: RuleStatus) => void;
    setFromDate: (date?: string) => void;
    setToDate: (date?: string) => void;

    getPayload: () => Promise<ListRulesPayload>;

    resetFilters: () => void;
}

const RuleListContext = createContext<RuleListContextType | undefined>(
    undefined
);

export const useRuleListContext = () => {
    const context = useContext(RuleListContext);
    if (!context) {
        throw new Error(
            'useRuleListContext must be used within RuleListProvider'
        );
    }
    return context;
};

export default RuleListContext;
