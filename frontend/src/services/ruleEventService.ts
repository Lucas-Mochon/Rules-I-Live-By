import { ListRuleEvents } from '../models/listRuleEvents';
import { RuleEvent } from '../models/ruleEvent';
import { RuleEventStore } from '../store/ruleEventStore';
import { CreateRuleEvent } from '../types/interfaces/createRuleEvent';
import { ListRuleEventsPayload } from '../types/interfaces/listRuleEventsPayload';
import { UpdateRuleEvent } from '../types/interfaces/updateRuleEvent';
import { RuleEventApiService } from './api/ruleEventApiService';

export class RuleEventService {
    private static instance: RuleEventService;

    private ruleEventStore = RuleEventStore.getInstance();
    private api = RuleEventApiService.getInstance();

    private constructor() {}

    static getInstance() {
        if (!RuleEventService.instance) {
            RuleEventService.instance = new RuleEventService();
        }
        return RuleEventService.instance;
    }

    async list(payload: ListRuleEventsPayload) {
        const listRules: ListRuleEvents = await this.api.list(payload);
        await this.ruleEventStore.setRuleEvents(listRules);
    }

    async getOne(ruleId: string) {
        const rule: RuleEvent = await this.api.getOne(ruleId);
        await this.ruleEventStore.setRuleEvent(rule);
    }

    async create(data: CreateRuleEvent): Promise<RuleEvent> {
        const rule: RuleEvent = await this.api.create(data);
        await this.ruleEventStore.setRuleEvent(rule);
        return rule;
    }

    async update(data: UpdateRuleEvent) {
        const rule: RuleEvent = await this.api.update(data);
        await this.ruleEventStore.setRuleEvent(rule);
    }
}
