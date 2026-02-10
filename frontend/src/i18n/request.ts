import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import { localType } from '../types/enum/localeType';

export default getRequestConfig(async ({locale}) => {
  if (!locale || !routing.locales.includes(locale as localType)) {
    return {
      locale: routing.defaultLocale,
      messages: (await import(`./messages/${routing.defaultLocale}.json`)).default
    };
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});