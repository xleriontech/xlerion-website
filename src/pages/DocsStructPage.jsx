import React, { useState } from 'react';
import { BookOpen, FileText, Share2, ShieldCheck, GitBranch, Users, Zap, Database, CheckCircle2, ArrowRight, Target, Code2, Lock } from 'lucide-react';
import Layout from '../components/Layout';
import ModuleDetailModal from '../components/ModuleDetailModal';
import { useLanguage } from '../context/LanguageContext';
import { useAnalytics } from '../hooks/useAnalytics';

export default function DocsStructPage() {
    const { t } = useLanguage();
    useAnalytics('Documentación Estructurada', 'service');
    const [activePhase, setActivePhase] = useState(0);
    const [selectedModule, setSelectedModule] = useState(null);

    const phases = [
        {
            icon: <FileText size={20} />,
            title: t('docs_struct_phase_1_title'),
            desc: t('docs_struct_phase_1_desc'),
            items: [t('docs_struct_phase_1_item_1'), t('docs_struct_phase_1_item_2'), t('docs_struct_phase_1_item_3')],
        },
        {
            icon: <Users size={20} />,
            title: t('docs_struct_phase_2_title'),
            desc: t('docs_struct_phase_2_desc'),
            items: [t('docs_struct_phase_2_item_1'), t('docs_struct_phase_2_item_2'), t('docs_struct_phase_2_item_3')],
        },
        {
            icon: <GitBranch size={20} />,
            title: t('docs_struct_phase_3_title'),
            desc: t('docs_struct_phase_3_desc'),
            items: [t('docs_struct_phase_3_item_1'), t('docs_struct_phase_3_item_2'), t('docs_struct_phase_3_item_3')],
        },
        {
            icon: <ShieldCheck size={20} />,
            title: t('docs_struct_phase_4_title'),
            desc: t('docs_struct_phase_4_desc'),
            items: [t('docs_struct_phase_4_item_1'), t('docs_struct_phase_4_item_2'), t('docs_struct_phase_4_item_3')],
        },
    ];

    const modules = [
        { title: t('docs_struct_module_1'), subtitle: t('docs_struct_module_1_sub'), color: 'from-[#00e9fa] to-[#00d4e0]' },
        { title: t('docs_struct_module_2'), subtitle: t('docs_struct_module_2_sub'), color: 'from-[#00e9fa] to-[#00c8d5]' },
        { title: t('docs_struct_module_3'), subtitle: t('docs_struct_module_3_sub'), color: 'from-[#00e9fa] to-[#00b8ca]' },
        { title: t('docs_struct_module_4'), subtitle: t('docs_struct_module_4_sub'), color: 'from-[#00e9fa] to-[#00a8bf]' },
        { title: t('docs_struct_module_5'), subtitle: t('docs_struct_module_5_sub'), color: 'from-[#00e9fa] to-[#0098b4]' },
        { title: t('docs_struct_module_6'), subtitle: t('docs_struct_module_6_sub'), color: 'from-[#00e9fa] to-[#0088a9]' },
    ];

    const pillars = [
        { icon: <Zap size={24} />, title: t('docs_struct_pillar_1'), desc: t('docs_struct_pillar_1_desc') },
        { icon: <Database size={24} />, title: t('docs_struct_pillar_2'), desc: t('docs_struct_pillar_2_desc') },
        { icon: <CheckCircle2 size={24} />, title: t('docs_struct_pillar_3'), desc: t('docs_struct_pillar_3_desc') },
    ];

    return (
        <Layout>
            {/* Banner Parallax */}
            <div className="relative h-[40vh] overflow-hidden">
                <img
                    src="/images/documentacion-parallax.jpg"
                    alt="Documentación Estructurada Banner"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-8">
                        <BookOpen className="text-[#00e9fa] mx-auto mb-4" size={64} />
                        <p className="text-[#00e9fa] font-mono text-xs tracking-[0.4em] uppercase mb-2">{t('docs_struct_page_subtitle')}</p>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl">{t('docs_struct_page_title')}</h1>
                    </div>
                </div>
            </div>

            <div className="pt-20 pb-24 px-8 max-w-7xl mx-auto">
                {/* Descripción Principal */}
                <header className="mb-24">
                    <p className="text-gray-300 max-w-4xl text-lg leading-relaxed">{t('docs_struct_page_desc')}</p>
                </header>

                {/* Resumen Ejecutivo - Visión General */}
                <section className="mb-24">
                    <div className="mb-8 rounded-lg overflow-hidden border border-[#00e9fa]/30 bg-gradient-to-b from-[#00e9fa]/10 to-transparent">
                        <img
                            src="/images/documentacion-recursos-parallax.jpg"
                            alt="Arquitectura de Documentación - Resumen"
                            className="w-full h-64 md:h-80 object-cover"
                            loading="lazy"
                        />
                    </div>

                    <div className="p-8 border-l-4 border-[#00e9fa] bg-gradient-to-r from-[#00e9fa]/5 to-transparent rounded-lg">
                        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                            <Target size={28} className="text-[#00e9fa]" />
                            {t('docs_struct_summary_title')}
                        </h3>
                        <p className="text-gray-400 text-sm font-mono mb-6 tracking-wide">{t('docs_struct_summary_overview')}</p>
                        <p className="text-gray-300 mb-8 leading-relaxed">{t('docs_struct_summary_desc')}</p>

                        {/* Métricas Clave */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 py-6 border-y border-white/10">
                            <div className="text-center">
                                <div className="text-3xl font-black text-[#00e9fa] mb-1">6</div>
                                <p className="text-gray-400 text-xs uppercase tracking-widest">{t('docs_struct_summary_modules')}</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-black text-[#00e9fa] mb-1">4</div>
                                <p className="text-gray-400 text-xs uppercase tracking-widest">{t('docs_struct_summary_phases')}</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-black text-[#00e9fa] mb-1">3</div>
                                <p className="text-gray-400 text-xs uppercase tracking-widest">{t('docs_struct_summary_pillars')}</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-black text-[#00e9fa] mb-1">∞</div>
                                <p className="text-gray-400 text-xs uppercase tracking-widest">{t('docs_struct_summary_scalability')}</p>
                            </div>
                        </div>

                        {/* Dimensiones Clave */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="flex gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                                <Code2 size={20} className="text-[#00e9fa] flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="text-white font-semibold mb-2">{t('docs_struct_summary_scope')}</h4>
                                    <p className="text-gray-400 text-sm">{t('docs_struct_summary_scope_desc')}</p>
                                    <ul className="mt-2 space-y-1">
                                        <li className="text-gray-500 text-xs flex gap-2"><span className="text-[#00e9fa]">•</span> {t('docs_struct_summary_scope_item_1')}</li>
                                        <li className="text-gray-500 text-xs flex gap-2"><span className="text-[#00e9fa]">•</span> {t('docs_struct_summary_scope_item_2')}</li>
                                        <li className="text-gray-500 text-xs flex gap-2"><span className="text-[#00e9fa]">•</span> {t('docs_struct_summary_scope_item_3')}</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                                <Zap size={20} className="text-[#00e9fa] flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="text-white font-semibold mb-2">{t('docs_struct_summary_objectives')}</h4>
                                    <p className="text-gray-400 text-sm">{t('docs_struct_summary_objectives_desc')}</p>
                                    <ul className="mt-2 space-y-1">
                                        <li className="text-gray-500 text-xs flex gap-2"><span className="text-[#00e9fa]">•</span> {t('docs_struct_summary_objectives_item_1')}</li>
                                        <li className="text-gray-500 text-xs flex gap-2"><span className="text-[#00e9fa]">•</span> {t('docs_struct_summary_objectives_item_2')}</li>
                                        <li className="text-gray-500 text-xs flex gap-2"><span className="text-[#00e9fa]">•</span> {t('docs_struct_summary_objectives_item_3')}</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                                <Lock size={20} className="text-[#00e9fa] flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="text-white font-semibold mb-2">{t('docs_struct_summary_governance')}</h4>
                                    <p className="text-gray-400 text-sm">{t('docs_struct_summary_governance_desc')}</p>
                                    <ul className="mt-2 space-y-1">
                                        <li className="text-gray-500 text-xs flex gap-2"><span className="text-[#00e9fa]">•</span> {t('docs_struct_summary_governance_item_1')}</li>
                                        <li className="text-gray-500 text-xs flex gap-2"><span className="text-[#00e9fa]">•</span> {t('docs_struct_summary_governance_item_2')}</li>
                                        <li className="text-gray-500 text-xs flex gap-2"><span className="text-[#00e9fa]">•</span> {t('docs_struct_summary_governance_item_3')}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pilares Fundamentales */}
                <section className="mb-24">
                    <h2 className="text-4xl font-black uppercase tracking-tight mb-16 text-white">
                        <span className="text-[#00e9fa]">{t('docs_struct_pillars')}</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {pillars.map((pillar, idx) => (
                            <div key={idx} className="p-8 border border-white/10 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <div className="text-[#00e9fa] mb-4">{pillar.icon}</div>
                                <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3">{pillar.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{pillar.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Módulos de Documentación */}
                <section className="mb-24">
                    <h2 className="text-4xl font-black uppercase tracking-tight mb-16 text-white">
                        <span className="text-[#00e9fa]">{t('docs_struct_modules')}</span>
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {modules.map((mod, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedModule(idx)}
                                className={`p-6 rounded-lg border border-white/10 bg-gradient-to-br ${mod.color} bg-opacity-10 hover:bg-gradient-to-br hover:from-black hover:to-black hover:bg-opacity-100 transition-all cursor-pointer group`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h4 className="text-black group-hover:text-[#00e9fa] font-bold text-base transition-colors">{mod.title}</h4>
                                        <p className="text-gray-600 group-hover:text-[#00e9fa] text-xs mt-1 transition-colors">{mod.subtitle}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Flujo de Fases */}
                <section className="mb-24">
                    <h2 className="text-4xl font-black uppercase tracking-tight mb-16 text-white">
                        <span className="text-[#00e9fa]">{t('docs_struct_lifecycle')}</span>
                    </h2>
                    <div className="grid md:grid-cols-4 gap-4 mb-8">
                        {phases.map((phase, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActivePhase(idx)}
                                className={activePhase === idx
                                    ? 'p-4 rounded-lg border-2 transition-all text-left border-[#00e9fa] bg-[#00e9fa]/10'
                                    : 'p-4 rounded-lg border-2 transition-all text-left border-white/10 bg-white/5 hover:border-white/20'}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`${activePhase === idx ? 'text-[#00e9fa]' : 'text-gray-400'}`}>{phase.icon}</div>
                                    <span className={`font-mono text-xs uppercase tracking-[0.1em] ${activePhase === idx ? 'text-[#00e9fa]' : 'text-gray-400'}`}>
                                        0{idx + 1}
                                    </span>
                                </div>
                                <h4 className={`font-bold text-sm ${activePhase === idx ? 'text-white' : 'text-gray-300'}`}>{phase.title}</h4>
                            </button>
                        ))}
                    </div>

                    {/* Detalle de Fase Activa */}
                    <div className="p-8 border border-[#00e9fa]/30 bg-[#00e9fa]/5 rounded-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-[#00e9fa] text-2xl">{phases[activePhase].icon}</div>
                            <h3 className="text-2xl font-bold text-white">{phases[activePhase].title}</h3>
                        </div>
                        <p className="text-gray-300 mb-6 leading-relaxed">{phases[activePhase].desc}</p>
                        <div className="grid md:grid-cols-3 gap-4">
                            {phases[activePhase].items.map((item, idx) => (
                                <div key={idx} className="flex gap-3 items-start">
                                    <CheckCircle2 size={18} className="text-[#00e9fa] mt-0.5 flex-shrink-0" />
                                    <p className="text-gray-300 text-sm">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pillares de Operación (Original Enhanced) */}
                <section>
                    <h2 className="text-4xl font-black uppercase tracking-tight mb-16 text-white">
                        <span className="text-[#00e9fa]">{t('docs_struct_operations')}</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="p-8 border border-white/10 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <FileText size={18} className="text-[#00e9fa]" /> {t('docs_struct_content')}
                            </h3>
                            <ul className="space-y-3 text-gray-400 text-sm leading-relaxed">
                                <li className="flex gap-2"><span className="text-[#00e9fa]">•</span> {t('docs_struct_content_1')}</li>
                                <li className="flex gap-2"><span className="text-[#00e9fa]">•</span> {t('docs_struct_content_2')}</li>
                                <li className="flex gap-2"><span className="text-[#00e9fa]">•</span> {t('docs_struct_content_3')}</li>
                            </ul>
                        </div>
                        <div className="p-8 border border-white/10 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Share2 size={18} className="text-[#00e9fa]" /> {t('docs_struct_transfer')}
                            </h3>
                            <ul className="space-y-3 text-gray-400 text-sm leading-relaxed">
                                <li className="flex gap-2"><span className="text-[#00e9fa]">•</span> {t('docs_struct_transfer_1')}</li>
                                <li className="flex gap-2"><span className="text-[#00e9fa]">•</span> {t('docs_struct_transfer_2')}</li>
                                <li className="flex gap-2"><span className="text-[#00e9fa]">•</span> {t('docs_struct_transfer_3')}</li>
                            </ul>
                        </div>
                        <div className="p-8 border border-white/10 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <ShieldCheck size={18} className="text-[#00e9fa]" /> {t('docs_struct_reliability')}
                            </h3>
                            <ul className="space-y-3 text-gray-400 text-sm leading-relaxed">
                                <li className="flex gap-2"><span className="text-[#00e9fa]">•</span> {t('docs_struct_reliability_1')}</li>
                                <li className="flex gap-2"><span className="text-[#00e9fa]">•</span> {t('docs_struct_reliability_2')}</li>
                                <li className="flex gap-2"><span className="text-[#00e9fa]">•</span> {t('docs_struct_reliability_3')}</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>

            {/* Modal de Detalles */}
            {selectedModule !== null && (
                <ModuleDetailModal
                    module={modules[selectedModule]}
                    moduleIndex={selectedModule}
                    onClose={() => setSelectedModule(null)}
                />
            )}
        </Layout>
    );
}
