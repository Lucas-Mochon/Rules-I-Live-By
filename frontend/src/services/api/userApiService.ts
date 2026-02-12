import { User } from '@/src/models/User';
import { AbstractApiService } from './abstractApiService';
import { Response } from '@/src/models/Response';

export class UserApiService extends AbstractApiService {
    private static instance: UserApiService;

    private constructor() {
        super();
    }

    static getInstance() {
        if (!UserApiService.instance) {
            UserApiService.instance = new UserApiService();
        }
        return UserApiService.instance;
    }

    async getMe(): Promise<User> {
        const token = this.authStore.getToken();
        if (!token) throw new Error('No token available');

        const res: Response<User> = await this.get('/users/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    }
}
