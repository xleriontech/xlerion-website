import React, { useState } from 'react';
import { AlertCircle, Lock, FileText, CheckCircle2, ExternalLink } from 'lucide-react';

/**
 * XlerionRightsNotice
 * 
 * Componente que muestra claramente los derechos y restricciones
 * de Xlerion sobre Tax Tracker y blockchain products
 * 
 * Usar en: TaxTrackerPage, BlockchainIntegrationPage, pages con demos
 */
export const XlerionRightsNotice = () => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-gradient-to-r from-[#00e9fa]/10 to-purple-500/10 border border-[#00e9fa]/30 rounded-lg p-6 mb-8">
            {/* Header */}
            <div className="flex items-start gap-4">
                <Lock className="text-[#00e9fa] flex-shrink-0 mt-1" size={24} />
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                        © Xlerion SAS - Derechos Reservados
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">
                        Tax Tracker es propiedad intelectual exclusiva de Xlerion.
                        Conoce tus derechos y limitaciones de uso.
                    </p>

                    {/* Quick Summary */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        {/* Permitido */}
                        <div className="bg-[#00e9fa]/10 border border-[#00e9fa]/30 rounded p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="text-[#00e9fa]" size={18} />
                                <span className="font-bold text-[#00e9fa]">Permitido</span>
                            </div>
                            <ul className="text-xs text-gray-300 space-y-1">
                                <li>✓ Uso educativo/académico</li>
                                <li>✓ Demostraciones sin fin comercial</li>
                                <li>✓ Simulaciones personales</li>
                                <li>✓ Aprendizaje de blockchain</li>
                            </ul>
                        </div>

                        {/* Prohibido */}
                        <div className="bg-[#333436]/30 border border-[#333436]/50 rounded p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="text-[#333436]" size={18} />
                                <span className="font-bold text-[#333436]">No Permitido</span>
                            </div>
                            <ul className="text-xs text-gray-300 space-y-1">
                                <li>✗ Copiar, modificar, redistribuir</li>
                                <li>✗ Uso en producción sin licencia</li>
                                <li>✗ Vender como tuyo</li>
                                <li>✗ Ingeniería inversa</li>
                            </ul>
                        </div>
                    </div>

                    {/* Expand Button */}
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#00e9fa] text-black rounded font-mono text-xs hover:bg-[#00d4e0] transition-colors"
                    >
                        <FileText size={16} />
                        {expanded ? 'Contraer' : 'Leer Términos Completos'}
                    </button>
                </div>
            </div>

            {/* Expanded Section */}
            {expanded && (
                <div className="mt-6 pt-6 border-t border-[#00e9fa]/20 space-y-4">
                    {/* Section 1: Derechos */}
                    <div>
                        <h4 className="font-bold text-[#00e9fa] mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 bg-[#00e9fa] text-black rounded-full flex items-center justify-center text-xs font-bold">1</span>
                            ¿Qué es propiedad de Xlerion?
                        </h4>
                        <ul className="text-sm text-gray-300 space-y-1 ml-8">
                            <li>• Código fuente y arquitectura</li>
                            <li>• Documentación y algoritmos</li>
                            <li>• Diseño de interfaz</li>
                            <li>• Datos y certificados generados</li>
                            <li>• Marca Xlerion y Tax Tracker™</li>
                        </ul>
                    </div>

                    {/* Section 2: Licencias */}
                    <div>
                        <h4 className="font-bold text-[#00e9fa] mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 bg-[#00e9fa] text-black rounded-full flex items-center justify-center text-xs font-bold">2</span>
                            Opciones de Licencia
                        </h4>
                        <div className="grid md:grid-cols-2 gap-2 ml-8">
                            <div className="bg-black/50 border border-[#00e9fa]/20 rounded p-2">
                                <p className="font-mono text-[#00e9fa] text-xs font-bold">GRATIS</p>
                                <p className="text-xs text-gray-300">Educación, aprendizaje, demostraciones</p>
                            </div>
                            <div className="bg-black/50 border border-[#00e9fa]/20 rounded p-2">
                                <p className="font-mono text-[#00e9fa] text-xs font-bold">COMERCIAL</p>
                                <p className="text-xs text-gray-300">$5K-100K/año según uso</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 ml-8 mt-2">
                            📧 Contacta: <span className="text-[#00e9fa]">licensing@xlerion.com</span>
                        </p>
                    </div>

                    {/* Section 3: Confidencialidad */}
                    <div>
                        <h4 className="font-bold text-[#00e9fa] mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 bg-[#00e9fa] text-black rounded-full flex items-center justify-center text-xs font-bold">3</span>
                            Información Confidencial
                        </h4>
                        <p className="text-sm text-gray-300 ml-8">
                            Para acceso a arquitectura técnica, algoritmos completos o datos de clientes,
                            se requiere NDA (Non-Disclosure Agreement) firmado.
                        </p>
                    </div>

                    {/* Section 4: Disclaimer */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded p-3 ml-8">
                        <p className="text-xs text-amber-200">
                            <strong>⚠️ IMPORTANTE:</strong> Tax Tracker es una demostración educativa con datos simulados.
                            No es aprobado por DIAN ni es herramienta de producción certificada.
                            Para uso con datos reales se requiere auditoría y aprobación legal.
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="ml-8 flex flex-col gap-2">
                        <a
                            href="mailto:legal@xlerion.com"
                            className="inline-flex items-center gap-2 text-[#00e9fa] hover:text-white text-xs font-mono transition-colors"
                        >
                            Solicitar términos completos
                            <ExternalLink size={14} />
                        </a>
                        <a
                            href="mailto:legal@xlerion.com"
                            className="inline-flex items-center gap-2 text-[#00e9fa] hover:text-white text-xs font-mono transition-colors"
                        >
                            ¿Preguntas sobre derechos?
                            <ExternalLink size={14} />
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * Componente para usar en el footer o página legal
 */
export const XlerionCopyright = () => {
    return (
        <div className="bg-black/50 border-t border-[#00e9fa]/20 py-4 px-6">
            <p className="text-xs text-gray-400 text-center">
                © 2026 <span className="text-[#00e9fa] font-bold">Xlerion SAS</span> -
                Todos los derechos reservados |
                <a href="mailto:legal@xlerion.com" className="text-[#00e9fa] hover:text-white ml-1">
                    Solicitar términos
                </a>
            </p>
        </div>
    );
};

export default XlerionRightsNotice;
