import { UpdateRule } from './updateRule';

export type UpdateRulePayload = Partial<Omit<UpdateRule, 'id'>>;
