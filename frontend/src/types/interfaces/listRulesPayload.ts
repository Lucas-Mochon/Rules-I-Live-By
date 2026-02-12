import { RuleStatus } from '../enum/ruleStatus';

export interface ListRulesPayload {
    userId: string;
    page: number;
    size: number;
    offset: number;
    status?: RuleStatus;
    fromDate?: Date;
    toDate?: Date;
}
