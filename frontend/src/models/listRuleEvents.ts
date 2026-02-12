import { Response } from './Response';
import { RuleEvent } from './ruleEvent';

export interface ListRuleEvents extends Response {
    rules: RuleEvent[];
    page: number;
    size: number;
    offset: number;
    totalElements: number;
}
