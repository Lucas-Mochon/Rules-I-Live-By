import { useI18n } from '../i18n/useI18n';
import Background from './background';
import Card from './card';

export default function Loading() {
    const { t } = useI18n();

    return (
        <Background className="flex items-center justify-center min-h-screen">
            <Card>
                <div className="text-center py-12">
                    <div className="inline-block animate-spin text-3xl mb-4">
                        ⏳
                    </div>
                    <p className="text-neutral-600">
                        {t('loading' as keyof typeof t)}
                    </p>
                </div>
            </Card>
        </Background>
    );
}
