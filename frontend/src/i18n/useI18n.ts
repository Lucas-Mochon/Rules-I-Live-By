'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { NestedKeyOf } from './keys';
import { Messages } from './types';

export function useI18n() {
    const locale = useLocale();
    const t = useTranslations();

    return {
        locale,
        t: (key: NestedKeyOf<Messages>) => t(key),
    };
}
