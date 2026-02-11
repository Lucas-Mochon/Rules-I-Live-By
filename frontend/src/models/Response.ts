export interface Response<T = unknown> {
    data: T;
    message: string;
    success: boolean;
    timestamp: string;
}
