import { User } from '@/src/models/User';
import { AbstractApiService } from './abstractApiService';
import { AuthStore } from '@/src/store/authStore';

export class UserApiService extends AbstractApiService {
    private static instance: UserApiService;
    private authStore = AuthStore.getInstance();

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

        return await this.get('/users/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}
