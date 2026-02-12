import { UpdateRuleEvent } from './updateRuleEvent';

export type UpdateRuleEventPayload = Partial<Omit<UpdateRuleEvent, 'id'>>;
