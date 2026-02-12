import { Response } from './Response';
import { Rule } from './Rule';

export interface ListRules extends Response {
    rules: Rule[];
    page: number;
    size: number;
    offset: number;
    totalElements: number;
}
