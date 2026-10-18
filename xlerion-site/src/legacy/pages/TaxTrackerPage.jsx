import React from 'react';
import { DollarSign, Zap, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import TaxTrackerDemo from '../components/AIDemo/TaxTrackerDemo';
import { useAnalytics } from '../hooks/useAnalytics';

export default function TaxTrackerPage() {
    useAnalytics('Tax Tracker', 'service');

    return (
        <Layout>
            {/* Banner */}
            <div className="relative h-[40vh] overflow-hidden">
                <img
                    src="/images/soluciones-parallax.jpg"
                    alt="Tax Tracker Banner"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-8">
                        <DollarSign className="text-[#00e9fa] mx-auto mb-4" size={64} />
                        <p className="text-[#00e9fa] font-mono text-xs tracking-[0.4em] uppercase mb-2">TRANSPARENCIA FISCAL</p>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl">Rastreador IVA</h1>
                    </div>
                </div>
            </div>

            <div className="pt-20 pb-24 px-8 max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Visualiza el Impacto Social de Tus Impuestos
                    </h2>
                    <p className="text-gray-300 max-w-3xl text-lg leading-relaxed">
                        Esta aplicación interactiva demuestra cómo el IVA (Impuesto al Valor Agregado) que pagas en Colombia se distribuye automáticamente
                        entre diferentes sectores: salud, educación, infraestructura, seguridad y otros servicios públicos.
                        Descubre exactamente dónde van tus impuestos.
                    </p>
                </header>

                {/* Interactive Demo */}
                <section className="mb-20">
                    <TaxTrackerDemo />
                </section>

                {/* Features */}
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-white mb-12">
                        <span className="text-[#00e9fa]">//</span> Características de la Plataforma
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 border border-[#00e9fa]/30 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                            <div className="text-[#00e9fa] font-mono text-sm mb-3">01</div>
                            <h3 className="text-white font-bold text-lg mb-3">Rastreo Real-Time</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Visualiza en tiempo real cómo se distribuyen los impuestos de cada transacción entre los diferentes sectores.
                            </p>
                        </div>
                        <div className="p-8 border border-[#00e9fa]/30 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                            <div className="text-[#00e9fa] font-mono text-sm mb-3">02</div>
                            <h3 className="text-white font-bold text-lg mb-3">Trazabilidad Completa</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Blockchain garantiza que cada peso recaudado se registra de forma inmutable e inalterable.
                            </p>
                        </div>
                        <div className="p-8 border border-[#00e9fa]/30 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                            <div className="text-[#00e9fa] font-mono text-sm mb-3">03</div>
                            <h3 className="text-white font-bold text-lg mb-3">Transparencia Total</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Auditoría permanente y acceso público a todos los registros. Cero corrupción posible.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Impact Sectors */}
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-white mb-12">
                        <span className="text-[#00e9fa]">//</span> Sectores de Impacto
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 border border-[#00e9fa]/30 rounded-lg bg-[#00e9fa]/5">
                            <h3 className="text-[#00e9fa] font-bold text-lg mb-3">🏥 Salud Pública (25%)</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                Hospitales, centros de salud, medicinas esenciales, vacunas y programas de prevención de enfermedades.
                            </p>
                            <ul className="text-gray-500 text-xs space-y-1">
                                <li>✓ Cobertura en hospitales públicos</li>
                                <li>✓ Programas de salud preventiva</li>
                                <li>✓ Acceso a medicamentos genéricos</li>
                            </ul>
                        </div>

                        <div className="p-8 border border-[#00e9fa]/30 rounded-lg bg-[#00e9fa]/5">
                            <h3 className="text-[#00e9fa] font-bold text-lg mb-3">📚 Educación (20%)</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                Escuelas primarias, colegios, universidades públicas, becas y formación profesional.
                            </p>
                            <ul className="text-gray-500 text-xs space-y-1">
                                <li>✓ Educación primaria y secundaria gratuita</li>
                                <li>✓ Becas universitarias</li>
                                <li>✓ Capacitación técnica y profesional</li>
                            </ul>
                        </div>

                        <div className="p-8 border border-[#00e9fa]/30 rounded-lg bg-[#00e9fa]/5">
                            <h3 className="text-[#00e9fa] font-bold text-lg mb-3">🛣️ Infraestructura (30%)</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                Construcción y mantenimiento de carreteras, puentes, sistemas de agua y energía.
                            </p>
                            <ul className="text-gray-500 text-xs space-y-1">
                                <li>✓ Carreteras y autopistas</li>
                                <li>✓ Puentes y transporte público</li>
                                <li>✓ Acueductos y sistemas de agua</li>
                            </ul>
                        </div>

                        <div className="p-8 border border-[#00e9fa]/30 rounded-lg bg-[#00e9fa]/5">
                            <h3 className="text-[#00e9fa] font-bold text-lg mb-3">🛡️ Seguridad y Defensa (15%)</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                Policía, fuerzas armadas, seguridad ciudadana y protección de fronteras.
                            </p>
                            <ul className="text-gray-500 text-xs space-y-1">
                                <li>✓ Policía nacional y seguridad local</li>
                                <li>✓ Fuerzas armadas</li>
                                <li>✓ Protección civil y emergencias</li>
                            </ul>
                        </div>

                        <div className="p-8 border border-[#00e9fa]/30 rounded-lg bg-[#00e9fa]/5 md:col-span-2">
                            <h3 className="text-[#00e9fa] font-bold text-lg mb-3">🌍 Otros Servicios (10%)</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                Cultura, ambiente, servicios municipales y programas de desarrollo social.
                            </p>
                            <ul className="text-gray-500 text-xs space-y-1">
                                <li>✓ Museos, bibliotecas y actividades culturales</li>
                                <li>✓ Protección ambiental y sostenibilidad</li>
                                <li>✓ Programas sociales y de empleo</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Technology Stack */}
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-white mb-12">
                        <span className="text-[#00e9fa]">//</span> Tecnología Implementada
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 bg-[#1a1a1a] border border-white/10 rounded-lg">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Zap size={20} className="text-[#00e9fa]" />
                                Frontend Interactivo
                            </h3>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li>• React 19 con hooks personalizados</li>
                                <li>• Animaciones fluidas con CSS transitions</li>
                                <li>• Simulador de transacciones en tiempo real</li>
                                <li>• Dashboard de estadísticas en vivo</li>
                                <li>• Responsive design para todos los dispositivos</li>
                            </ul>
                        </div>

                        <div className="p-8 bg-[#1a1a1a] border border-white/10 rounded-lg">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <DollarSign size={20} className="text-[#00e9fa]" />
                                Backend y Blockchain
                            </h3>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li>• Smart contracts (Ethereum/Polygon)</li>
                                <li>• Registro inmutable de transacciones</li>
                                <li>• API REST para integración</li>
                                <li>• Base de datos descentralizada</li>
                                <li>• Auditoría automática y trazabilidad</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-gradient-to-r from-[#00e9fa]/10 to-transparent border border-[#00e9fa]/30 rounded-lg p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-bold text-2xl mb-2">¿Listo para implementar esto en producción?</h3>
                            <p className="text-gray-400">
                                Conectemos tu sistema fiscal con blockchain para máxima transparencia.
                            </p>
                        </div>
                        <ArrowRight size={32} className="text-[#00e9fa] flex-shrink-0" />
                    </div>
                </section>
            </div>
        </Layout>
    );
}
