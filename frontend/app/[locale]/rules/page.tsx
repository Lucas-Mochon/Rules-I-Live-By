'use client';

import { RuleListProvider } from '@/src/providers/ruleListProviders';
import RulesPageContent from './rulePageContent';

export default function RulesPage() {
    return (
        <RuleListProvider defaultSize={10}>
            <RulesPageContent />
        </RuleListProvider>
    );
}
