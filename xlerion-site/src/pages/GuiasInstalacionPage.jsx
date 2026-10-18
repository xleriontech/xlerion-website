import React, { useEffect, useState } from 'react';
import { Shield, Download, CheckCircle2 } from 'lucide-react';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';
import { useAnalytics } from '../hooks/useAnalytics';

export default function GuiasInstalacionPage() {
    const { t } = useLanguage();
    useAnalytics('Guías de Instalación', 'documentation');
    const [guias, setGuias] = useState([]);
    useEffect(() => {
        fetch('/api/guias-instalacion.php')
            .then(res => res.json())
            .then(setGuias)
            .catch(() => setGuias([]));
    }, []);
    return (
        <Layout>
            {/* Banner Parallax */}
            <div className="relative h-[40vh] overflow-hidden">
                <img
                    src="/images/cronograma-progreso-parallax.jpg"
                    alt="Guías Banner"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-8">
                        <Shield className="text-[#00e9fa] mx-auto mb-4" size={64} />
                        <p className="text-[#00e9fa] font-mono text-xs tracking-[0.4em] uppercase mb-2">{t('guias_page_subtitle')}</p>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl">{t('guias_page_title')}</h1>
                    </div>
                </div>
            </div>
            <div className="pt-20 pb-24 px-8 max-w-6xl mx-auto">
                <header className="mb-16">
                    <p className="text-gray-300 max-w-3xl text-lg leading-relaxed">{t('guias_page_desc')}</p>
                </header>

                <div className="grid md:grid-cols-2 gap-10 mb-16">
                    <div className="p-8 border border-white/10 bg-white/5 rounded-sm">
                        <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Download size={18} className="text-[#00e9fa]" /> {t('guias_environments')}</h3>
                        <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
                            <li>{t('guias_environments_1')}</li>
                            <li>{t('guias_environments_2')}</li>
                            <li>{t('guias_environments_3')}</li>
                        </ul>
                    </div>
                    <div className="p-8 border border-white/10 bg-white/5 rounded-sm">
                        <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><CheckCircle2 size={18} className="text-[#00e9fa]" /> {t('guias_validation')}</h3>
                        <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
                            <li>{t('guias_validation_1')}</li>
                            <li>{t('guias_validation_2')}</li>
                            <li>{t('guias_validation_3')}</li>
                        </ul>
                    </div>
                </div>

                <div className="p-8 border border-white/10 bg-white/5 rounded-sm">
                    <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-4">{t('guias_coverage')}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{t('guias_coverage_desc')}</p>
                </div>

                {/* Lista de guías dinámicas */}
                <div id="guias-list" className="mt-16">
                    <h2 className="text-2xl font-bold text-[#00e9fa] mb-6">{t('guias_listado') || 'Guías disponibles'}</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {guias.length === 0 && (
                            <div className="text-gray-400 italic">{t('guias_no_data') || 'No hay guías disponibles.'}</div>
                        )}
                        {guias.map(g => (
                            <a key={g.id} href={g.enlace} target="_blank" rel="noopener noreferrer" className="block p-6 border border-white/10 bg-white/5 rounded-sm hover:border-[#00e9fa]/60 transition">
                                <div className="flex items-center gap-3 mb-2">
                                    <Download className="text-[#00e9fa]" size={20} />
                                    <span className="font-mono text-white font-bold text-lg">{g.titulo}</span>
                                </div>
                                <div className="text-gray-300 text-sm mb-1">{(g.plataformas || []).join(', ')}</div>
                                <ol className="text-gray-400 text-xs mb-2 list-decimal list-inside">
                                    {(g.pasos || []).map((p, i) => <li key={i}>{p}</li>)}
                                </ol>
                                <div className="text-[#00e9fa] text-xs">{g.enlace}</div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
