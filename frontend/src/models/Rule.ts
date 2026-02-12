import { RuleStatus } from '../types/enum/ruleStatus';

export interface Rule {
    id: string;
    title: string;
    description: string;
    status: RuleStatus;
    createdAt: string;
}
