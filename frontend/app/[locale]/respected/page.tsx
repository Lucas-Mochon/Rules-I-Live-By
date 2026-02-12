'use client';

import RuleEventContent from '@/src/components/ruleEventContent';
import { RuleEventListProvider } from '@/src/providers/ruleEventListProvider';
import { EventTypeEnum } from '@/src/types/enum/eventType';

export default function RespectedPage() {
    return (
        <RuleEventListProvider
            defaultSize={10}
            type={EventTypeEnum.RESPECTED}
        >
            <RuleEventContent />
        </RuleEventListProvider>
    );
}
