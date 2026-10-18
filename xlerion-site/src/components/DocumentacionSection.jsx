import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { Database, TrendingUp, Shield, X } from "lucide-react";

export default function DocumentacionSection() {
    const [modal, setModal] = useState(null);
    const navigate = useNavigate();
    const items = [
        {
            key: 'manuales',
            icon: Database,
            title: 'Manuales por módulo',
            desc: 'Explican funcionamiento, configuración y mantenimiento con ejemplos y recomendaciones.',
            path: '/documentacion/manuales',
            hash: 'manuales-list',
            detail: 'Aquí encontrarás los manuales detallados de cada módulo, incluyendo instrucciones de uso, configuración avanzada, mantenimiento preventivo y mejores prácticas para maximizar el rendimiento de cada solución.'
        },
        {
            key: 'diagramas',
            icon: TrendingUp,
            title: 'Diagramas de flujo',
            desc: 'Representan arquitectura y flujo de datos; se actualizan con nuevas funcionalidades.',
            path: '/documentacion/diagramas-flujos',
            hash: 'diagramas-list',
            detail: 'Los diagramas de flujo muestran la arquitectura interna y el recorrido de los datos en cada proceso. Son útiles para entender la lógica, detectar cuellos de botella y planificar integraciones.'
        },
        {
            key: 'guias',
            icon: Shield,
            title: 'Guías de instalación',
            desc: 'Instrucciones paso a paso para diferentes entornos y plataformas con soluciones comunes.',
            path: '/documentacion/guias-instalacion',
            hash: 'guias-list',
            detail: 'Las guías de instalación ofrecen pasos claros para implementar cada módulo en distintos sistemas operativos y plataformas, incluyendo soluciones a problemas frecuentes y recomendaciones de seguridad.'
        }
    ];
    return (
        <section id="documentacion" className="py-40 bg-[#080808]">
            <div className="max-w-7xl mx-auto px-8">
                <div className="mb-16 border-l-2 border-[#00e9fa] pl-8">
                    <h2 className="text-[#00e9fa] font-mono text-xs tracking-[0.4em] uppercase mb-2">// Legado Replicable</h2>
                    <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">Documentación</h3>
                </div>
                <div className="grid lg:grid-cols-3 gap-8">
                    {items.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.key}
                                className="group p-8 border transition-all duration-500 bg-white/5 border-white/10 hover:border-[#00e9fa]/60 rounded-sm relative overflow-hidden block cursor-pointer text-left focus:outline-none"
                                onClick={() => setModal(item)}
                                type="button"
                            >
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <Icon className="text-[#00e9fa] group-hover:scale-110 transition-transform" size={24} />
                                    <h4 className="font-mono font-bold text-lg uppercase italic text-white">{item.title}</h4>
                                </div>
                                <div className="text-gray-400 text-sm leading-relaxed font-sans relative z-10">{item.desc}</div>
                                <div className="absolute -bottom-4 -right-4 text-[#00e9fa]/5 group-hover:text-[#00e9fa]/10 transition-colors pointer-events-none">
                                    <Icon size={120} />
                                </div>
                            </button>
                        );
                    })}
                </div>
                <div className="mt-12 text-sm text-gray-300 leading-relaxed">Más que soporte técnico, la documentación es una herramienta estratégica para empoderar comunidades y fomentar autonomía.</div>
            </div>
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="bg-[#10151a] rounded-lg shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
                        <button
                            className="absolute top-4 right-4 text-[#00e9fa] hover:text-white transition-colors"
                            onClick={() => setModal(null)}
                            aria-label="Cerrar"
                        >
                            <X size={28} />
                        </button>
                        <div className="flex items-center gap-4 mb-6">
                            {modal.icon && (() => { const Icon = modal.icon; return <Icon className="text-[#00e9fa]" size={32} /> })()}
                            <h4 className="font-mono font-bold text-2xl uppercase italic text-white">{modal.title}</h4>
                        </div>
                        <div className="text-gray-300 text-base mb-4">{modal.desc}</div>
                        <div className="text-gray-400 text-sm leading-relaxed">{modal.detail}</div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                className="px-4 py-2 bg-transparent border border-white/10 text-white/90 rounded hover:bg-white/5 transition"
                                onClick={() => setModal(null)}
                            >Cerrar</button>
                            <button
                                className="px-4 py-2 bg-[#00e9fa] text-black font-bold rounded hover:opacity-90 transition"
                                onClick={() => {
                                    const targetPath = modal.path || '/documentacion';
                                    const targetHash = modal.hash;
                                    // close modal first so it doesn't block the view
                                    setModal(null);
                                    // small delay to allow modal removal from DOM
                                    setTimeout(() => {
                                        // navigate to the path (without hash) so React Router updates the route
                                        navigate(targetPath);
                                        // pass scroll target via location.state so the destination
                                        // page can perform a controlled scroll after render.
                                        if (targetHash) {
                                            navigate(targetPath, { state: { scrollTo: targetHash } });
                                        } else {
                                            navigate(targetPath);
                                        }
                                    }, 80);
                                }}
                            >Ir a sección</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
