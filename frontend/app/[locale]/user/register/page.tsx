'use client';

import { useState } from 'react';
import Card from '@/src/components/card';
import { useI18n } from '@/src/i18n/useI18n';
import Link from 'next/link';
import Background from '@/src/components/background';
import { AuthService } from '@/src/services/authService';
import { useRouter } from 'next/navigation';
import { AuthStore } from '@/src/store/authStore';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';

export default function RegisterPage() {
    const { t, locale } = useI18n();
    const authService = AuthService.getInstance();
    const authStore = AuthStore.getInstance();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const passwordRules = {
        minLength: password.length >= 12,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    const isPasswordValid = Object.values(passwordRules).every(Boolean);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!isPasswordValid) {
            setError(t('error.passwordNotStrong' as keyof typeof t));
            setLoading(false);
            return;
        }

        try {
            await authService.register({ username, email, password });
            if (authStore.getIsAuthenticated())
                router.push(`/${locale}/dashboard`);
            throw new Error('Authentication failed');
        } catch {
            setError(t('error.registrationFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Background className="flex items-center justify-center">
            <Card>
                <form
                    className="w-80 flex flex-col gap-5"
                    onSubmit={handleSubmit}
                >
                    <h1 className="text-2xl font-bold text-center text-neutral-800">
                        {t('auth.register')}
                    </h1>

                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error}
                        </p>
                    )}

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-neutral-700">
                            {t('auth.username')}
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-neutral-300 
              focus:outline-none focus:ring-2 focus:ring-orange-400 
              focus:border-orange-400 transition"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-neutral-700">
                            {t('auth.email')}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-neutral-300 
              focus:outline-none focus:ring-2 focus:ring-orange-400 
              focus:border-orange-400 transition"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-neutral-700">
                            {t('auth.password')}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-neutral-300 
              focus:outline-none focus:ring-2 focus:ring-orange-400 
              focus:border-orange-400 transition"
                            required
                        />

                        {password && (
                            <div className="mt-2 p-3 bg-neutral-50 rounded-lg text-xs space-y-1">
                                <div className="flex items-center gap-2">
                                    {passwordRules.minLength ? (
                                        <HiCheckCircle
                                            className="text-green-500"
                                            size={16}
                                        />
                                    ) : (
                                        <HiXCircle
                                            className="text-red-500"
                                            size={16}
                                        />
                                    )}
                                    <span
                                        className={
                                            passwordRules.minLength
                                                ? 'text-green-600'
                                                : 'text-neutral-600'
                                        }
                                    >
                                        {t('auth.minLength' as keyof typeof t)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {passwordRules.hasUpperCase ? (
                                        <HiCheckCircle
                                            className="text-green-500"
                                            size={16}
                                        />
                                    ) : (
                                        <HiXCircle
                                            className="text-red-500"
                                            size={16}
                                        />
                                    )}
                                    <span
                                        className={
                                            passwordRules.hasUpperCase
                                                ? 'text-green-600'
                                                : 'text-neutral-600'
                                        }
                                    >
                                        {t(
                                            'auth.hasUpperCase' as keyof typeof t
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {passwordRules.hasLowerCase ? (
                                        <HiCheckCircle
                                            className="text-green-500"
                                            size={16}
                                        />
                                    ) : (
                                        <HiXCircle
                                            className="text-red-500"
                                            size={16}
                                        />
                                    )}
                                    <span
                                        className={
                                            passwordRules.hasLowerCase
                                                ? 'text-green-600'
                                                : 'text-neutral-600'
                                        }
                                    >
                                        {t(
                                            'auth.hasLowerCase' as keyof typeof t
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {passwordRules.hasNumber ? (
                                        <HiCheckCircle
                                            className="text-green-500"
                                            size={16}
                                        />
                                    ) : (
                                        <HiXCircle
                                            className="text-red-500"
                                            size={16}
                                        />
                                    )}
                                    <span
                                        className={
                                            passwordRules.hasNumber
                                                ? 'text-green-600'
                                                : 'text-neutral-600'
                                        }
                                    >
                                        {t('auth.hasNumber' as keyof typeof t)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {passwordRules.hasSpecialChar ? (
                                        <HiCheckCircle
                                            className="text-green-500"
                                            size={16}
                                        />
                                    ) : (
                                        <HiXCircle
                                            className="text-red-500"
                                            size={16}
                                        />
                                    )}
                                    <span
                                        className={
                                            passwordRules.hasSpecialChar
                                                ? 'text-green-600'
                                                : 'text-neutral-600'
                                        }
                                    >
                                        {t(
                                            'auth.hasSpecialChar' as keyof typeof t
                                        )}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !isPasswordValid}
                        className={`mt-2 bg-orange-500 hover:bg-orange-600 
              text-white font-semibold py-2 rounded-lg 
              transition duration-200 shadow-md hover:shadow-lg
              ${loading || !isPasswordValid ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? t('loading') : t('auth.register')}
                    </button>

                    <p className="text-xs text-center text-neutral-500">
                        {t('auth.have_account')}{' '}
                        <Link href={`/${locale}/user/login`}>
                            <span className="text-orange-500 cursor-pointer hover:underline">
                                {t('auth.login')}
                            </span>
                        </Link>
                    </p>
                </form>
            </Card>
        </Background>
    );
}
