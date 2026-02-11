import { UserStore } from '@/src/store/userStore';
import { UserApiService } from './api/userApiService';
import { User } from '../models/User';

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

    async fetchMe() {
        try {
            const user = await this.api.getMe();
            this.userStore.setUser(user);
            return user;
        } catch (err) {
            this.userStore.removeUser();
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
