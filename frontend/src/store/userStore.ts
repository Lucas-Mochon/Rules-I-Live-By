import { User } from '../models/User';
import { UserService } from '../services/userService';

type UserObserver = (user: User | null) => void;

export class UserStore {
    private user: User | null = null;
    private observers: UserObserver[] = [];
    private userService: UserService | null = null;

    private static instance: UserStore;

    static getInstance(): UserStore {
        if (!UserStore.instance) {
            UserStore.instance = new UserStore();
        }
        return UserStore.instance;
    }

    private constructor() {}

    private getUserService(): UserService {
        if (!this.userService) {
            this.userService = UserService.getInstance();
        }
        return this.userService;
    }

    getUser(): User | null {
        return this.user;
    }

    setUser(user: User): void {
        this.user = user;
        this.notifyObservers();
    }

    removeUser(): void {
        this.user = null;
        this.notifyObservers();
    }

    async getUserId(): Promise<string> {
        if (!this.user?.id) {
            const user: User = await this.getUserService().fetchMe();
            return user.id;
        }
        return this.user?.id;
    }

    subscribe(observer: UserObserver): () => void {
        this.observers.push(observer);
        return () => {
            this.observers = this.observers.filter((o) => o !== observer);
        };
    }

    private notifyObservers(): void {
        this.observers.forEach((o) => o(this.user));
    }
}
