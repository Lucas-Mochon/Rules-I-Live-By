import { AuthStore } from '../store/authStore';
import { UserStore } from '../store/userStore';
import { AuthApiService } from './api/authApiService';
import { LoginResponse } from '../models/LoginResponse';
import { UserService } from './userService';

export class AuthService {
    private static instance: AuthService;

    private authStore = AuthStore.getInstance();
    private userStore = UserStore.getInstance();
    private userService = UserService.getInstance();
    private api = AuthApiService.getInstance();

    private constructor() {}

    static getInstance(): AuthService {
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
        this.userStore.setUser({
            id: res.id,
            email: res.email,
            username: res.username,
        });

        this.authStore.setAuthenticated(true);
        await this.userService.fetchMe();
        return res;
    }

    async login(payload: { email: string; password: string }): Promise<void> {
        const res = await this.api.login(payload);
        this.userStore.setUser({
            id: res.id,
            email: res.email,
            username: res.username,
        });
        this.authStore.setAuthenticated(true);
        await this.userService.fetchMe();
    }

    async logout(): Promise<void> {
        try {
            await this.api.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.authStore.logout();
            this.userStore.removeUser();
        }
    }

    getUser() {
        return this.userStore.getUser();
    }

    isAuthenticated(): boolean {
        return this.authStore.getIsAuthenticated();
    }

    subscribe(observer: (isAuthenticated: boolean) => void): () => void {
        return this.authStore.subscribe(observer);
    }
}
