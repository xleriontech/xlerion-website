import React from 'react';
import { Info, ShieldCheck, Scale, FileText } from 'lucide-react';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';
import { useAnalytics } from '../hooks/useAnalytics';

export default function TermsPage() {
    const { lang } = useLanguage();
    useAnalytics('Términos y Condiciones', 'page');

    const t = {
        es: {
            banner_subtitle: 'Términos de Uso del Sitio y Servicios',
            banner_title: 'Términos y Condiciones',
            header: 'Estos términos regulan el uso del sitio web xlerion.com y los servicios ofrecidos por Xlerion. Al acceder y utilizar nuestro sitio, usted acepta cumplir con estos términos. Si no está de acuerdo, por favor no utilice nuestros servicios.',
            responsibilities_title: 'Responsabilidades del Usuario',
            responsibilities: [
                'Utilizar el sitio y servicios de manera lícita, ética y conforme a la legislación aplicable.',
                'No intentar acceder, interferir o comprometer la seguridad de nuestros sistemas, redes o datos.',
                'Proporcionar información veraz, actualizada y completa en formularios de contacto y solicitudes.',
                'Respetar los derechos de propiedad intelectual e industrial sobre contenidos, código y diseños publicados.',
            ],
            limitations_title: 'Limitaciones de Responsabilidad',
            limitations: [
                'Los contenidos se proporcionan "tal cual" sin garantías explícitas o implícitas de idoneidad para fines específicos.',
                'Xlerion no se responsabiliza por daños indirectos, incidentales o consecuentes derivados del uso del sitio.',
                'La información técnica y casos de estudio son referenciales; los resultados pueden variar según contexto de implementación.',
                'Los enlaces a terceros no implican endoso; no controlamos su contenido ni políticas de privacidad.',
            ],
            updates_title: 'Actualizaciones',
            updates_desc: 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor tras su publicación en esta página. El uso continuado constituye aceptación de los nuevos términos. Última actualización: 2026.',
        },
        en: {
            banner_subtitle: 'Terms of Use for Site and Services',
            banner_title: 'Terms & Conditions',
            header: 'These terms govern the use of xlerion.com and the services offered by Xlerion. By accessing and using our site, you agree to comply with these terms. If you do not agree, please do not use our services.',
            responsibilities_title: 'User Responsibilities',
            responsibilities: [
                'Use the site and services lawfully, ethically, and in compliance with applicable legislation.',
                'Do not attempt to access, interfere with, or compromise the security of our systems, networks, or data.',
                'Provide truthful, current, and complete information in contact forms and requests.',
                'Respect intellectual and industrial property rights over published content, code, and designs.',
            ],
            limitations_title: 'Limitations of Liability',
            limitations: [
                'Content is provided "as is" without explicit or implied warranties of fitness for a particular purpose.',
                'Xlerion is not liable for indirect, incidental, or consequential damages arising from site use.',
                'Technical information and case studies are reference only; results may vary by implementation context.',
                'Third-party links do not imply endorsement; we do not control their content or privacy policies.',
            ],
            updates_title: 'Updates',
            updates_desc: 'We reserve the right to modify these terms at any time. Changes take effect upon posting to this page. Continued use constitutes acceptance of new terms. Last updated: 2026.',
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
                        <Info className="text-[#00e9fa] mx-auto mb-4" size={64} />
                        <p className="text-[#00e9fa] font-mono text-xs tracking-[0.4em] uppercase mb-2">{c.banner_subtitle}</p>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl">{c.banner_title}</h1>
                    </div>
                </div>
            </div>
            <div className="pt-20 pb-24 px-8 max-w-6xl mx-auto">
                <header className="mb-16">
                    <p className="text-gray-300 max-w-3xl text-lg leading-relaxed">{c.header}</p>
                </header>

                <div className="grid md:grid-cols-2 gap-10 mb-16">
                    <div className="p-8 border border-white/10 bg-white/5 rounded-sm">
                        <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><ShieldCheck size={18} className="text-[#00e9fa]" /> {c.responsibilities_title}</h3>
                        <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
                            {c.responsibilities.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    </div>
                    <div className="p-8 border border-white/10 bg-white/5 rounded-sm">
                        <h3 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Scale size={18} className="text-[#00e9fa]" /> {c.limitations_title}</h3>
                        <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
                            {c.limitations.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    </div>
                </div>

                <div className="p-8 border border-[#00e9fa]/20 bg-[#00e9fa]/5 rounded-sm">
                    <h4 className="text-[#00e9fa] font-mono text-xs uppercase tracking-[0.3em] mb-3 flex items-center gap-2"><FileText size={16} /> {c.updates_title}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{c.updates_desc}</p>
                </div>
            </div>
        </Layout>
    );
}