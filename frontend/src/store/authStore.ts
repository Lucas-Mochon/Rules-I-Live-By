type AuthObserver = (isAuthenticated: boolean) => void;

export class AuthStore {
    private isAuthenticated: boolean = false;
    private observers: AuthObserver[] = [];

    private static instance: AuthStore;

    static getInstance(): AuthStore {
        if (!AuthStore.instance) {
            AuthStore.instance = new AuthStore();
        }
        return AuthStore.instance;
    }

    private constructor() {}

    getIsAuthenticated(): boolean {
        return this.isAuthenticated;
    }

    setAuthenticated(authenticated: boolean): void {
        this.isAuthenticated = authenticated;
        this.notifyObservers();
    }

    logout(): void {
        this.isAuthenticated = false;
        this.notifyObservers();
    }

    subscribe(observer: AuthObserver): () => void {
        this.observers.push(observer);
        return () => {
            this.observers = this.observers.filter((o) => o !== observer);
        };
    }

    private notifyObservers(): void {
        this.observers.forEach((o) => o(this.isAuthenticated));
    }
}
