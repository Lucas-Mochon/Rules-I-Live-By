'use client';
import {useI18n} from '@/src/i18n/useI18n';

export default function HomePage() {
  const {t} = useI18n();

  return (
    <main>
      <h1>{t('home.title')}</h1>
    </main>
  );
}
