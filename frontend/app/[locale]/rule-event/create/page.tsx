'use client';

import Background from '@/src/components/background';
import Card from '@/src/components/card';
import { useI18n } from '@/src/i18n/useI18n';
import { RuleEventService } from '@/src/services/ruleEventService';
import { UserStore } from '@/src/store/userStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Rule } from '@/src/models/Rule';
import { RuleService } from '@/src/services/ruleService';
import { EventTypeEnum } from '@/src/types/enum/eventType';

export default function CreateRuleEvent() {
    const { t, locale } = useI18n();
    const router = useRouter();
    const ruleEventService = RuleEventService.getInstance();
    const userStore = UserStore.getInstance();
    const ruleService = RuleService.getInstance();
    const ruleServiceRef = useRef(ruleService);
    const userStoreRef = useRef(userStore);

    const [formData, setFormData] = useState({
        type: EventTypeEnum.RESPECTED,
        ruleId: '',
        emotion: '',
        context: '',
        note: '',
    });
    const [rules, setRules] = useState<Rule[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingRules, setLoadingRules] = useState(true);

    useEffect(() => {
        ruleServiceRef.current = ruleService;
        userStoreRef.current = userStore;
    }, [ruleService, userStore]);

    useEffect(() => {
        const checkAuthAndLoadRules = async () => {
            try {
                const userId = await userStoreRef.current.getUserId();
                if (!userId) {
                    router.push(`/${locale}/user/login`);
                    return;
                }

                const allRules = await ruleServiceRef.current.listAll(userId);
                setRules(allRules);
            } catch (err) {
                console.error('Error loading rules:', err);
                setError(t('error.error' as keyof typeof t));
            } finally {
                setLoadingRules(false);
            }
        };
        checkAuthAndLoadRules();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    const validateForm = (): boolean => {
        if (!formData.type) {
            setError(t('error.typeRequired' as keyof typeof t));
            return false;
        }
        if (!formData.ruleId.trim()) {
            setError(t('error.ruleRequired' as keyof typeof t));
            return false;
        }
        if (!formData.emotion.trim()) {
            setError(t('error.emotionRequired' as keyof typeof t));
            return false;
        }
        if (!formData.context.trim()) {
            setError(t('error.contextRequired' as keyof typeof t));
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError(null);

        try {
            const userId = await userStoreRef.current.getUserId();
            if (!userId) {
                throw new Error('User not authenticated');
            }

            const createdRuleEvent = await ruleEventService.create({
                userId,
                ruleId: formData.ruleId.trim(),
                type: formData.type,
                emotion: formData.emotion.trim(),
                context: formData.context.trim(),
                note: formData.note.trim() || '',
            });

            if (!createdRuleEvent) {
                throw new Error('Failed to create rule event');
            }

            await router.push(`/${locale}/rule-event/${createdRuleEvent.id}`);
        } catch (err) {
            console.error('Rule event creation error:', err);
            setError(t('error.createRuleEventFailed' as keyof typeof t));
        } finally {
            setLoading(false);
        }
    };

    if (loadingRules) {
        return (
            <Background className="flex items-center justify-center min-h-screen p-4">
                <Card>
                    <div className="text-center">
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
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit}
                >
                    <div className="text-center pb-2 border-b border-neutral-200">
                        <h1 className="text-2xl font-bold text-neutral-800">
                            {t('ruleEvent.create' as keyof typeof t)}
                        </h1>
                        <p className="text-xs text-neutral-500 mt-1">
                            {t('ruleEvent.createDescription' as keyof typeof t)}
                        </p>
                    </div>

                    {error && (
                        <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-xs font-medium">
                                {error}
                            </p>
                        </div>
                    )}

                    {rules.length === 0 ? (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-700 text-xs font-medium">
                                {t(
                                    'ruleEvent.noRulesAvailable' as keyof typeof t
                                )}
                            </p>
                            <Link
                                href={`/${locale}/rules/create`}
                                className="text-orange-500 hover:text-orange-600 font-semibold transition text-xs mt-2 inline-block"
                            >
                                {t('rule.create' as keyof typeof t)}
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="type"
                                    className="text-xs font-semibold text-neutral-700"
                                >
                                    {t('ruleEvent.type.type' as keyof typeof t)}
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    className="px-3 py-2 rounded-lg border border-neutral-300 
                                      focus:outline-none focus:ring-2 focus:ring-orange-400 
                                      focus:border-transparent transition duration-200
                                      disabled:bg-neutral-100 disabled:cursor-not-allowed
                                      appearance-none bg-white text-sm"
                                    required
                                >
                                    <option value={EventTypeEnum.RESPECTED}>
                                        {t(
                                            'ruleEvent.type.RESPECTED' as keyof typeof t
                                        )}
                                    </option>
                                    <option value={EventTypeEnum.BROKEN}>
                                        {t(
                                            'ruleEvent.type.BROKEN' as keyof typeof t
                                        )}
                                    </option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="ruleId"
                                    className="text-xs font-semibold text-neutral-700"
                                >
                                    {t('ruleEvent.rule' as keyof typeof t)}
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <select
                                    id="ruleId"
                                    name="ruleId"
                                    value={formData.ruleId}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    className="px-3 py-2 rounded-lg border border-neutral-300 
                                      focus:outline-none focus:ring-2 focus:ring-orange-400 
                                      focus:border-transparent transition duration-200
                                      disabled:bg-neutral-100 disabled:cursor-not-allowed
                                      appearance-none bg-white text-sm"
                                    required
                                >
                                    <option value="">
                                        {t(
                                            'ruleEvent.selectRule' as keyof typeof t
                                        )}
                                    </option>
                                    {rules.map((rule) => (
                                        <option
                                            key={rule.id}
                                            value={rule.id}
                                        >
                                            {rule.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="emotion"
                                    className="text-xs font-semibold text-neutral-700"
                                >
                                    {t('ruleEvent.emotion' as keyof typeof t)}
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    id="emotion"
                                    name="emotion"
                                    type="text"
                                    placeholder={t(
                                        'ruleEvent.emotionPlaceholder' as keyof typeof t
                                    )}
                                    value={formData.emotion}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    maxLength={50}
                                    className="px-3 py-2 rounded-lg border border-neutral-300 
                                      focus:outline-none focus:ring-2 focus:ring-orange-400 
                                      focus:border-transparent transition duration-200 text-sm
                                      disabled:bg-neutral-100 disabled:cursor-not-allowed
                                      placeholder:text-neutral-400"
                                    required
                                />
                                <p className="text-xs text-neutral-400">
                                    {formData.emotion.length}/50
                                </p>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="context"
                                    className="text-xs font-semibold text-neutral-700"
                                >
                                    {t('ruleEvent.context' as keyof typeof t)}
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <textarea
                                    id="context"
                                    name="context"
                                    placeholder={t(
                                        'ruleEvent.contextPlaceholder' as keyof typeof t
                                    )}
                                    value={formData.context}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    maxLength={300}
                                    rows={2}
                                    className="px-3 py-2 rounded-lg border border-neutral-300 
                                      focus:outline-none focus:ring-2 focus:ring-orange-400 
                                      focus:border-transparent transition duration-200 resize-none text-sm
                                      disabled:bg-neutral-100 disabled:cursor-not-allowed
                                      placeholder:text-neutral-400"
                                    required
                                />
                                <p className="text-xs text-neutral-400">
                                    {formData.context.length}/300
                                </p>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label
                                    htmlFor="note"
                                    className="text-xs font-semibold text-neutral-700"
                                >
                                    {t('ruleEvent.note' as keyof typeof t)}
                                </label>
                                <textarea
                                    id="note"
                                    name="note"
                                    placeholder={t(
                                        'ruleEvent.notePlaceholder' as keyof typeof t
                                    )}
                                    value={formData.note}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    maxLength={500}
                                    rows={2}
                                    className="px-3 py-2 rounded-lg border border-neutral-300 
                                      focus:outline-none focus:ring-2 focus:ring-orange-400 
                                      focus:border-transparent transition duration-200 resize-none text-sm
                                      disabled:bg-neutral-100 disabled:cursor-not-allowed
                                      placeholder:text-neutral-400"
                                />
                                <p className="text-xs text-neutral-400">
                                    {formData.note.length}/500
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    !formData.ruleId.trim() ||
                                    !formData.emotion.trim() ||
                                    !formData.context.trim()
                                }
                                className="mt-1 bg-orange-500 hover:bg-orange-600 
                                  text-white font-semibold py-2 rounded-lg text-sm
                                  transition duration-200 shadow-md hover:shadow-lg
                                  disabled:opacity-60 disabled:cursor-not-allowed
                                  active:scale-95"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="animate-spin">⏳</span>
                                        {t('common.loading' as keyof typeof t)}
                                    </span>
                                ) : (
                                    t('ruleEvent.save' as keyof typeof t)
                                )}
                            </button>
                        </>
                    )}

                    <p className="text-center text-xs text-neutral-600 pt-2 border-t border-neutral-200">
                        {t('ruleEvent.cancelQuestion' as keyof typeof t)}{' '}
                        <Link
                            href={`/${locale}/dashboard`}
                            className="text-orange-500 hover:text-orange-600 font-semibold transition"
                        >
                            {t('common.goBack' as keyof typeof t)}
                        </Link>
                    </p>
                </form>
            </Card>
        </Background>
    );
}
