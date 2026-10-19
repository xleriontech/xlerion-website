import React from 'react';
import { Shield, CheckCircle2, Eye, Lock } from 'lucide-react';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';
import { useAnalytics } from '../hooks/useAnalytics';

export default function PrivacyPage() {
    const { lang } = useLanguage();
    useAnalytics('Privacidad', 'page');

    const t = {
        es: {
            banner_subtitle: 'Política de Tratamiento de Datos',
            banner_title: 'Privacidad',
            header: 'En Xlerion, la protección de datos personales es un principio fundamental de nuestra arquitectura. Cumplimos con la Ley Estatutaria 1581 de 2012 y el Decreto 1377 de 2013, garantizando el tratamiento responsable, seguro y transparente de la información que nos confían.',
            principles_title: 'Principios Rectores',
            principles: [
                'Legalidad y finalidad: Tratamos datos solo para fines legítimos, específicos e informados.',
                'Libertad y veracidad: El titular decide; los datos son exactos, completos y actualizables.',
                'Transparencia y acceso: Informamos claramente qué, cómo y por qué tratamos sus datos.',
                'Seguridad y confidencialidad: Aplicamos medidas técnicas y organizativas apropiadas al riesgo.',
            ],
            safeguards_title: 'Salvaguardas Técnicas',
            safeguards: [
                'Cifrado AES-256 en reposo y TLS 1.3 en tránsito para todo dato personal.',
                'Control de acceso por roles (RBAC) y principio de mínimo privilegio.',
                'Logs de auditoría inmutables y monitoreo continuo de accesos anómalos.',
                'Anonimización y seudonimización en entornos de desarrollo y testing.',
            ],
            rights_title: 'Derechos ARCO',
            rights: [
                'Acceso: Conocer qué datos tratamos, para qué y con quién se comparten.',
                'Rectificación: Corregir datos inexactos, incompletos o desactualizados.',
                'Cancelación: Solicitar supresión cuando el tratamiento no sea necesario.',
                'Oposición: Negarse al tratamiento por causa legítima.',
            ],
            contact_title: 'Contacto DPO',
            contact_desc: 'Para ejercer sus derechos o consultas sobre privacidad: contacto@xlerion.com | +57 313 226 3265 | Bogotá / Nocaima, Cundinamarca, Colombia',
        },
        en: {
            banner_subtitle: 'Data Processing Policy',
            banner_title: 'Privacy',
            header: 'At Xlerion, personal data protection is a fundamental architectural principle. We comply with Colombian Statutory Law 1581 of 2012 and Decree 1377 of 2013, ensuring responsible, secure, and transparent processing of the information entrusted to us.',
            principles_title: 'Guiding Principles',
            principles: [
                'Lawfulness and purpose: We process data only for legitimate, specific, and informed purposes.',
                'Freedom and accuracy: The data subject decides; data is accurate, complete, and updatable.',
                'Transparency and access: We clearly inform what, how, and why we process your data.',
                'Security and confidentiality: We apply appropriate technical and organizational measures for the risk level.',
            ],
            safeguards_title: 'Technical Safeguards',
            safeguards: [
                'AES-256 encryption at rest and TLS 1.3 in transit for all personal data.',
                'Role-based access control (RBAC) and principle of least privilege.',
                'Immutable audit logs and continuous monitoring of anomalous access.',
                'Anonymization and pseudonymization in development and testing environments.',
            ],
            rights_title: 'ARCO Rights',
            rights: [
                'Access: Know what data we process, for what purpose, and with whom it is shared.',
                'Rectification: Correct inaccurate, incomplete, or outdated data.',
                'Cancellation: Request erasure when processing is no longer necessary.',
                'Objection: Object to processing on legitimate grounds.',
            ],
            contact_title: 'DPO Contact',
            contact_desc: 'To exercise your rights or for privacy inquiries: contacto@xlerion.com | +57 313 226 3265 | Bogotá / Nocaima, Cundinamarca, Colombia',
        },
    };

    const c = t[lang] || t.es;

    return (
        <Layout>
            {/* Banner Parallax */}
            <div className="relative h-[40vh] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-8">
                        <Shield className="text-[#00e9fa] mx-auto mb-4" size={64} />
                        <p className="text-[#00e9fa] font-mono text-xs tracking-[0.4em] uppercase mb-2">{c.banner_subtitle}</p>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl">{c.banner_title}</h1>
                    </div>
                </div>
            </div>
            <div className="pt-20 pb-24 px-8 max-w-6xl mx-auto">
                <header className="mb-16">
                    <p className="text-gray-300 max-w-3xl text-lg leading-relaxed">{c.header}</p>
                </header>

                <div className="grid md:grid-cols-3 gap-10 mb-16">
                    <div className="p-8 border border-white/10 bg-white/5 rounded-sm">
                        <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Eye size={18} className="text-[#00e9fa]" /> {c.principles_title}</h3>
                        <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
                            {c.principles.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    </div>
                    <div className="p-8 border border-white/10 bg-white/5 rounded-sm">
                        <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Lock size={18} className="text-[#00e9fa]" /> {c.safeguards_title}</h3>
                        <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
                            {c.safeguards.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    </div>
                    <div className="p-8 border border-white/10 bg-white/5 rounded-sm">
                        <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><CheckCircle2 size={18} className="text-[#00e9fa]" /> {c.rights_title}</h3>
                        <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
                            {c.rights.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    </div>
                </div>

                <div className="p-8 border border-[#00e9fa]/20 bg-[#00e9fa]/5 rounded-sm">
                    <h4 className="text-[#00e9fa] font-mono text-xs uppercase tracking-[0.3em] mb-3">{c.contact_title}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{c.contact_desc}</p>
                </div>
            </div>
        </Layout>
    );
}