'use client';

import Background from '@/src/components/background';
import Card from '@/src/components/card';
import ErrorComponents from '@/src/components/error';
import Loading from '@/src/components/loading';
import { useI18n } from '@/src/i18n/useI18n';
import { RuleEventService } from '@/src/services/ruleEventService';
import { RuleEventStore } from '@/src/store/ruleEventStore';
import { UserStore } from '@/src/store/userStore';
import { EventTypeEnum } from '@/src/types/enum/eventType';
import { UpdateRuleEvent as UpdateRuleEventDto } from '@/src/types/interfaces/updateRuleEvent';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface FormData {
    type: EventTypeEnum;
    context: string;
    emotion: string;
    note: string;
}

interface OriginalData {
    type: EventTypeEnum;
    context: string;
    emotion: string;
    note: string;
}

export default function UpdateRuleEvent() {
    const { t, locale } = useI18n();
    const router = useRouter();
    const params = useParams();
    const ruleEventId = params.id as string;

    const userStore = UserStore.getInstance();
    const ruleEventStore = RuleEventStore.getInstance();
    const ruleEventService = RuleEventService.getInstance();

    const [formData, setFormData] = useState<FormData>({
        type: EventTypeEnum.RESPECTED,
        context: '',
        emotion: '',
        note: '',
    });
    const [originalData, setOriginalData] = useState<OriginalData>({
        type: EventTypeEnum.RESPECTED,
        context: '',
        emotion: '',
        note: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        if (hasLoaded || !ruleEventId) return;

        const initRuleEvent = async () => {
            try {
                const storedRuleEvent = await ruleEventStore.getRuleEvent();

                if (storedRuleEvent && storedRuleEvent.id === ruleEventId) {
                    const data = {
                        type: storedRuleEvent.type,
                        context: storedRuleEvent.context || '',
                        emotion: storedRuleEvent.emotion || '',
                        note: storedRuleEvent.note || '',
                    };
                    setFormData(data);
                    setOriginalData(data);
                    setInitialLoading(false);
                    setHasLoaded(true);
                    return;
                }

                await ruleEventService.getOne(ruleEventId);
                const ruleEvent = await ruleEventStore.getRuleEvent();

                if (!ruleEvent) {
                    setError(t('error.ruleEventNotFound' as keyof typeof t));
                    setInitialLoading(false);
                    setHasLoaded(true);
                    return;
                }

                const data = {
                    type: ruleEvent.type,
                    context: ruleEvent.context || '',
                    emotion: ruleEvent.emotion || '',
                    note: ruleEvent.note || '',
                };
                setFormData(data);
                setOriginalData(data);
                setInitialLoading(false);
                setHasLoaded(true);
            } catch {
                setError(t('error.loadRuleEventFailed' as keyof typeof t));
                setInitialLoading(false);
                setHasLoaded(true);
            }
        };

        initRuleEvent();
    }, [ruleEventId, hasLoaded, ruleEventService, ruleEventStore, t]);

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
        if (!formData.context.trim()) {
            setError(t('error.contextRequired' as keyof typeof t));
            return false;
        }
        if (!formData.emotion.trim()) {
            setError(t('error.emotionRequired' as keyof typeof t));
            return false;
        }
        return true;
    };

    const hasChanges = (): boolean => {
        return (
            formData.type !== originalData.type ||
            formData.context.trim() !== originalData.context.trim() ||
            formData.emotion.trim() !== originalData.emotion.trim() ||
            formData.note.trim() !== originalData.note.trim()
        );
    };

    const buildUpdatePayload = (): UpdateRuleEventDto => {
        const payload: UpdateRuleEventDto = {
            id: ruleEventId,
            type: formData.type,
            context: formData.context.trim(),
            emotion: formData.emotion.trim(),
            note: formData.note.trim(),
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

            await ruleEventService.update(data);

            router.push(`/${locale}/rule-event/${ruleEventId}`);
        } catch {
            setError(t('error.updateRuleEventFailed' as keyof typeof t));
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <Loading />;
    }

    if (error) {
        return <ErrorComponents message={error}></ErrorComponents>;
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
                            {t('ruleEvent.edit' as keyof typeof t)}
                        </h1>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="type"
                            className="text-sm font-semibold text-neutral-700"
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
                            className="px-4 py-3 rounded-lg border border-neutral-300 
                              focus:outline-none focus:ring-2 focus:ring-orange-400 
                              focus:border-transparent transition duration-200
                              disabled:bg-neutral-100 disabled:cursor-not-allowed
                              bg-white"
                            required
                        >
                            <option value={EventTypeEnum.RESPECTED}>
                                {t(
                                    `ruleEvent.type.${EventTypeEnum.RESPECTED}` as keyof typeof t
                                )}
                            </option>
                            <option value={EventTypeEnum.BROKEN}>
                                {t(
                                    `ruleEvent.type.${EventTypeEnum.BROKEN}` as keyof typeof t
                                )}
                            </option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="emotion"
                            className="text-sm font-semibold text-neutral-700"
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
                            maxLength={100}
                            className="px-4 py-3 rounded-lg border border-neutral-300 
                              focus:outline-none focus:ring-2 focus:ring-orange-400 
                              focus:border-transparent transition duration-200
                              disabled:bg-neutral-100 disabled:cursor-not-allowed
                              placeholder:text-neutral-400"
                            required
                        />
                        <p className="text-xs text-neutral-500">
                            {formData.emotion.length}/100
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="context"
                            className="text-sm font-semibold text-neutral-700"
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
                            {formData.context.length}/500
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="note"
                            className="text-sm font-semibold text-neutral-700"
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
                            rows={3}
                            className="px-4 py-3 rounded-lg border border-neutral-300 
                              focus:outline-none focus:ring-2 focus:ring-orange-400 
                              focus:border-transparent transition duration-200 resize-none
                              disabled:bg-neutral-100 disabled:cursor-not-allowed
                              placeholder:text-neutral-400"
                        />
                        <p className="text-xs text-neutral-500">
                            {formData.note.length}/500
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={
                            loading ||
                            !formData.type ||
                            !formData.context.trim() ||
                            !formData.emotion.trim() ||
                            !hasChanges()
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
                                {t('common.loading' as keyof typeof t)}
                            </span>
                        ) : (
                            t('ruleEvent.save' as keyof typeof t)
                        )}
                    </button>

                    <p className="text-center text-sm text-neutral-600">
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
