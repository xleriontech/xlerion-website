import React, { useEffect, useState } from 'react';
import { Database, FileText, Code } from 'lucide-react';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';
import { useAnalytics } from '../hooks/useAnalytics';

export default function ManualesPage() {
    const { t } = useLanguage();
    useAnalytics('Manuales', 'documentation');
    const [manuales, setManuales] = useState([]);
    useEffect(() => {
        fetch('/api/manuales.php')
            .then(res => res.json())
            .then(setManuales)
            .catch(() => setManuales([]));
    }, []);
    return (
        <Layout>
            {/* Banner Parallax */}
            <div className="relative h-[40vh] overflow-hidden">
                <img
                    src="/images/documentacion-parallax.jpg"
                    alt="Manuales Banner"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-8">
                        <Database className="text-[#00e9fa] mx-auto mb-4" size={64} />
                        <p className="text-[#00e9fa] font-mono text-xs tracking-[0.4em] uppercase mb-2">{t('manuales_page_subtitle')}</p>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl">{t('manuales_page_title')}</h1>
                    </div>
                </div>
            </div>
            <div className="pt-20 pb-24 px-8 max-w-6xl mx-auto">
                <header className="mb-16">
                    <p className="text-gray-300 max-w-3xl text-lg leading-relaxed">{t('manuales_page_desc')}</p>
                </header>

                <div className="grid md:grid-cols-2 gap-10 mb-16">
                    <div className="p-8 border border-white/10 bg-white/5 rounded-sm">
                        <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><FileText size={18} className="text-[#00e9fa]" /> {t('manuales_scope')}</h3>
                        <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
                            <li>{t('manuales_scope_1')}</li>
                            <li>{t('manuales_scope_2')}</li>
                            <li>{t('manuales_scope_3')}</li>
                        </ul>
                    </div>
                    <div className="p-8 border border-white/10 bg-white/5 rounded-sm">
                        <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Code size={18} className="text-[#00e9fa]" /> {t('manuales_content')}</h3>
                        <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
                            <li>{t('manuales_content_1')}</li>
                            <li>{t('manuales_content_2')}</li>
                            <li>{t('manuales_content_3')}</li>
                        </ul>
                    </div>
                </div>

                <div className="p-8 border border-white/10 bg-white/5 rounded-sm">
                    <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-4">{t('manuales_objectives')}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{t('manuales_objectives_desc')}</p>
                </div>

                {/* Lista de manuales dinámicos */}
                <div id="manuales-list" className="mt-16">
                    <h2 className="text-2xl font-bold text-[#00e9fa] mb-6">{t('manuales_listado') || 'Manuales disponibles'}</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {manuales.length === 0 && (
                            <div className="text-gray-400 italic">{t('manuales_no_data') || 'No hay manuales disponibles.'}</div>
                        )}
                        {manuales.map(m => (
                            <a key={m.id} href={m.enlace} target="_blank" rel="noopener noreferrer" className="block p-6 border border-white/10 bg-white/5 rounded-sm hover:border-[#00e9fa]/60 transition">
                                <div className="flex items-center gap-3 mb-2">
                                    <FileText className="text-[#00e9fa]" size={20} />
                                    <span className="font-mono text-white font-bold text-lg">{m.titulo}</span>
                                </div>
                                <div className="text-gray-300 text-sm mb-1">{m.descripcion}</div>
                                <div className="text-[#00e9fa] text-xs">{m.enlace}</div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
