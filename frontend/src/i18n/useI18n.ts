import {useI18nContext} from './I18nProvider';
import {Messages} from './types';
import {NestedKeyOf} from './keys';

export function useI18n() {
  const {locale, messages} = useI18nContext();

  function t(key: NestedKeyOf<Messages>): string {
    const parts = key.split('.') as Array<keyof Messages | string>;

    let value: unknown = messages;

    for (const part of parts) {
      if (
        typeof value === 'object' &&
        value !== null &&
        part in value
      ) {
        value = (value as Record<string, unknown>)[part];
      } else {
        return `missing translation: ${key}`;
      }
    }

    return typeof value === 'string'
      ? value
      : `missing translation: ${key}`;
  }

  return {locale, t};
}
