import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAnalytics } from '../hooks/useAnalytics';
import SmartTrafficDemo from '../components/SmartTrafficDemo.jsx';

export default function SmartTrafficDemoPage() {
    const { t } = useLanguage();
    useAnalytics('Smart Traffic', 'demo');
    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-1">{t('smart_traffic_title')}</h1>
                <p className="text-white/70 text-sm">{t('smart_traffic_subtitle')}</p>
            </div>
            <SmartTrafficDemo />
        </div>
    );
}
