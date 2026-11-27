import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function LegalIndexPage() {
  const { lang } = useLanguage();

  useEffect(() => {
    const prev = document.title;
    document.title = lang === 'es' ? 'Legal | XLERION' : 'Legal | XLERION';
    return () => { document.title = prev; };
  }, [lang]);

  const items = [
    {
      to: '/legal/privacidad',
      title: lang === 'es' ? 'Política de Tratamiento de Datos' : 'Data Processing Policy',
      desc: lang === 'es' ? 'Política de privacidad y tratamiento de datos personales (Ley 1581 de 2012).' : 'Privacy and personal data processing policy.',
      external: false,
    },
    {
      to: '/legal/terminos',
      title: lang === 'es' ? 'Términos y Condiciones' : 'Terms and Conditions',
      desc: lang === 'es' ? 'Términos y condiciones de uso del sitio y servicios.' : 'Terms and conditions for site and services.',
      external: false,
    },
    {
      to: '/legal/contratos',
      title: lang === 'es' ? 'Contratos y Plantillas' : 'Contracts & Templates',
      desc: lang === 'es' ? 'Plantillas editables: cláusula PI para freelancer y anexo técnico. Acceso con clave.' : 'Editable templates: freelancer IP clause and technical annex. Key-protected.',
      external: false,
      badge: lang === 'es' ? 'Clave requerida' : 'Key required',
    },
    {
      to: '/legal/manual-de-funciones',
      title: lang === 'es' ? 'Manual de Funciones y Servicios' : 'Functions & Services Manual',
      desc: lang === 'es' ? 'Funciones operativas, arquitectura técnica, RACI, KPIs y SLA de las líneas de servicio de Xlerion.' : 'Operational functions, technical architecture, RACI, KPIs, and SLAs for Xlerion service lines.',
      external: false,
    },
    {
      href: '/manual-de-imagen.html',
      title: lang === 'es' ? 'Manual de Imagen' : 'Brand Manual',
      desc: lang === 'es' ? 'Guía de identidad visual, usos de marca y recursos gráficos de Xlerion.' : 'Visual identity guide, brand usage, and graphic resources.',
      external: true,
    },
    {
      href: '/xlerion-content-creator.html',
      title: lang === 'es' ? 'Creador de Contenido para Redes' : 'Social Content Creator',
      desc: lang === 'es' ? 'Herramienta interna para crear piezas de contenido para redes sociales.' : 'Internal tool for creating social media content pieces.',
      external: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#00e9fa] mb-3">Xlerion</p>
        <h1 className="text-3xl md:text-4xl font-semibold mb-3">{lang === 'es' ? 'Centro Legal' : 'Legal Center'}</h1>
        <p className="text-gray-400 mb-10 max-w-2xl">{lang === 'es' ? 'Documentos legales, plantillas contractuales y recursos de marca de XLERION S.A.S.' : 'Legal documents, contract templates, and brand resources for XLERION S.A.S.'}</p>

        <div className="grid gap-4">
          {items.map((item) => {
            const cls = "group rounded-xl border border-white/10 bg-white/[0.02] p-6 hover:border-[#00e9fa]/40 hover:bg-white/[0.04] transition-colors";
            const inner = (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium group-hover:text-[#00e9fa] transition-colors">{item.title}</h2>
                  <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                </div>
                {item.badge && <span className="shrink-0 rounded-full border border-[#00e9fa]/30 bg-[#00e9fa]/10 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[#00e9fa]">{item.badge}</span>}
              </div>
            );
            return item.href ? (
              <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
            ) : (
              <Link key={item.to} to={item.to} className={cls}>{inner}</Link>
            );
          })}
        </div>

        <div className="mt-10">
          <Link to="/" className="text-sm text-gray-400 hover:text-[#00e9fa] transition-colors">← {lang === 'es' ? 'Volver al inicio' : 'Back to home'}</Link>
        </div>
      </div>
    </div>
  );
}
