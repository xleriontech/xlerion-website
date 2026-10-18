import React, { useEffect } from 'react';
import { X, ShieldCheck, Lock, FileText, Server, UserCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const COPY = {
  es: {
    badge: 'Marco legal & cumplimiento',
    title: 'Política de Tratamiento de Datos Personales',
    subtitle: 'Ley 1581 de 2012 & Decreto 1377 de 2013 • República de Colombia',
    blocks: [
      {
        icon: FileText,
        title: '1. Responsable del tratamiento',
        body: 'Xlerion S.A.S., sociedad legalmente constituida en Bogotá D.C., Colombia, actúa como Responsable del Tratamiento de los datos personales capturados a través de sus formularios de contacto, solicitudes de Prueba de Concepto (PoC) y plataformas institucionales.',
      },
      {
        icon: Lock,
        title: '2. Finalidad del tratamiento',
        body: 'Los datos solicitados (nombre, empresa, correo corporativo, cargo, sector y descripción del reto técnico) se utilizan exclusivamente para:',
        bullets: [
          'Coordinar pruebas de concepto (PoC) y sesiones técnicas de descubrimiento.',
          'Estructurar propuestas de arquitectura y dimensionar capacidades de ingeniería.',
          'Formalizar Acuerdos de Confidencialidad (NDA) cuando se requiera.',
        ],
      },
      {
        icon: ShieldCheck,
        title: '3. Seguridad y no comercialización',
        body: 'Xlerion no comercializa, cede ni transfiere información a terceros bajo ninguna circunstancia. Aplicamos cifrado en tránsito (TLS 1.3 / WSS) y en reposo (AES-256), control de acceso basado en roles (RBAC) y auditoría de registros, alineados con el estándar ISO/IEC 27001.',
      },
      {
        icon: Server,
        title: '4. Confidencialidad de la telemetría',
        body: 'La telemetría industrial, los manuales técnicos, los planos CAD/BIM y las bases de conocimiento recibidas durante un PoC se tratan como información confidencial. Nunca se utilizan para entrenar modelos de inteligencia artificial públicos ni se comparten con terceros.',
      },
      {
        icon: UserCheck,
        title: '5. Derechos del titular (ARCO)',
        body: 'En virtud de la Ley 1581 de 2012 y el Decreto 1377 de 2013, usted puede conocer, actualizar, rectificar, suprimir y revocar la autorización sobre sus datos personales en cualquier momento, enviando una comunicación formal a:',
        email: 'habeasdata@xlerion.com',
      },
    ],
    vigencia: 'Vigente • Actualizado 2026',
    accept: 'Entendido y aceptado',
  },
  en: {
    badge: 'Legal framework & compliance',
    title: 'Personal Data Processing Policy',
    subtitle: 'Colombian Law 1581 of 2012 & Decree 1377 of 2013',
    blocks: [
      {
        icon: FileText,
        title: '1. Data controller',
        body: 'Xlerion S.A.S., a company legally incorporated in Bogotá D.C., Colombia, acts as the Data Controller for the personal data captured through its contact forms, Proof of Concept (PoC) requests and institutional platforms.',
      },
      {
        icon: Lock,
        title: '2. Purpose of processing',
        body: 'The requested data (name, company, corporate email, role, industry and description of the technical challenge) is used exclusively to:',
        bullets: [
          'Coordinate proof of concepts (PoC) and technical discovery sessions.',
          'Structure architecture proposals and size engineering capacity.',
          'Formalize mutual Confidentiality Agreements (NDA) when required.',
        ],
      },
      {
        icon: ShieldCheck,
        title: '3. Security and no commercialization',
        body: 'Xlerion does not commercialize, assign or transfer information to third parties under any circumstance. We apply encryption in transit (TLS 1.3 / WSS) and at rest (AES-256), role-based access control (RBAC) and log auditing, aligned with the ISO/IEC 27001 standard.',
      },
      {
        icon: Server,
        title: '4. Telemetry confidentiality',
        body: 'Industrial telemetry, technical manuals, CAD/BIM blueprints and knowledge bases received during a PoC are treated as confidential information. They are never used to train public artificial intelligence models, nor shared with third parties.',
      },
      {
        icon: UserCheck,
        title: '5. Data subject rights (ARCO)',
        body: 'Under Colombian Law 1581 of 2012 and Decree 1377 of 2013, you may know, update, rectify, delete and revoke authorization over your personal data at any time by sending a formal request to:',
        email: 'habeasdata@xlerion.com',
      },
    ],
    vigencia: 'In force • Updated 2026',
    accept: 'Understood and accepted',
  },
};

export default function PrivacyModal({ isOpen, onClose }) {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.es;

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative bg-[#0a0a12] border border-[#00e9fa]/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={c.title}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/[0.08] bg-[#0a0a12]/95 backdrop-blur-md p-6 md:p-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-md bg-[#00e9fa]/10 border border-[#00e9fa]/30 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} className="text-[#00e9fa]" />
            </div>
            <div>
              <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#00e9fa] mb-1">
                {c.badge}
              </span>
              <h3 className="text-white text-lg md:text-xl font-semibold">{c.title}</h3>
              <p className="text-[11px] font-mono text-gray-500 mt-1">{c.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          {c.blocks.map(({ icon: Icon, title, body, bullets, email }) => (
            <div key={title}>
              <h4 className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#00e9fa] mb-2">
                <Icon size={15} />
                {title}
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed">{body}</p>

              {bullets && (
                <ul className="mt-3 space-y-2 pl-3 border-l border-[#00e9fa]/20">
                  {bullets.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                      <CheckCircle2 size={14} className="text-[#00e9fa] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="inline-block mt-3 font-mono text-sm text-[#00e9fa] hover:text-[#33edfb] underline transition-colors"
                >
                  {email}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.08] bg-[#0a0a12]/95 backdrop-blur-md p-6 md:p-8">
          <span className="font-mono text-[11px] text-gray-500 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-[#00e9fa]" />
            {c.vigencia}
          </span>
          <button type="button" onClick={onClose} className="xl-btn-primary text-xs w-full sm:w-auto">
            {c.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
