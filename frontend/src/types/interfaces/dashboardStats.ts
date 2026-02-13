import { Rule } from '@/src/models/Rule';
import { StatsRespected } from './statsRespected';

export interface DashboardStats {
    taux: StatsRespected;
    mostBroken: Rule;
    mostRespected: Rule;
}
