import { Response } from './Response';

export interface LoginResponse extends Response {
    id: string;
    email: string;
    username: string;
    jwtToken: string;
}
