import { User } from '@/src/models/User';
import { AbstractApiService } from './abstractApiService';
import { Response } from '@/src/models/Response';
import { UpdateUser } from '@/src/types/interfaces/updateUser';
import { UpdateUserPayload } from '@/src/types/interfaces/updateUserPayload';

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

    async update(data: UpdateUser): Promise<User> {
        const token = this.authStore.getToken();
        if (!token) throw new Error('No token available');
        const body: UpdateUserPayload = {};
        if (data.email) body.email = data.email;
        if (data.username) body.username = data.username;
        const res: Response<User> = await this.put(`/users/${data.userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: body,
        });
        return res.data;
    }
}
