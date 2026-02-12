import { EventTypeEnum } from '../enum/eventType';

export interface UpdateRuleEvent {
    id: string;
    type: EventTypeEnum;
    context: string;
    emotion: string;
    note: string;
}
