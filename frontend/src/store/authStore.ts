import Cookies from 'js-cookie';

type AuthObserver = (token: string | null) => void;

export class AuthStore {
    private token: string | null = null;
    private observers: AuthObserver[] = [];

    private static instance: AuthStore;

    static getInstance() {
        if (!AuthStore.instance) {
            AuthStore.instance = new AuthStore();
        }
        return AuthStore.instance;
    }

    private constructor() {
        const token = Cookies.get('jwtToken');
        if (token) {
            this.token = token;
        }
    }

    getToken() {
        return this.token;
    }

    async setToken(token: string) {
        this.token = token;
        Cookies.set('jwtToken', token);
        this.notifyObservers();
    }

    isAuthenticated() {
        return !!this.token;
    }

    logout() {
        this.token = null;
        Cookies.remove('jwtToken');
        this.notifyObservers();
    }

    subscribe(observer: AuthObserver) {
        this.observers.push(observer);
        return () => {
            this.observers = this.observers.filter((o) => o !== observer);
        };
    }

    private notifyObservers() {
        this.observers.forEach((o) => o(this.token));
    }
}
