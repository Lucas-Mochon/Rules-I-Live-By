import { AuthStore } from '../store/authStore';
import { AuthApiService } from './api/authApiService';
import { LoginResponse } from '../models/LoginResponse';
import { UserService } from './userService';

export class AuthService {
    private static instance: AuthService;

    private authStore = AuthStore.getInstance();
    private userService = UserService.getInstance();
    private api = AuthApiService.getInstance();

    private constructor() {}

    static getInstance() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async register(payload: {
        username: string;
        email: string;
        password: string;
    }): Promise<LoginResponse> {
        const res = await this.api.register(payload);
        this.authStore.setToken(res.jwtToken);
        await this.userService.fetchMe();
        return res;
    }

    async login(payload: {
        email: string;
        password: string;
    }): Promise<LoginResponse> {
        const res = await this.api.login(payload);
        await this.authStore.setToken(res.jwtToken);
        await this.userService.fetchMe();
        return res;
    }

    async logout() {
        const token = this.authStore.getToken();
        if (token) {
            await this.api.logout(token);
        }
        this.authStore.logout();
        this.userService.removeUser();
    }

    getToken() {
        return this.authStore.getToken();
    }

    isAuthenticated() {
        return this.authStore.isAuthenticated();
    }

    subscribe(observer: (token: string | null) => void) {
        return this.authStore.subscribe(observer);
    }
}
