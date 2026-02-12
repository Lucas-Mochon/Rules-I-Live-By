import { ListRuleEvents } from '../models/listRuleEvents';
import { RuleEvent } from '../models/ruleEvent';

type ListRuleEventsObserver = (rules: ListRuleEvents | null) => void;
type RuleEventObserver = (rule: RuleEvent | null) => void;

export class RuleEventStore {
    private listRuleEvents: ListRuleEvents | null = null;
    private ruleEvent: RuleEvent | null = null;
    private listRulesObserver: ListRuleEventsObserver[] = [];
    private ruleObservers: RuleEventObserver[] = [];

    private static instance: RuleEventStore;

    static getInstance(): RuleEventStore {
        if (!RuleEventStore.instance) {
            RuleEventStore.instance = new RuleEventStore();
        }
        return RuleEventStore.instance;
    }

    private constructor() {}

    subscribeRuleEvent(observer: RuleEventObserver): void {
        this.ruleObservers.push(observer);
    }

    unsubscribeRuleEvent(observer: RuleEventObserver): void {
        this.ruleObservers = this.ruleObservers.filter(
            (obs) => obs !== observer
        );
    }

    private notifyRuleEventObservers(): void {
        this.ruleObservers.forEach((observer) => observer(this.ruleEvent));
    }

    subscribeRuleEvents(observer: ListRuleEventsObserver): void {
        this.listRulesObserver.push(observer);
    }

    unsubscribeRuleEvents(observer: ListRuleEventsObserver): void {
        this.listRulesObserver = this.listRulesObserver.filter(
            (obs) => obs !== observer
        );
    }

    private notifyRuleEventsObservers(): void {
        this.listRulesObserver.forEach((observer) =>
            observer(this.listRuleEvents)
        );
    }

    async setRuleEvent(ruleEvent: RuleEvent | null): Promise<void> {
        this.ruleEvent = ruleEvent;
        this.notifyRuleEventObservers();
    }

    getRuleEvent(): RuleEvent | null {
        return this.ruleEvent;
    }

    async setRuleEvents(ruleEvents: ListRuleEvents): Promise<void> {
        this.listRuleEvents = ruleEvents;
        this.notifyRuleEventsObservers();
    }

    getRuleEvents(): ListRuleEvents | null {
        return this.listRuleEvents;
    }

    async setOneOfRuleEvents(ruleEvent: RuleEvent): Promise<void> {
        this.ruleEvent = ruleEvent;
        if (this.listRuleEvents) {
            const ruleEvents = this.listRuleEvents.rules;
            const index = ruleEvents.findIndex((r) => r.id == ruleEvent.id);
            if (index != -1) {
                this.listRuleEvents.rules = [
                    ...ruleEvents.slice(0, index),
                    ruleEvent,
                    ...ruleEvents.slice(index + 1),
                ];
            }
        }
    }
}
