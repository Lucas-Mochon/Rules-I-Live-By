import { RequestOptions } from '../../types/interfaces/requestOptions';

export class AbstractApiService {
    private baseUrl: string;

    constructor() {
        if (!process.env.NEXT_PUBLIC_API_DOMAIN) {
            throw new Error('API_DOMAIN not defined in env');
        }
        this.baseUrl = process.env.NEXT_PUBLIC_API_DOMAIN;
    }

    private async request(
        path: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        options: RequestOptions = {}
    ) {
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
        return this.request(path, 'GET', options);
    }

    post(path: string, options?: RequestOptions) {
        return this.request(path, 'POST', options);
    }

    put(path: string, options?: RequestOptions) {
        return this.request(path, 'PUT', options);
    }

    delete(path: string, options?: RequestOptions) {
        return this.request(path, 'DELETE', options);
    }
}
