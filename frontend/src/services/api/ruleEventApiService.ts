import { ListRuleEventsPayload } from '@/src/types/interfaces/listRuleEventsPayload';
import { AbstractApiService } from './abstractApiService';
import { ListRuleEvents } from '@/src/models/listRuleEvents';
import { Response } from '@/src/models/Response';
import { CreateRuleEvent } from '@/src/types/interfaces/createRuleEvent';
import { RuleEvent } from '@/src/models/ruleEvent';
import { UpdateRuleEvent } from '@/src/types/interfaces/updateRuleEvent';
import { UpdateRuleEventPayload } from '@/src/types/interfaces/updateRuleEventPayload';

export class RuleEventApiService extends AbstractApiService {
    private static instance: RuleEventApiService;

    private constructor() {
        super();
    }

    static getInstance() {
        if (!RuleEventApiService.instance) {
            RuleEventApiService.instance = new RuleEventApiService();
        }
        return RuleEventApiService.instance;
    }

    async list(payload: ListRuleEventsPayload): Promise<ListRuleEvents> {
        const token = this.authStore.getToken();
        if (!token) throw new Error('No token available');

        const params = new URLSearchParams();
        params.append('userId', payload.userId);
        params.append('page', payload.page.toString());
        params.append('offset', payload.offset.toString());
        params.append('size', payload.size.toString());

        if (payload.type) params.append('type', payload.type);
        if (payload.toDate) params.append('toDate', payload.toDate.toString());
        if (payload.fromDate)
            params.append('fromDate', payload.fromDate.toString());

        const res: Response<ListRuleEvents> = await this.get(
            `/rule-events/?${params.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    }

    async getOne(id: string): Promise<RuleEvent> {
        const token = this.authStore.getToken();
        if (!token) throw new Error('No token available');

        const res: Response<RuleEvent> = await this.get(`/rule-events/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    }

    async create(payload: CreateRuleEvent): Promise<RuleEvent> {
        const token = this.authStore.getToken();
        if (!token) throw new Error('No token available');

        const res: Response<RuleEvent> = await this.post(`/rule-events/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: payload,
        });
        return res.data;
    }

    async update(payload: UpdateRuleEvent): Promise<RuleEvent> {
        const token = this.authStore.getToken();
        if (!token) throw new Error('No token available');

        const body: UpdateRuleEventPayload = {};
        if (payload.context) body.context = payload.context;
        if (payload.emotion) body.emotion = payload.emotion;
        if (payload.note) body.note = payload.note;
        if (payload.type) body.type = payload.type;

        const res: Response<RuleEvent> = await this.put(
            `/rule-events/${payload.id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: body,
            }
        );
        return res.data;
    }
}
