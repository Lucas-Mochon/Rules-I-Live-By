import { ListRulesPayload } from '@/src/types/interfaces/listRulesPayload';
import { AbstractApiService } from './abstractApiService';
import { ListRules } from '@/src/models/ListRules';
import { Response } from '@/src/models/Response';
import { Rule } from '@/src/models/Rule';
import { CreateRule } from '@/src/types/interfaces/createRule';
import { UpdateRule } from '@/src/types/interfaces/updateRule';
import { UpdateRulePayload } from '@/src/types/interfaces/UpdateRulePayload';
import { StatsRespected } from '@/src/types/interfaces/statsRespected';

export class RuleApiService extends AbstractApiService {
    private static instance: RuleApiService;

    private constructor() {
        super();
    }

    static getInstance() {
        if (!RuleApiService.instance) {
            RuleApiService.instance = new RuleApiService();
        }
        return RuleApiService.instance;
    }

    async listRules(payload: ListRulesPayload): Promise<ListRules> {
        const params = new URLSearchParams();
        params.append('userId', payload.userId);
        params.append('page', payload.page.toString());
        params.append('offset', payload.offset.toString());
        params.append('size', payload.size.toString());

        if (payload.status) params.append('status', payload.status);
        if (payload.toDate) params.append('toDate', payload.toDate.toString());
        if (payload.fromDate)
            params.append('fromDate', payload.fromDate.toString());

        const res: Response<ListRules> = await this.get(
            `/rules/?${params.toString()}`
        );
        return res.data;
    }

    async getOne(id: string): Promise<Rule> {
        const res: Response<Rule> = await this.get(`/rules/${id}`);
        return res.data;
    }

    async mostBroken(userId: string): Promise<Rule> {
        const res: Response<Rule> = await this.get(
            `/rules/most-broken/${userId}`
        );
        return res.data;
    }

    async mostRespected(userId: string): Promise<Rule> {
        const res: Response<Rule> = await this.get(
            `/rules/most-respected/${userId}`
        );
        return res.data;
    }

    async statsRespected(userId: string): Promise<StatsRespected> {
        const res: Response<StatsRespected> = await this.get(
            `/rules/stats/respected/${userId}`
        );
        return res.data;
    }

    async create(data: CreateRule): Promise<Rule> {
        const res: Response<Rule> = await this.post('/rules/', {
            body: data,
        });
        return res.data;
    }

    async update(data: UpdateRule): Promise<Rule> {
        const body: UpdateRulePayload = {};
        if (data.description != null) body.description = data.description;
        if (data.title != null) body.title = data.title;

        const res: Response<Rule> = await this.put(`/rules/${data.id}`, {
            body: body,
        });
        return res.data;
    }

    async archive(id: string): Promise<Rule> {
        const res: Response<Rule> = await this.put(`/rules/${id}/archive`);
        return res.data;
    }
}
