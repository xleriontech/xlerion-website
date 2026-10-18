import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Zap, Boxes } from 'lucide-react';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';
import { useAnalytics } from '../hooks/useAnalytics';

export default function VideoGamesPage() {
    const { t } = useLanguage();
    useAnalytics('Video Games - Unity 3D', 'project');

    return (
        <Layout>
            {/* Banner Parallax */}
            <div className="relative h-[40vh] overflow-hidden">
                <img
                    src="/images/soluciones-parallax.jpg"
                    alt="Video Games Banner"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-8">
                        <Gamepad2 className="text-[#00e9fa] mx-auto mb-4" size={64} />
                        <p className="text-[#00e9fa] font-mono text-xs tracking-[0.4em] uppercase mb-2">{t('videogames_banner_subtitle')}</p>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl">{t('videogames_banner_title')}</h1>
                    </div>
                </div>
            </div>

            <div className="pt-20 pb-24 px-8 max-w-6xl mx-auto">
                {/* Header */}
                <header className="mb-16">
                    <p className="text-gray-300 max-w-3xl text-lg leading-relaxed">{t('videogames_header')}</p>
                </header>

                {/* Featured Projects */}
                <section className="mb-20">
                    <h2 className="text-4xl font-bold text-white mb-12">
                        <span className="text-[#00e9fa]">//</span> {t('videogames_projects_section')}
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Project Card 1: Cyberpunk Assault */}
                        <div className="p-8 border border-white/10 bg-white/5 rounded-sm hover:bg-white/10 hover:border-[#00e9fa]/50 transition-all">
                            <div className="h-40 bg-gradient-to-br from-[#00e9fa]/20 to-purple-500/20 rounded-sm mb-4 flex items-center justify-center">
                                <Gamepad2 size={48} className="text-[#00e9fa] opacity-50" />
                            </div>
                            <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3">{t('videogames_project1_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">{t('videogames_project1_desc')}</p>
                            <div className="space-y-2 text-xs text-gray-500">
                                <p><span className="text-[#00e9fa]">Engine:</span> Unity 3D 2022 LTS</p>
                                <p><span className="text-[#00e9fa]">Genre:</span> {t('videogames_project1_genre')}</p>
                                <p><span className="text-[#00e9fa]">Status:</span> In Development</p>
                            </div>
                        </div>

                        {/* Project Card 2: Neural Escape */}
                        <div className="p-8 border border-white/10 bg-white/5 rounded-sm hover:bg-white/10 hover:border-[#00e9fa]/50 transition-all">
                            <div className="h-40 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-sm mb-4 flex items-center justify-center">
                                <Zap size={48} className="text-[#00e9fa] opacity-50" />
                            </div>
                            <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3">{t('videogames_project2_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">{t('videogames_project2_desc')}</p>
                            <div className="space-y-2 text-xs text-gray-500">
                                <p><span className="text-[#00e9fa]">Engine:</span> Unity 3D 2023</p>
                                <p><span className="text-[#00e9fa]">Genre:</span> {t('videogames_project2_genre')}</p>
                                <p><span className="text-[#00e9fa]">Status:</span> Beta Testing</p>
                            </div>
                        </div>

                        {/* Project Card 3: Modular Blocks */}
                        <div className="p-8 border border-white/10 bg-white/5 rounded-sm hover:bg-white/10 hover:border-[#00e9fa]/50 transition-all">
                            <div className="h-40 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-sm mb-4 flex items-center justify-center">
                                <Boxes size={48} className="text-[#00e9fa] opacity-50" />
                            </div>
                            <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3">{t('videogames_project3_title')}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">{t('videogames_project3_desc')}</p>
                            <div className="space-y-2 text-xs text-gray-500">
                                <p><span className="text-[#00e9fa]">Engine:</span> Unity 3D 2024</p>
                                <p><span className="text-[#00e9fa]">Genre:</span> {t('videogames_project3_genre')}</p>
                                <p><span className="text-[#00e9fa]">Status:</span> Released</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Technology Stack */}
                <section className="mb-20">
                    <h2 className="text-4xl font-bold text-white mb-12">
                        <span className="text-[#00e9fa]">//</span> {t('videogames_tech_section')}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 border border-[#00e9fa]/20 bg-[#00e9fa]/5 rounded-sm">
                            <h3 className="text-[#00e9fa] font-mono text-sm uppercase tracking-[0.2em] mb-4">{t('videogames_tech_engine')}</h3>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li>✦ C# Scripting</li>
                                <li>✦ Physics Engine (PhysX)</li>
                                <li>✦ Advanced Rendering</li>
                                <li>✦ UI/UX Framework</li>
                                <li>✦ Cross-Platform Export</li>
                            </ul>
                        </div>
                        <div className="p-8 border border-[#00e9fa]/20 bg-[#00e9fa]/5 rounded-sm">
                            <h3 className="text-[#00e9fa] font-mono text-sm uppercase tracking-[0.2em] mb-4">{t('videogames_tech_features')}</h3>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li>✦ Networking & Multiplayer</li>
                                <li>✦ Advanced AI Systems</li>
                                <li>✦ VR/AR Integration</li>
                                <li>✦ Performance Optimization</li>
                                <li>✦ Analytics Integration</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center py-16">
                    <h2 className="text-3xl font-bold text-white mb-6">{t('videogames_cta_title')}</h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">{t('videogames_cta_desc')}</p>
                    <Link
                        to="/contacto"
                        className="inline-block bg-[#00e9fa] text-black font-bold px-8 py-3 rounded-sm hover:bg-white transition"
                    >
                        {t('videogames_cta_button')}
                    </Link>
                </section>
            </div>
        </Layout>
    );
}
