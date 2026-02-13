import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { locales, type Locale } from '@/src/i18n/config';
import ClientRedirectWrapper from './clientRedirectWrapper';
import { notFound } from 'next/navigation';

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!locales.includes(locale as Locale)) {
        notFound();
    }

    const messages = await getMessages({ locale });

    return (
        <html lang={locale}>
            <body className="min-h-screen bg-neutral-50">
                <NextIntlClientProvider
                    messages={messages}
                    locale={locale}
                >
                    <ClientRedirectWrapper>{children}</ClientRedirectWrapper>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;
