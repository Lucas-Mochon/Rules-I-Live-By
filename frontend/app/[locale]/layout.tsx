import {notFound} from 'next/navigation';
import {I18nProvider} from '@/src/i18n/I18nProvider';
import {locales, Locale} from '@/src/i18n/config';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const {locale} = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = (await import(
    `@/src/i18n/messages/${locale}.json`
  )).default;

  return (
    <I18nProvider locale={locale as Locale} messages={messages}>
      {children}
    </I18nProvider>
  );
}

export function generateStaticParams() {
  return locales.map(locale => ({locale}));
}
