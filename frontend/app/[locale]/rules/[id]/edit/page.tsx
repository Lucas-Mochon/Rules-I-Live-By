'use client';

import Background from '@/src/components/background';
import Card from '@/src/components/card';
import { useI18n } from '@/src/i18n/useI18n';
import { RuleService } from '@/src/services/ruleService';
import { RuleStore } from '@/src/store/rulesStore';
import { UserStore } from '@/src/store/userStore';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RuleStatus } from '@/src/types/enum/ruleStatus';
import { UpdateRule as UpdateRuleDto } from '@/src/types/interfaces/updateRule';

interface FormData {
    title: string;
    description: string;
}

interface OriginalData {
    title: string;
    description: string;
}

export default function UpdateRule() {
    const { t, locale } = useI18n();
    const router = useRouter();
    const params = useParams();
    const ruleId = params.id as string;

    const userStore = UserStore.getInstance();
    const ruleStore = RuleStore.getInstance();
    const ruleService = RuleService.getInstance();

    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
    });
    const [originalData, setOriginalData] = useState<OriginalData>({
        title: '',
        description: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        if (hasLoaded || !ruleId) return;

        const initRule = async () => {
            try {
                const storedRule = await ruleStore.getRule();

                if (storedRule && storedRule.id === ruleId) {
                    if (storedRule.status === RuleStatus.ARCHIVED) {
                        router.push(`/${locale}/rules`);
                        return;
                    }

                    const data = {
                        title: storedRule.title,
                        description: storedRule.description,
                    };
                    setFormData(data);
                    setOriginalData(data);
                    setInitialLoading(false);
                    setHasLoaded(true);
                    return;
                }

                await ruleService.getOne(ruleId);
                const rule = ruleStore.getRule();

                if (!rule) {
                    setError(t('error.ruleNotFound' as keyof typeof t));
                    setInitialLoading(false);
                    setHasLoaded(true);
                    return;
                }

                if (rule.status === RuleStatus.ARCHIVED) {
                    router.push(`/${locale}/rules`);
                    return;
                }

                const data = {
                    title: rule.title,
                    description: rule.description,
                };
                setFormData(data);
                setOriginalData(data);
                setInitialLoading(false);
                setHasLoaded(true);
            } catch (err) {
                void err;
                setError(t('error.loadRuleFailed' as keyof typeof t));
                setInitialLoading(false);
                setHasLoaded(true);
            }
        };

        initRule();
    }, [ruleId, hasLoaded, ruleService, ruleStore, router, locale, t]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    const validateForm = (): boolean => {
        if (!formData.title.trim()) {
            setError(t('error.titleRequired'));
            return false;
        }
        if (!formData.description.trim()) {
            setError(t('error.descriptionRequired'));
            return false;
        }
        return true;
    };

    const buildUpdatePayload = (): UpdateRuleDto => {
        const payload: UpdateRuleDto = {
            id: ruleId,
            title:
                formData.title.trim() !== originalData.title.trim()
                    ? formData.title.trim()
                    : null,
            description:
                formData.description.trim() !== originalData.description.trim()
                    ? formData.description.trim()
                    : null,
        };
        return payload;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError(null);

        try {
            const userId = await userStore.getUserId();
            if (!userId) {
                throw new Error('User not authenticated');
            }

            const data = buildUpdatePayload();

            await ruleService.update(data);

            const updatedRule = ruleStore.getRule();

            if (!updatedRule) {
                throw new Error('Failed to update rule');
            }

            router.push(`/${locale}/rules/${ruleId}`);
        } catch (err) {
            void err;
            setError(t('error.updateRuleFailed' as keyof typeof t));
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <Background className="flex items-center justify-center min-h-screen p-4">
                <Card>
                    <div className="text-center py-8">
                        <p className="text-neutral-600">
                            {t('common.loading' as keyof typeof t)}
                        </p>
                    </div>
                </Card>
            </Background>
        );
    }

    return (
        <Background className="flex items-center justify-center min-h-screen p-4">
            <Card>
                <form
                    className="flex flex-col gap-6"
                    onSubmit={handleSubmit}
                >
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-neutral-800">
                            {t('rule.edit')}
                        </h1>
                        <p className="text-sm text-neutral-500 mt-2">
                            {t('rule.editRule' as keyof typeof t)}
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm font-medium">
                                {error}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="title"
                            className="text-sm font-semibold text-neutral-700"
                        >
                            {t('rule.title')}
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder={t('rule.titlePlaceholder')}
                            value={formData.title}
                            onChange={handleInputChange}
                            disabled={loading}
                            maxLength={100}
                            className="px-4 py-3 rounded-lg border border-neutral-300 
                              focus:outline-none focus:ring-2 focus:ring-orange-400 
                              focus:border-transparent transition duration-200
                              disabled:bg-neutral-100 disabled:cursor-not-allowed
                              placeholder:text-neutral-400"
                            required
                        />
                        <p className="text-xs text-neutral-500">
                            {formData.title.length}/100
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="description"
                            className="text-sm font-semibold text-neutral-700"
                        >
                            {t('rule.description')}
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder={t('rule.descriptionPlaceholder')}
                            value={formData.description}
                            onChange={handleInputChange}
                            disabled={loading}
                            maxLength={500}
                            rows={4}
                            className="px-4 py-3 rounded-lg border border-neutral-300 
                              focus:outline-none focus:ring-2 focus:ring-orange-400 
                              focus:border-transparent transition duration-200 resize-none
                              disabled:bg-neutral-100 disabled:cursor-not-allowed
                              placeholder:text-neutral-400"
                            required
                        />
                        <p className="text-xs text-neutral-500">
                            {formData.description.length}/500
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={
                            loading ||
                            !formData.title.trim() ||
                            !formData.description.trim()
                        }
                        className="mt-2 bg-orange-500 hover:bg-orange-600 
                          text-white font-semibold py-3 rounded-lg 
                          transition duration-200 shadow-md hover:shadow-lg
                          disabled:opacity-60 disabled:cursor-not-allowed
                          active:scale-95"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin">⏳</span>
                                {t('loading')}
                            </span>
                        ) : (
                            t('rule.save')
                        )}
                    </button>

                    <p className="text-center text-sm text-neutral-600">
                        {t('rule.cancelQuestion')}{' '}
                        <Link
                            href={`/${locale}/rules`}
                            className="text-orange-500 hover:text-orange-600 font-semibold transition"
                        >
                            {t('common.goBack')}
                        </Link>
                    </p>
                </form>
            </Card>
        </Background>
    );
}
