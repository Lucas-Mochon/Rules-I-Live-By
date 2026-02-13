import { ListRules } from '../models/ListRules';
import { Rule } from '../models/Rule';
import { RuleStore } from '../store/rulesStore';
import { RuleStatus } from '../types/enum/ruleStatus';
import { CreateRule } from '../types/interfaces/createRule';
import { DashboardStats } from '../types/interfaces/dashboardStats';
import { ListRulesPayload } from '../types/interfaces/listRulesPayload';
import { StatsRespected } from '../types/interfaces/statsRespected';
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

    async mostBroken(userId: string): Promise<Rule> {
        const rule: Rule = await this.api.mostBroken(userId);
        await this.ruleStore.setRule(rule);
        return rule;
    }

    async mostRespected(userId: string): Promise<Rule> {
        const rule: Rule = await this.api.mostRespected(userId);
        await this.ruleStore.setRule(rule);
        return rule;
    }

    async statsRespected(userId: string): Promise<StatsRespected> {
        const stats: StatsRespected = await this.api.statsRespected(userId);
        return stats;
    }

    async dashboardStats(userId: string): Promise<DashboardStats> {
        const stats: StatsRespected = await this.statsRespected(userId);
        const mostBroken: Rule = await this.mostBroken(userId);
        const mostRespected: Rule = await this.mostRespected(userId);

        return {
            taux: stats,
            mostBroken: mostBroken,
            mostRespected: mostRespected,
        };
    }

    async update(data: UpdateRule) {
        const rule: Rule = await this.api.update(data);
        await this.ruleStore.setRule(rule);
    }

    async archive(ruleId: string) {
        const rule: Rule = await this.api.archive(ruleId);
        await this.ruleStore.setOneOfRules(rule);
    }

    async listAll(userId: string): Promise<Rule[]> {
        const payload: ListRulesPayload = {
            userId: userId,
            page: 1,
            size: 100000,
            offset: 0,
            status: RuleStatus.ACTIVE,
        };
        const listRules: ListRules = await this.api.listRules(payload);
        return listRules.rules;
    }
}
