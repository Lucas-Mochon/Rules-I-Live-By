import { ListRules } from '../models/ListRules';
import { Rule } from '../models/Rule';

type ListRulesObserver = (rules: ListRules | null) => void;
type RuleObserver = (rule: Rule | null) => void;

export class RuleStore {
    private listRules: ListRules | null = null;
    private rule: Rule | null = null;
    private listRulesObserver: ListRulesObserver[] = [];
    private ruleObservers: RuleObserver[] = [];

    private static instance: RuleStore;

    static getInstance(): RuleStore {
        if (!RuleStore.instance) {
            RuleStore.instance = new RuleStore();
        }
        return RuleStore.instance;
    }

    private constructor() {}

    subscribeRule(observer: RuleObserver): void {
        this.ruleObservers.push(observer);
    }

    unsubscribeRule(observer: RuleObserver): void {
        this.ruleObservers = this.ruleObservers.filter(
            (obs) => obs !== observer
        );
    }

    private notifyRuleObservers(): void {
        this.ruleObservers.forEach((observer) => observer(this.rule));
    }

    subscribeRules(observer: ListRulesObserver): void {
        this.listRulesObserver.push(observer);
    }

    unsubscribeRules(observer: ListRulesObserver): void {
        this.listRulesObserver = this.listRulesObserver.filter(
            (obs) => obs !== observer
        );
    }

    private notifyRulesObservers(): void {
        this.listRulesObserver.forEach((observer) => observer(this.listRules));
    }

    async setRule(rule: Rule | null): Promise<void> {
        this.rule = rule;
        this.notifyRuleObservers();
    }

    getRule(): Rule | null {
        return this.rule;
    }

    async setRules(rules: ListRules): Promise<void> {
        this.listRules = rules;
        this.notifyRulesObservers();
    }

    getRules(): ListRules | null {
        return this.listRules;
    }

    async setOneOfRules(rule: Rule): Promise<void> {
        this.rule = rule;
        if (this.listRules) {
            const rules = this.listRules.rules;
            const index = rules.findIndex((r) => r.id == rule.id);
            if (index != -1) {
                this.listRules.rules = [
                    ...rules.slice(0, index),
                    rule,
                    ...rules.slice(index + 1),
                ];
            }
        }
    }
}
