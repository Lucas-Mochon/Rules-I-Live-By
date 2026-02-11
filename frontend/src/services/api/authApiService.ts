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

    async refresh(token: string): Promise<string> {
        const res: Response<string> = await this.get('/users/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.success) throw new Error(res.message);
        return res.data;
    }

    async logout(token: string): Promise<void> {
        await this.post('/auth/logout', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}
