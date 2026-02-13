'use client';

import Background from '@/src/components/background';
import { useI18n } from '@/src/i18n/useI18n';
import Link from 'next/link';
import { MdCheckCircle } from 'react-icons/md';

export default function HomePage() {
    const { t, locale } = useI18n();

    return (
        <Background>
            <section className="px-6 py-24 sm:py-40">
                <div className="mx-auto max-w-4xl space-y-8">
                    <div className="space-y-6">
                        <h1 className="text-5xl sm:text-6xl font-bold text-neutral-900 leading-tight">
                            {t('home.title')}
                        </h1>
                        <p className="text-xl sm:text-2xl text-neutral-600 leading-relaxed max-w-2xl">
                            {t('home.subtitle')}
                        </p>
                    </div>

                    <div className="pt-4">
                        <Link
                            href={`/${locale}/user/login`}
                            className="inline-block px-8 py-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
                        >
                            {t('home.cta.getStarted')}
                        </Link>
                    </div>
                </div>
            </section>

            <div className="px-6">
                <div className="mx-auto max-w-4xl h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
            </div>

            <section className="px-6 py-24">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-16">
                        <h2 className="text-4xl font-bold text-neutral-900 mb-4">
                            {t('home.features.title')}
                        </h2>
                        <p className="text-lg text-neutral-600">
                            Découvrez comment notre plateforme peut transformer
                            votre approche de la discipline personnelle.
                        </p>
                    </div>

                    <div className="grid gap-12 sm:grid-cols-2">
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-neutral-100">
                                        <MdCheckCircle className="h-6 w-6 text-neutral-900" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-neutral-900">
                                        {t('home.features.focus.title')}
                                    </h3>
                                    <p className="text-neutral-600 leading-relaxed">
                                        {t('home.features.focus.description')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-neutral-100">
                                        <MdCheckCircle className="h-6 w-6 text-neutral-900" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-neutral-900">
                                        {t('home.features.consistency.title')}
                                    </h3>
                                    <p className="text-neutral-600 leading-relaxed">
                                        {t(
                                            'home.features.consistency.description'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-neutral-100">
                                        <MdCheckCircle className="h-6 w-6 text-neutral-900" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-neutral-900">
                                        {t('home.features.progress.title')}
                                    </h3>
                                    <p className="text-neutral-600 leading-relaxed">
                                        {t(
                                            'home.features.progress.description'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-neutral-100">
                                        <MdCheckCircle className="h-6 w-6 text-neutral-900" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-neutral-900">
                                        {t('home.features.adapt.title')}
                                    </h3>
                                    <p className="text-neutral-600 leading-relaxed">
                                        {t('home.features.adapt.description')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="px-6">
                <div className="mx-auto max-w-4xl h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
            </div>

            <section className="px-6 py-24">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-16">
                        <h2 className="text-4xl font-bold text-neutral-900 mb-4">
                            {t('home.howItWorks.title')}
                        </h2>
                        <p className="text-lg text-neutral-600">
                            {t('home.process')}
                        </p>
                    </div>

                    <div className="space-y-12">
                        <div className="flex gap-8">
                            <div className="shrink-0">
                                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-neutral-900 text-white font-bold text-lg shadow-lg">
                                    1
                                </div>
                            </div>
                            <div className="space-y-3 pt-1">
                                <h3 className="text-2xl font-semibold text-neutral-900">
                                    {t('home.howItWorks.step1.title')}
                                </h3>
                                <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl">
                                    {t('home.howItWorks.step1.description')}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-8">
                            <div className="shrink-0">
                                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-neutral-900 text-white font-bold text-lg shadow-lg">
                                    2
                                </div>
                            </div>
                            <div className="space-y-3 pt-1">
                                <h3 className="text-2xl font-semibold text-neutral-900">
                                    {t('home.howItWorks.step2.title')}
                                </h3>
                                <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl">
                                    {t('home.howItWorks.step2.description')}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-8">
                            <div className="shrink-0">
                                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-neutral-900 text-white font-bold text-lg shadow-lg">
                                    3
                                </div>
                            </div>
                            <div className="space-y-3 pt-1">
                                <h3 className="text-2xl font-semibold text-neutral-900">
                                    {t('home.howItWorks.step3.title')}
                                </h3>
                                <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl">
                                    {t('home.howItWorks.step3.description')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="px-6">
                <div className="mx-auto max-w-4xl h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
            </div>

            <section className="px-6 py-24">
                <div className="mx-auto max-w-3xl text-center space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold text-neutral-900">
                            {t('home.footer.title')}
                        </h2>
                        <p className="text-xl text-neutral-600 leading-relaxed">
                            {t('home.hint')}
                        </p>
                    </div>
                    <Link
                        href={`/${locale}/user/login`}
                        className="inline-block px-8 py-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
                    >
                        {t('home.cta.begin')}
                    </Link>
                </div>
            </section>
        </Background>
    );
}
