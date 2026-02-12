import { EventTypeEnum } from '../types/enum/eventType';
import { Rule } from './Rule';

export interface RuleEvent {
    id: string;
    rule: Rule;
    type: EventTypeEnum;
    context: string;
    emotion: string;
    note: string;
    occuredAt: string;
}
