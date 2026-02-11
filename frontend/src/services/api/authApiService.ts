import { AuthPayload } from '@/src/types/interfaces/authPayload';
import { AbstractApiService } from './abstractApiService';
import { LoginResponse } from '@/src/models/LoginResponse';
import { Response } from '@/src/models/Response';

export class AuthApiService extends AbstractApiService {
    private static instance: AuthApiService;

    private constructor() {
        super();
    }

    static getInstance() {
        if (!AuthApiService.instance) {
            AuthApiService.instance = new AuthApiService();
        }
        return AuthApiService.instance;
    }

    async register(payload: AuthPayload): Promise<LoginResponse> {
        const res: Response<LoginResponse> = await this.post('/auth/register', {
            body: payload,
        });
        if (!res.success) throw new Error(res.message);
        return res.data;
    }

    async login(payload: AuthPayload): Promise<LoginResponse> {
        const res: Response<LoginResponse> = await this.post('/auth/login', {
            body: payload,
        });
        if (!res.success) throw new Error(res.message);
        return res.data;
    }
}
