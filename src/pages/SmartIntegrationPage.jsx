import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Box, Brain, Lock, GitBranch, BarChart3 } from 'lucide-react';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';
import { useAnalytics } from '../hooks/useAnalytics';

export default function SmartIntegrationPage() {
    const { t } = useLanguage();
    useAnalytics('Smart Integration', 'project');

    return (
        <Layout>
            {/* Banner Parallax */}
            <div className="relative h-[40vh] overflow-hidden">
                <img
                    src="/images/soluciones-parallax.jpg"
                    alt="Smart Integration Banner"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-8">
                        <Zap className="text-[#00e9fa] mx-auto mb-4" size={64} />
                        <p className="text-[#00e9fa] font-mono text-xs tracking-[0.4em] uppercase mb-2">{t('smart_integration_banner_subtitle')}</p>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl">{t('smart_integration_banner_title')}</h1>
                    </div>
                </div>
            </div>

            <div className="pt-20 pb-24 px-8 max-w-6xl mx-auto">
                {/* Header */}
                <header className="mb-16">
                    <p className="text-gray-300 max-w-3xl text-lg leading-relaxed">{t('smart_integration_header')}</p>
                </header>

                {/* Core Technologies */}
                <section className="mb-20">
                    <h2 className="text-4xl font-bold text-white mb-12">
                        <span className="text-[#00e9fa]">//</span> {t('smart_integration_tech_section')}
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Link to="/proyectos/smart-integration/ai" className="p-8 border border-white/10 bg-white/5 rounded-sm hover:bg-white/10 hover:border-[#00e9fa]/50 transition-all cursor-pointer">
                            <Brain size={24} className="text-[#00e9fa] mb-3" />
                            <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3">{t('smart_integration_ai_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('smart_integration_ai_desc')}</p>
                        </Link>
                        <Link to="/proyectos/smart-integration/blockchain" className="p-8 border border-white/10 bg-white/5 rounded-sm hover:bg-white/10 hover:border-[#00e9fa]/50 transition-all cursor-pointer">
                            <Lock size={24} className="text-[#00e9fa] mb-3" />
                            <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3">{t('smart_integration_blockchain_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('smart_integration_blockchain_desc')}</p>
                        </Link>
                        <Link to="/proyectos/smart-integration/iot" className="p-8 border border-white/10 bg-white/5 rounded-sm hover:bg-white/10 hover:border-[#00e9fa]/50 transition-all cursor-pointer">
                            <Box size={24} className="text-[#00e9fa] mb-3" />
                            <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3">{t('smart_integration_iot_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('smart_integration_iot_desc')}</p>
                        </Link>
                        <Link to="/proyectos/smart-integration/analytics" className="p-8 border border-white/10 bg-white/5 rounded-sm hover:bg-white/10 hover:border-[#00e9fa]/50 transition-all cursor-pointer">
                            <BarChart3 size={24} className="text-[#00e9fa] mb-3" />
                            <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3">{t('smart_integration_analytics_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('smart_integration_analytics_desc')}</p>
                        </Link>
                        <Link to="/proyectos/smart-integration/api" className="p-8 border border-white/10 bg-white/5 rounded-sm hover:bg-white/10 hover:border-[#00e9fa]/50 transition-all cursor-pointer">
                            <GitBranch size={24} className="text-[#00e9fa] mb-3" />
                            <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3">{t('smart_integration_api_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('smart_integration_api_desc')}</p>
                        </Link>
                        <Link to="/proyectos/smart-integration/simulation" className="p-8 border border-white/10 bg-white/5 rounded-sm hover:bg-white/10 hover:border-[#00e9fa]/50 transition-all cursor-pointer">
                            <Zap size={24} className="text-[#00e9fa] mb-3" />
                            <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3">{t('smart_integration_simulation_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('smart_integration_simulation_desc')}</p>
                        </Link>
                    </div>
                </section>

                {/* Key Features */}
                <section className="mb-20">
                    <h2 className="text-4xl font-bold text-white mb-12">
                        <span className="text-[#00e9fa]">//</span> {t('smart_integration_features_section')}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="p-8 border border-white/10 bg-white/5 rounded-sm">
                            <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <span className="text-[#00e9fa]">→</span> {t('smart_integration_modularity_title')}
                            </h3>
                            <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
                                <li>• {t('smart_integration_modularity_1')}</li>
                                <li>• {t('smart_integration_modularity_2')}</li>
                                <li>• {t('smart_integration_modularity_3')}</li>
                            </ul>
                        </div>
                        <div className="p-8 border border-white/10 bg-white/5 rounded-sm">
                            <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <span className="text-[#00e9fa]">→</span> {t('smart_integration_integration_title')}
                            </h3>
                            <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
                                <li>• {t('smart_integration_integration_1')}</li>
                                <li>• {t('smart_integration_integration_2')}</li>
                                <li>• {t('smart_integration_integration_3')}</li>
                            </ul>
                        </div>
                        <div className="p-8 border border-white/10 bg-white/5 rounded-sm">
                            <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <span className="text-[#00e9fa]">→</span> {t('smart_integration_scalability_title')}
                            </h3>
                            <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
                                <li>• {t('smart_integration_scalability_1')}</li>
                                <li>• {t('smart_integration_scalability_2')}</li>
                                <li>• {t('smart_integration_scalability_3')}</li>
                            </ul>
                        </div>
                        <div className="p-8 border border-white/10 bg-white/5 rounded-sm">
                            <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <span className="text-[#00e9fa]">→</span> {t('smart_integration_security_title')}
                            </h3>
                            <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
                                <li>• {t('smart_integration_security_1')}</li>
                                <li>• {t('smart_integration_security_2')}</li>
                                <li>• {t('smart_integration_security_3')}</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Use Cases */}
                <section className="mb-20">
                    <h2 className="text-4xl font-bold text-white mb-12">
                        <span className="text-[#00e9fa]">//</span> {t('smart_integration_usecases_section')}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 border-l-4 border-[#00e9fa] bg-white/5 rounded-sm">
                            <h3 className="text-white font-bold mb-3">{t('smart_integration_usecase_1_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('smart_integration_usecase_1_desc')}</p>
                        </div>
                        <div className="p-8 border-l-4 border-[#00e9fa] bg-white/5 rounded-sm">
                            <h3 className="text-white font-bold mb-3">{t('smart_integration_usecase_2_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('smart_integration_usecase_2_desc')}</p>
                        </div>
                        <div className="p-8 border-l-4 border-[#00e9fa] bg-white/5 rounded-sm">
                            <h3 className="text-white font-bold mb-3">{t('smart_integration_usecase_3_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('smart_integration_usecase_3_desc')}</p>
                        </div>
                        <div className="p-8 border-l-4 border-[#00e9fa] bg-white/5 rounded-sm">
                            <h3 className="text-white font-bold mb-3">{t('smart_integration_usecase_4_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t('smart_integration_usecase_4_desc')}</p>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="text-center py-16 px-8 border border-white/10 bg-gradient-to-r from-white/5 to-white/0 rounded-sm">
                    <h2 className="text-3xl font-bold text-white mb-4">{t('smart_integration_cta_title')}</h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">{t('smart_integration_cta_desc')}</p>
                    <a href="/contacto" className="inline-block px-8 py-3 bg-[#00e9fa] text-black font-mono font-bold rounded hover:bg-white transition-all duration-300">
                        {t('smart_integration_cta_button')}
                    </a>
                </section>
            </div>
        </Layout>
    );
}
