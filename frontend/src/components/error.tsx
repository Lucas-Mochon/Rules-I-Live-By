import { ReactNode } from 'react';
import Background from '@/src/components/background';
import Card from '@/src/components/card';
import { useI18n } from '@/src/i18n/useI18n';
import { useRouter } from 'next/navigation';

interface ErrorComponentsProps {
    children?: ReactNode;
    message: string;
    showButton?: boolean;
    buttonText?: string;
    onButtonClick?: () => void;
    className?: string;
}

export default function ErrorComponents({
    children,
    message,
    showButton = false,
    buttonText,
    onButtonClick,
    className = '',
}: ErrorComponentsProps) {
    const { t, locale } = useI18n();
    const router = useRouter();

    const handleClick = () => {
        if (onButtonClick) {
            onButtonClick();
        } else {
            router.push(`/${locale}/dashboard`);
        }
    };

    return (
        <Background className="flex items-center justify-center min-h-screen p-4">
            <Card className={className}>
                <div className="text-center">
                    <p className="text-neutral-600 mb-4">{message}</p>
                    {children}
                    {showButton && (
                        <button
                            onClick={handleClick}
                            className="text-orange-500 hover:text-orange-600 font-semibold transition"
                        >
                            {buttonText || t('common.goBack' as keyof typeof t)}
                        </button>
                    )}
                </div>
            </Card>
        </Background>
    );
}
