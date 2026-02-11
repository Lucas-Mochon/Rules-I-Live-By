import { User } from '../models/User';

type UserObserver = (user: User | null) => void;

export class UserStore {
    private user: User | null = null;
    private observers: UserObserver[] = [];

    private static instance: UserStore;

    static getInstance() {
        if (!UserStore.instance) {
            UserStore.instance = new UserStore();
        }
        return UserStore.instance;
    }

    private constructor() {}

    getUser() {
        return this.user;
    }

    setUser(user: User) {
        this.user = user;
        this.notifyObservers();
    }

    removeUser() {
        this.user = null;
        this.notifyObservers();
    }

    subscribe(observer: UserObserver) {
        this.observers.push(observer);
        return () => {
            this.observers = this.observers.filter((o) => o !== observer);
        };
    }

    private notifyObservers() {
        this.observers.forEach((o) => o(this.user));
    }
}
