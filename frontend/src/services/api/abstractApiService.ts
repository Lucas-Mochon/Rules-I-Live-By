import { RequestType } from '@/src/types/enum/requestType';
import { RequestOptions } from '../../types/interfaces/requestOptions';
import { AuthStore } from '@/src/store/authStore';

export class AbstractApiService {
    private baseUrl: string;
    protected authStore = AuthStore.getInstance();
    private isRefreshing = false;
    private refreshPromise: Promise<string | null> | null = null;

    constructor() {
        if (!process.env.NEXT_PUBLIC_API_DOMAIN) {
            throw new Error('API_DOMAIN not defined in env');
        }
        this.baseUrl = process.env.NEXT_PUBLIC_API_DOMAIN;
    }

    private async refreshToken(): Promise<string | null> {
        if (this.isRefreshing) {
            return this.refreshPromise;
        }

        this.isRefreshing = true;

        this.refreshPromise = (async () => {
            try {
                const token = this.authStore.getToken();
                if (!token) {
                    this.authStore.logout();
                    return null;
                }

                const res = await fetch(`${this.baseUrl}/auth/refresh`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    this.authStore.logout();
                    return null;
                }

                const data = await res.json();
                const newToken = data.data;

                this.authStore.setToken(newToken);
                return newToken;
            } catch (error) {
                console.error('Token refresh failed:', error);
                this.authStore.logout();
                return null;
            } finally {
                this.isRefreshing = false;
                this.refreshPromise = null;
            }
        })();

        return this.refreshPromise;
    }

    private async request(
        path: string,
        method: RequestType,
        options: RequestOptions = {},
        retry = true
    ): Promise<any> {
        const { body, token, headers } = options;

        const fetchOptions: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...headers,
            },
            ...(body ? { body: JSON.stringify(body) } : {}),
        };

        const res = await fetch(`${this.baseUrl}${path}`, fetchOptions);

        if (res.status === 403 && retry) {
            const newToken = await this.refreshToken();

            if (newToken) {
                return this.request(path, method, options, false);
            } else {
                this.authStore.logout();
                throw new Error('Session expired. Please login again.');
            }
        }

        if (!res.ok) {
            let errorData;
            try {
                errorData = await res.json();
            } catch {
                errorData = null;
            }
            throw new Error(
                errorData?.message || `HTTP ${res.status}: ${res.statusText}`
            );
        }

        return res.json().catch(() => null);
    }

    get(path: string, options?: RequestOptions) {
        return this.request(path, RequestType.GET, options);
    }

    post(path: string, options?: RequestOptions) {
        return this.request(path, RequestType.POST, options);
    }

    put(path: string, options?: RequestOptions) {
        return this.request(path, RequestType.PUT, options);
    }

    delete(path: string, options?: RequestOptions) {
        return this.request(path, RequestType.DELETE, options);
    }
}
