import { ListRules } from '../models/ListRules';
import { Rule } from '../models/Rule';
import { RuleStore } from '../store/rulesStore';
import { CreateRule } from '../types/interfaces/createRule';
import { ListRulesPayload } from '../types/interfaces/listRulesPayload';
import { UpdateRule } from '../types/interfaces/updateRule';
import { RuleApiService } from './api/ruleApiService';

export class RuleService {
    private static instance: RuleService;

    private ruleStore = RuleStore.getInstance();
    private api = RuleApiService.getInstance();

    private constructor() {}

    static getInstance() {
        if (!RuleService.instance) {
            RuleService.instance = new RuleService();
        }
        return RuleService.instance;
    }

    async list(payload: ListRulesPayload) {
        const listRules: ListRules = await this.api.listRules(payload);
        await this.ruleStore.setRules(listRules);
    }

    async getOne(ruleId: string) {
        const rule: Rule = await this.api.getOne(ruleId);
        await this.ruleStore.setRule(rule);
    }

    async create(data: CreateRule): Promise<Rule> {
        const rule: Rule = await this.api.create(data);
        await this.ruleStore.setRule(rule);
        return rule;
    }

    async update(data: UpdateRule) {
        const rule: Rule = await this.api.update(data);
        await this.ruleStore.setRule(rule);
    }

    async archive(ruleId: string) {
        const rule: Rule = await this.api.archive(ruleId);
        await this.ruleStore.setOneOfRules(rule);
    }
}
