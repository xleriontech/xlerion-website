import React from 'react';
import { Brain, Cpu, TrendingUp, Database } from 'lucide-react';
import AIDetectionDemo from '../components/AIDemo/AIDetectionDemo';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';
import { useAnalytics } from '../hooks/useAnalytics';

export default function AIIntegrationPage() {
    const { t } = useLanguage();
    useAnalytics('AI Integration', 'service');

    return (
        <Layout>
            {/* Banner Parallax */}
            <div className="relative h-[40vh] overflow-hidden">
                <img
                    src="/images/soluciones-parallax.jpg"
                    alt="AI Integration Banner"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-8">
                        <Brain className="text-[#00e9fa] mx-auto mb-4" size={64} />
                        <p className="text-[#00e9fa] font-mono text-xs tracking-[0.4em] uppercase mb-2">{t('ai_integration_banner_subtitle')}</p>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl">{t('ai_integration_banner_title')}</h1>
                    </div>
                </div>
            </div>

            <div className="pt-20 pb-24 px-8 max-w-6xl mx-auto">
                {/* Header */}
                <header className="mb-16">
                    <p className="text-gray-300 max-w-3xl text-lg leading-relaxed">{t('ai_integration_header')}</p>
                </header>

                {/* Key Features */}
                <section className="mb-20">
                    <h2 className="text-4xl font-bold text-white mb-12">
                        <span className="text-[#00e9fa]">//</span> {t('ai_integration_features_title')}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 border border-white/10 bg-white/5 rounded-sm">
                            <Cpu size={24} className="text-[#00e9fa] mb-3" />
                            <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3">{t('ai_integration_feature_1_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('ai_integration_feature_1_desc')}</p>
                        </div>
                        <div className="p-8 border border-white/10 bg-white/5 rounded-sm">
                            <TrendingUp size={24} className="text-[#00e9fa] mb-3" />
                            <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3">{t('ai_integration_feature_2_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('ai_integration_feature_2_desc')}</p>
                        </div>
                        <div className="p-8 border border-white/10 bg-white/5 rounded-sm">
                            <Database size={24} className="text-[#00e9fa] mb-3" />
                            <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3">{t('ai_integration_feature_3_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('ai_integration_feature_3_desc')}</p>
                        </div>
                        <div className="p-8 border border-white/10 bg-white/5 rounded-sm">
                            <Brain size={24} className="text-[#00e9fa] mb-3" />
                            <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3">{t('ai_integration_feature_4_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('ai_integration_feature_4_desc')}</p>
                        </div>
                    </div>
                </section>

                {/* Demo Interactiva */}
                <section className="mb-20">
                    <h2 className="text-4xl font-bold text-white mb-12">
                        <span className="text-[#00e9fa]">//</span> {t('ai_integration_demo_title')}
                    </h2>
                    <AIDetectionDemo />
                </section>

                {/* Use Cases */}
                <section>
                    <h2 className="text-4xl font-bold text-white mb-12">
                        <span className="text-[#00e9fa]">//</span> {t('ai_integration_usecases_title')}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-8 border-l-4 border-[#00e9fa] bg-white/5 rounded-sm">
                            <h3 className="text-white font-bold mb-3">{t('ai_integration_usecase_1_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('ai_integration_usecase_1_desc')}</p>
                        </div>
                        <div className="p-8 border-l-4 border-[#00e9fa] bg-white/5 rounded-sm">
                            <h3 className="text-white font-bold mb-3">{t('ai_integration_usecase_2_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('ai_integration_usecase_2_desc')}</p>
                        </div>
                        <div className="p-8 border-l-4 border-[#00e9fa] bg-white/5 rounded-sm">
                            <h3 className="text-white font-bold mb-3">{t('ai_integration_usecase_3_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('ai_integration_usecase_3_desc')}</p>
                        </div>
                        <div className="p-8 border-l-4 border-[#00e9fa] bg-white/5 rounded-sm">
                            <h3 className="text-white font-bold mb-3">{t('ai_integration_usecase_4_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('ai_integration_usecase_4_desc')}</p>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
