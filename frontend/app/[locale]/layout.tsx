import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { locales, type Locale } from '@/src/i18n/config';
import { notFound } from 'next/navigation';
import { ClientRedirectWrapper } from './clientRedirectWrapper';
import Navbar from '@/src/components/navbar';

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
        <div lang={locale}>
            <div className="min-h-screen bg-neutral-50">
                <NextIntlClientProvider
                    messages={messages}
                    locale={locale}
                >
                    <ClientRedirectWrapper>
                        <Navbar />
                        {children}
                    </ClientRedirectWrapper>
                </NextIntlClientProvider>
            </div>
        </div>
    );
}

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;
