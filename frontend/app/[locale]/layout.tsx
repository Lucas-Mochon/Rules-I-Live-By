import {notFound} from 'next/navigation';
import {routing} from '@/src/i18n/routing';
import { localType } from '@/src/types/enum/localeType';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!routing.locales.includes(locale as localType)) {
    notFound();
  }

  return <>{children}</>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}
