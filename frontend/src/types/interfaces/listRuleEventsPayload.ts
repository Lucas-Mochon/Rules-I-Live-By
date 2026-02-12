import { EventTypeEnum } from '../enum/eventType';

export interface ListRuleEventsPayload {
    userId: string;
    page: number;
    size: number;
    offset: number;
    type?: EventTypeEnum;
    fromDate?: Date;
    toDate?: Date;
}
