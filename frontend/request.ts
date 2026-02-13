import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale, Locale } from './src/i18n/config';

export default getRequestConfig(async ({ locale }) => {
    if (!locale || !locales.includes(locale as Locale)) {
        locale = defaultLocale;
    }

    return {
        locale,
        messages: (await import(`./src/i18n/messages/${locale}.json`)).default,
    };
});
