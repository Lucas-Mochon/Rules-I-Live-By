import { UserStore } from '@/src/store/userStore';
import { UserApiService } from './api/userApiService';
import { User } from '../models/User';
import { UpdateUser } from '../types/interfaces/updateUser';
export class UserService {
    private static instance: UserService;

    private userStore = UserStore.getInstance();
    private api = UserApiService.getInstance();

    private constructor() {}

    static getInstance() {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    async fetchMe(): Promise<User> {
        try {
            const user = await this.api.getMe();
            this.userStore.setUser(user);
            return user;
        } catch (err) {
            console.log('err:', err);
            this.userStore.removeUser();
            throw err;
        }
    }

    async update(data: UpdateUser): Promise<User> {
        try {
            const user = await this.api.update(data);
            this.userStore.setUser(user);
            return user;
        } catch (err) {
            throw err;
        }
    }

    getUser() {
        return this.userStore.getUser();
    }

    subscribe(observer: (user: User | null) => void) {
        return this.userStore.subscribe(observer);
    }

    removeUser() {
        this.userStore.removeUser();
    }
}
