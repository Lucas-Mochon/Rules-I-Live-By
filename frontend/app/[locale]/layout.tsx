import { I18nProvider } from '@/src/i18n/I18nProvider';
import { locales, Locale } from '@/src/i18n/config';
import ClientRedirectWrapper from './clientRedirectWrapper';

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { locale: string } | Promise<{ locale: string }>;
}) {
    const resolvedParams = await params;
    const { locale } = resolvedParams;

    if (!locales.includes(locale as Locale)) {
        return null;
    }

    const messages = (await import(`@/src/i18n/messages/${locale}.json`))
        .default;

    return (
        <I18nProvider
            locale={locale as Locale}
            messages={messages}
        >
            <div className="min-h-screen bg-neutral-50">
                <ClientRedirectWrapper>{children}</ClientRedirectWrapper>
            </div>
        </I18nProvider>
    );
}

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}
