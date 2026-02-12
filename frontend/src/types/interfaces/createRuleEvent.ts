import { EventTypeEnum } from '../enum/eventType';

export interface CreateRuleEvent {
    userId: string;
    ruleId: string;
    type: EventTypeEnum;
    context: string;
    emotion: string;
    note: string;
}
