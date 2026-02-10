'use client';

import {useI18n} from '@/src/i18n/useI18n';
import Link from 'next/link';

export default function HomePage() {
  const {t} = useI18n();

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="px-6 py-20 sm:py-32">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-semibold text-neutral-900 leading-tight">
              {t('home.title')}
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              {t('home.subtitle')}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/rules"
              className="px-6 py-3 bg-neutral-900 text-white rounded-sm hover:bg-neutral-800 transition-colors font-medium"
            >
              {t('home.cta.getStarted')}
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 border border-neutral-300 text-neutral-900 rounded-sm hover:bg-neutral-100 transition-colors font-medium"
            >
              {t('home.cta.learnMore')}
            </Link>
          </div>
        </div>
      </section>

      <div className="px-6">
        <div className="mx-auto max-w-3xl h-px bg-neutral-200" />
      </div>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl space-y-12">
          <h2 className="text-2xl font-semibold text-neutral-900">
            {t('home.features.title')}
          </h2>

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-sm bg-neutral-200" />
              <h3 className="text-lg font-medium text-neutral-900">
                {t('home.features.focus.title')}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {t('home.features.focus.description')}
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-sm bg-neutral-200" />
              <h3 className="text-lg font-medium text-neutral-900">
                {t('home.features.consistency.title')}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {t('home.features.consistency.description')}
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-sm bg-neutral-200" />
              <h3 className="text-lg font-medium text-neutral-900">
                {t('home.features.progress.title')}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {t('home.features.progress.description')}
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-sm bg-neutral-200" />
              <h3 className="text-lg font-medium text-neutral-900">
                {t('home.features.adapt.title')}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {t('home.features.adapt.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="px-6">
        <div className="mx-auto max-w-3xl h-px bg-neutral-200" />
      </div>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl space-y-12">
          <h2 className="text-2xl font-semibold text-neutral-900">
            {t('home.howItWorks.title')}
          </h2>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-neutral-900 text-white font-semibold text-sm">
                  1
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-neutral-900">
                  {t('home.howItWorks.step1.title')}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {t('home.howItWorks.step1.description')}
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-neutral-900 text-white font-semibold text-sm">
                  2
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-neutral-900">
                  {t('home.howItWorks.step2.title')}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {t('home.howItWorks.step2.description')}
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-neutral-900 text-white font-semibold text-sm">
                  3
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-neutral-900">
                  {t('home.howItWorks.step3.title')}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {t('home.howItWorks.step3.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="px-6">
        <div className="mx-auto max-w-3xl h-px bg-neutral-200" />
      </div>
      
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-neutral-900">
              {t('home.footer.title')}
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              {t('home.hint')}
            </p>
          </div>
          <Link
            href="/rules"
            className="inline-block px-8 py-3 bg-neutral-900 text-white rounded-sm hover:bg-neutral-800 transition-colors font-medium"
          >
            {t('home.cta.begin')}
          </Link>
        </div>
      </section>
    </main>
  );
}
