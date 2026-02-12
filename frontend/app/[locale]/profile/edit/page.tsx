'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Background from '@/src/components/background';
import Card from '@/src/components/card';
import { useI18n } from '@/src/i18n/useI18n';
import { UserStore } from '@/src/store/userStore';
import { User } from '@/src/models/User';
import { MdArrowBack, MdCheck } from 'react-icons/md';
import { UserService } from '@/src/services/userService';
import { UpdateUser } from '@/src/types/interfaces/updateUser';

export default function ProfileEditPage() {
    const { t, locale } = useI18n();
    const router = useRouter();
    const userStore = UserStore.getInstance();
    const userService = UserService.getInstance();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ username: '', email: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = userStore.getUser();
                if (!currentUser) {
                    router.push(`/${locale}/user/login`);
                    return;
                }
                setUser(currentUser);
                setFormData({
                    username: currentUser.username,
                    email: currentUser.email,
                });
                setLoading(false);
            } catch (err) {
                void err;
                setError(t('error.loadProfileFailed' as keyof typeof t));
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormData((prevFormData) => {
                const newFormData = { ...prevFormData, [name]: value };

                if (user) {
                    const hasUsernameChanged =
                        newFormData.username !== user.username;
                    const hasEmailChanged = newFormData.email !== user.email;
                    setHasChanges(hasUsernameChanged || hasEmailChanged);
                }

                return newFormData;
            });

            setError(null);
            setSuccessMessage(null);
        },
        [user]
    );

    const validateForm = (): boolean => {
        if (!formData.username.trim()) {
            setError(t('error.usernameRequired' as keyof typeof t));
            return false;
        }
        if (!formData.email.trim()) {
            setError(t('error.emailRequired' as keyof typeof t));
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError(t('error.invalidEmail' as keyof typeof t));
            return false;
        }
        return true;
    };

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (
            user &&
            formData.username === user.username &&
            formData.email === user.email
        ) {
            setError(t('error.noChanges' as keyof typeof t));
            return;
        }

        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            if (user) {
                const data: UpdateUser = {
                    userId: user.id,
                    username: formData.username.trim(),
                    email: formData.email.trim(),
                };
                const updatedUser = await userService.update(data);

                setUser(updatedUser);
                setHasChanges(false);
                setSuccessMessage(t('profile.updateSuccess' as keyof typeof t));

                router.push(`/${locale}/profile`);
            }
        } catch (err) {
            void err;
            setError(t('error.updateProfileFailed' as keyof typeof t));
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    if (loading) {
        return (
            <Background className="flex items-center justify-center min-h-screen">
                <div className="text-neutral-600">
                    {t('common.loading' as keyof typeof t)}
                </div>
            </Background>
        );
    }

    if (error && !user) {
        return (
            <Background className="flex items-center justify-center min-h-screen p-4">
                <Card>
                    <div className="text-center">
                        <p className="text-neutral-600 mb-4">{error}</p>
                        <button
                            onClick={() => router.push(`/${locale}/profile`)}
                            className="text-orange-500 hover:text-orange-600 font-semibold transition"
                        >
                            {t('common.goBack' as keyof typeof t)}
                        </button>
                    </div>
                </Card>
            </Background>
        );
    }

    return (
        <Background className="flex items-center justify-center min-h-screen p-4">
            <div className="max-w-2xl mx-auto w-full">
                <button
                    onClick={handleCancel}
                    className="mb-6 flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold transition"
                >
                    <MdArrowBack size={20} />
                    {t('common.goBack' as keyof typeof t)}
                </button>

                <Card>
                    <div className="flex flex-col gap-6">
                        <div className="pb-6 border-b border-neutral-200">
                            <h1 className="text-3xl font-bold text-neutral-800">
                                {t('profile.editTitle' as keyof typeof t)}
                            </h1>
                            <p className="text-sm text-neutral-500 mt-2">
                                {t('profile.editDescription' as keyof typeof t)}
                            </p>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 text-sm font-medium">
                                    {error}
                                </p>
                            </div>
                        )}

                        {successMessage && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                                <MdCheck className="w-5 h-5 text-green-600 shrink-0" />
                                <p className="text-green-700 text-sm font-medium">
                                    {successMessage}
                                </p>
                            </div>
                        )}

                        <form
                            onSubmit={handleSaveChanges}
                            className="flex flex-col gap-6"
                        >
                            <div className="flex flex-col gap-3">
                                <label
                                    htmlFor="username"
                                    className="text-sm font-semibold text-neutral-700"
                                >
                                    {t('profile.username' as keyof typeof t)}
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder={t(
                                        'profile.usernamePlaceholder' as keyof typeof t
                                    )}
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    disabled={isSaving}
                                    maxLength={50}
                                    className="px-4 py-3 rounded-lg border border-neutral-300 
                                      focus:outline-none focus:ring-2 focus:ring-orange-400 
                                      focus:border-transparent transition duration-200
                                      disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-600
                                      placeholder:text-neutral-400"
                                    required
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-neutral-500">
                                        {t(
                                            'profile.minChars' as keyof typeof t
                                        )}
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                        {formData.username.length}/50
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-semibold text-neutral-700"
                                >
                                    {t('profile.email' as keyof typeof t)}
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder={t(
                                        'profile.emailPlaceholder' as keyof typeof t
                                    )}
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={isSaving}
                                    maxLength={100}
                                    className="px-4 py-3 rounded-lg border border-neutral-300 
                                      focus:outline-none focus:ring-2 focus:ring-orange-400 
                                      focus:border-transparent transition duration-200
                                      disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-600
                                      placeholder:text-neutral-400"
                                    required
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-neutral-500">
                                        {t(
                                            'profile.validEmail' as keyof typeof t
                                        )}
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                        {formData.email.length}/100
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={
                                        isSaving ||
                                        !hasChanges ||
                                        !formData.username.trim() ||
                                        !formData.email.trim()
                                    }
                                    className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 
                                      text-white font-semibold py-3 rounded-lg 
                                      transition duration-200 shadow-md hover:shadow-lg
                                      disabled:opacity-60 disabled:cursor-not-allowed
                                      active:scale-95"
                                >
                                    {isSaving ? (
                                        <>
                                            <span className="animate-spin">
                                                ⏳
                                            </span>
                                            {t(
                                                'common.saving' as keyof typeof t
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <MdCheck size={20} />
                                            {t(
                                                'profile.saveChanges' as keyof typeof t
                                            )}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    className="flex-1 bg-neutral-200 hover:bg-neutral-300 
                                      text-neutral-800 font-semibold py-3 rounded-lg 
                                      transition duration-200
                                      disabled:opacity-60 disabled:cursor-not-allowed
                                      active:scale-95"
                                >
                                    {t('common.cancel' as keyof typeof t)}
                                </button>
                            </div>
                        </form>
                    </div>
                </Card>
            </div>
        </Background>
    );
}
