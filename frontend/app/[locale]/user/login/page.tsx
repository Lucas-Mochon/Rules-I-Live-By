'use client';

import { useState } from 'react';
import Background from '@/src/components/background';
import Card from '@/src/components/card';
import { useI18n } from '@/src/i18n/useI18n';
import Link from 'next/link';
import { AuthService } from '@/src/services/authService';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { t, locale } = useI18n();
    const authService = AuthService.getInstance();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await authService.login({ email, password });
            router.push(`/${locale}/dashboard`);
        } catch {
            setError(t('error.loginFailed'));
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
                        {t('auth.login')}
                    </h1>

                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error}
                        </p>
                    )}

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-neutral-700">
                            {t('auth.email')}
                        </label>
                        <input
                            type="email"
                            placeholder="exemple@email.com"
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
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-neutral-300 
              focus:outline-none focus:ring-2 focus:ring-orange-400 
              focus:border-orange-400 transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`mt-2 bg-orange-500 hover:bg-orange-600 
              text-white font-semibold py-2 rounded-lg 
              transition duration-200 shadow-md hover:shadow-lg
              ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? t('loading') : t('auth.login')}
                    </button>

                    <p className="text-xs text-center text-neutral-500">
                        {t('auth.no_account')}{' '}
                        <Link href={`/${locale}/user/register`}>
                            <span className="text-orange-500 cursor-pointer hover:underline">
                                {t('auth.registration')}
                            </span>
                        </Link>
                    </p>
                </form>
            </Card>
        </Background>
    );
}
