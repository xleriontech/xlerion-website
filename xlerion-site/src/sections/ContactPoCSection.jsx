import React, { useEffect, useRef, useState } from 'react';
import {
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  FileText,
  Download,
  Send,
  CheckCircle2,
  ArrowRight,
  Building2,
  User,
  Briefcase,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';

const SECTORS = [
  { value: 'manufactura', es: 'Manufactura', en: 'Manufacturing' },
  { value: 'mineria', es: 'Minería', en: 'Mining' },
  { value: 'smart-cities', es: 'Smart Cities & Gobierno', en: 'Smart Cities & Government' },
  { value: 'energia', es: 'Energía', en: 'Energy' },
  { value: 'logistica', es: 'Logística', en: 'Logistics' },
  { value: 'otro', es: 'Otro', en: 'Other' },
];

const INTERESTS = [
  { value: 'digital-twins', es: 'Gemelos Digitales & 3D', en: 'Digital Twins & 3D' },
  { value: 'rag', es: 'Plataformas RAG/IA', en: 'RAG/AI Platforms' },
  { value: 'iot', es: 'Telemetría IoT', en: 'IoT Telemetry' },
  { value: 'consulting', es: 'Consultoría', en: 'Consulting' },
];

const INITIAL_FORM = {
  name: '',
  company: '',
  email: '',
  role: '',
  sector: 'manufactura',
  interest: 'digital-twins',
  challenge: '',
  consent: true,
};

const INPUT_CLASS =
  'w-full bg-[#050508] border border-white/10 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:border-[#00e9fa] outline-none transition-colors';

const LABEL_CLASS = 'block text-xs font-mono uppercase tracking-[0.15em] text-gray-400 mb-2';

const COPY = {
  es: {
    subtitle: 'Contacto & Prueba de Concepto',
    title: 'Inicie su Prueba de Concepto Técnica',
    commitmentTitle: 'Compromiso de respuesta técnica',
    commitmentDesc:
      'Cada solicitud es analizada directamente por nuestro equipo de arquitectura. Recibirá una respuesta técnica estructurada en menos de 24 horas hábiles.',
    channelLabel: 'Canal corporativo',
    channelValue: 'contacto@xlerion.com',
    hqLabel: 'Sede principal',
    hqValue: 'Bogotá D.C., Colombia',
    slaLabel: 'SLA de respuesta',
    slaValue: '< 24 horas hábiles',
    ndaLabel: 'NDA opcional',
    ndaValue:
      'Firmamos Acuerdo de Confidencialidad mutuo antes de compartir planos, redes o telemetría de planta.',
    briefTitle: 'Ficha Técnica Ejecutiva',
    briefDesc: 'Documento de arquitectura B2B v4.2',
    briefCta: 'Descargar ficha técnica ejecutiva (PDF)',
    legalNotice:
      'Protección de datos conforme a la Ley 1581 de 2012 (Habeas Data). Sus especificaciones técnicas nunca son compartidas con terceros.',
    legalLink: 'Política de tratamiento de datos',
    formTitle: 'Formulario de evaluación de proyecto',
    formSubtitle: 'Campos requeridos para preparar la sesión técnica',
    name: 'Nombre',
    company: 'Empresa',
    email: 'Correo corporativo',
    role: 'Cargo',
    sector: 'Sector',
    interest: 'Línea de interés',
    challenge: '¿Cuál es su mayor desafío con los datos?',
    namePh: 'Ej. Ing. Carlos Mendoza',
    companyPh: 'Ej. Minera Andina S.A.',
    emailPh: 'nombre@empresa.com',
    rolePh: 'Ej. CTO / Gerente de Planta / Director TI',
    challengePh:
      'Ej. Reportes entre plantas con alta latencia o dificultad para consultar 40.000 manuales técnicos sin alucinaciones...',
    consent: 'Autorizo el tratamiento de mis datos personales conforme a la Ley 1581 de 2012.',
    submit: 'Agendar Prueba de Concepto (PoC)',
    submitting: 'Procesando solicitud técnica...',
    customerFallback: 'equipo',
    successTicket: 'Ticket generado',
    successTitle: 'Solicitud de PoC registrada exitosamente',
    successThanks: 'Gracias,',
    successArchitect:
      'Hemos asignado su desafío técnico al equipo de arquitectura de Xlerion y le contactaremos en menos de 24 horas hábiles.',
    summaryTitle: 'Resumen del requerimiento',
    sumSector: 'Sector',
    sumLine: 'Línea',
    sumSla: 'SLA de contacto',
    sumSlaValue: '< 24h hábiles',
    successBrief: 'Descargar ficha técnica',
    successNew: 'Nueva consulta',
  },
  en: {
    subtitle: 'Contact & Proof of Concept',
    title: 'Start Your Technical Proof of Concept',
    commitmentTitle: 'Technical response commitment',
    commitmentDesc:
      'Every request is reviewed directly by our architecture team. You will receive a structured technical response in under 24 business hours.',
    channelLabel: 'Corporate channel',
    channelValue: 'contacto@xlerion.com',
    hqLabel: 'Headquarters',
    hqValue: 'Bogotá D.C., Colombia',
    slaLabel: 'Response SLA',
    slaValue: '< 24 business hours',
    ndaLabel: 'Optional NDA',
    ndaValue:
      'We sign a mutual Confidentiality Agreement before sharing blueprints, network diagrams or plant telemetry.',
    briefTitle: 'Executive Technical Brief',
    briefDesc: 'B2B architecture document v4.2',
    briefCta: 'Download executive technical brief (PDF)',
    legalNotice:
      'Data protection under Colombian Law 1581 of 2012 (Habeas Data). Your technical specifications are never shared with third parties.',
    legalLink: 'Personal data processing policy',
    formTitle: 'Project evaluation form',
    formSubtitle: 'Required fields to prepare the technical session',
    name: 'Name',
    company: 'Company',
    email: 'Corporate email',
    role: 'Role',
    sector: 'Industry',
    interest: 'Area of interest',
    challenge: 'What is your biggest data challenge today?',
    namePh: 'E.g. Eng. Carlos Mendoza',
    companyPh: 'E.g. Andean Mining Corp.',
    emailPh: 'name@company.com',
    rolePh: 'E.g. CTO / Plant Manager / IT Director',
    challengePh:
      'E.g. High-latency reports across plants, or querying 40,000 technical manuals without hallucinations...',
    consent: 'I authorize the processing of my personal data under Colombian Law 1581 of 2012.',
    submit: 'Schedule Proof of Concept (PoC)',
    submitting: 'Processing technical request...',
    customerFallback: 'team',
    successTicket: 'Ticket generated',
    successTitle: 'PoC request successfully registered',
    successThanks: 'Thank you,',
    successArchitect:
      'We have assigned your technical challenge to the Xlerion architecture team and will contact you within 24 business hours.',
    summaryTitle: 'Request summary',
    sumSector: 'Industry',
    sumLine: 'Area',
    sumSla: 'Contact SLA',
    sumSlaValue: '< 24 business hours',
    successBrief: 'Download technical brief',
    successNew: 'New inquiry',
  },
};

const matchOption = (options, input) => {
  if (!input) return null;
  const norm = String(input).trim().toLowerCase();
  const found = options.find(
    (o) =>
      o.value.toLowerCase() === norm ||
      o.es.toLowerCase() === norm ||
      o.en.toLowerCase() === norm
  );
  return found ? found.value : null;
};

const labelOf = (options, value, lang) => {
  const found = options.find((o) => o.value === value);
  return found ? found[lang] : value;
};

export default function ContactPoCSection({ prefill, onOpenPrivacy, onOpenExecutiveBrief }) {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.es;

  // Los parámetros calculados en el ROI se aplican como estado INICIAL. El Home
  // remonta esta sección (mediante `key`) cada vez que se aplican, así que no
  // hace falta sincronizar props con efectos.
  const [formData, setFormData] = useState(() => {
    const initial = { ...INITIAL_FORM };
    if (prefill) {
      if (prefill.sector) initial.sector = matchOption(SECTORS, prefill.sector) || 'otro';
      if (prefill.solutionType) initial.interest = matchOption(INTERESTS, prefill.solutionType) || 'consulting';
      if (prefill.challenge) initial.challenge = prefill.challenge;
    }
    return initial;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const timerRef = useRef(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const setField = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting || !formData.consent) return;
    setIsSubmitting(true);
    timerRef.current = setTimeout(() => {
      setTicketId(`POC-XLERION-${Math.floor(1000 + Math.random() * 9000)}`);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 900);
  };

  const handleNewQuery = () => {
    setFormData(INITIAL_FORM);
    setTicketId('');
    setIsSuccess(false);
  };

  const contactRows = [
    { icon: Mail, label: c.channelLabel, value: c.channelValue, accent: 'text-[#00e9fa]' },
    { icon: MapPin, label: c.hqLabel, value: c.hqValue, accent: 'text-[#00e9fa]' },
    { icon: Clock, label: c.slaLabel, value: c.slaValue, accent: 'text-[#00e9fa]' },
  ];

  return (
    <section
      id="contacto"
      className="relative py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[420px] bg-[#00e9fa]/[0.04] rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative">
        <div data-reveal>
          <SectionHeader title={c.title} subtitle={c.subtitle} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left column: response commitment */}
          <div data-reveal className="stagger-1 space-y-6">
            <div className="relative bg-[#0a0a12]/80 border border-[#00e9fa]/20 border-l-4 border-l-[#00e9fa] rounded-lg p-6 md:p-8 backdrop-blur-sm glow-on-hover">
              <h3 className="text-white text-lg font-semibold mb-2">{c.commitmentTitle}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{c.commitmentDesc}</p>

              <div className="space-y-3">
                {contactRows.map(({ icon: Icon, label, value, accent }, index) => (
                  <div
                    key={label}
                    className={`flex items-start gap-3 pt-3 ${index === 0 ? '' : 'border-t border-white/[0.08]'}`}
                  >
                    <div className="w-8 h-8 rounded-md bg-[#050508] border border-white/[0.08] flex items-center justify-center shrink-0">
                      <Icon size={16} className={accent} />
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">
                        {label}
                      </span>
                      <span className="text-white text-sm">{value}</span>
                    </div>
                  </div>
                ))}

                <div className="flex items-start gap-3 pt-3 border-t border-white/[0.08]">
                  <div className="w-8 h-8 rounded-md bg-[#050508] border border-white/[0.08] flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} className="text-[#00e9fa]" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">
                      {c.ndaLabel}
                    </span>
                    <span className="text-gray-400 text-sm leading-relaxed">{c.ndaValue}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Executive brief widget */}
            <div className="relative bg-white/[0.02] border border-[#00e9fa]/20 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover">
              <div className="flex items-start gap-3">
                <FileText size={20} className="text-[#00e9fa] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white text-sm font-semibold">{c.briefTitle}</h3>
                  <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-gray-500 mt-1">
                    {c.briefDesc}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenExecutiveBrief}
                className="xl-btn-secondary shrink-0 text-xs gap-2"
              >
                <Download size={15} />
                {c.briefCta}
              </button>
            </div>

            {/* Data protection notice */}
            <div className="bg-[#050508] border border-white/[0.08] rounded-lg p-4 flex items-start gap-3">
              <ShieldCheck size={16} className="text-[#00e9fa] shrink-0 mt-0.5" />
              <span className="text-[11px] font-mono text-gray-400 leading-relaxed">
                {c.legalNotice}{' '}
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="text-[#00e9fa] underline hover:text-[#33edfb] transition-colors"
                >
                  {c.legalLink}
                </button>
                .
              </span>
            </div>
          </div>

          {/* Right column: evaluation form */}
          <div data-reveal className="stagger-2">
            <div className="relative bg-[#0a0a12]/80 border border-[#00e9fa]/20 rounded-lg p-6 md:p-8 backdrop-blur-sm glow-on-hover">
              {isSuccess ? (
                <div className="py-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#00e9fa]/10 border border-[#00e9fa]/40 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={30} className="text-[#00e9fa]" />
                  </div>

                  <span className="inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-[#00e9fa] bg-[#00e9fa]/[0.06] border border-[#00e9fa]/30 rounded px-3 py-1">
                    {c.successTicket}: {ticketId}
                  </span>

                  <h3 className="text-white text-xl font-semibold mt-4">{c.successTitle}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mt-2">
                    {c.successThanks}{' '}
                    <span className="text-white font-semibold">
                      {formData.name || c.customerFallback}
                    </span>
                    {formData.company ? ` (${formData.company})` : ''} {c.successArchitect}
                  </p>

                  <div className="mt-5 bg-[#050508] border border-white/[0.08] rounded-lg p-4 text-left font-mono text-xs space-y-2 max-w-md mx-auto">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                      {c.summaryTitle}
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-500">{c.sumSector}</span>
                      <span className="text-white text-right">{labelOf(SECTORS, formData.sector, lang)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-500">{c.sumLine}</span>
                      <span className="text-[#00e9fa] text-right">{labelOf(INTERESTS, formData.interest, lang)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-500">{c.sumSla}</span>
                      <span className="text-[#00e9fa] text-right">{c.sumSlaValue}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={onOpenExecutiveBrief}
                      className="xl-btn-secondary text-xs gap-2 w-full sm:w-auto"
                    >
                      <Download size={15} />
                      {c.successBrief}
                    </button>
                    <button
                      type="button"
                      onClick={handleNewQuery}
                      className="xl-btn-primary text-xs gap-2 w-full sm:w-auto"
                    >
                      {c.successNew}
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-white/[0.08] pb-4">
                    <h3 className="text-white text-lg font-semibold">{c.formTitle}</h3>
                    <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500 mt-1">
                      {c.formSubtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL_CLASS} htmlFor="poc-name">
                        <User size={12} className="inline text-[#00e9fa] mr-1.5" />
                        {c.name} <span className="text-[#00e9fa]">*</span>
                      </label>
                      <input
                        id="poc-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={setField('name')}
                        placeholder={c.namePh}
                        className={INPUT_CLASS}
                      />
                    </div>

                    <div>
                      <label className={LABEL_CLASS} htmlFor="poc-company">
                        <Building2 size={12} className="inline text-[#00e9fa] mr-1.5" />
                        {c.company} <span className="text-[#00e9fa]">*</span>
                      </label>
                      <input
                        id="poc-company"
                        type="text"
                        required
                        value={formData.company}
                        onChange={setField('company')}
                        placeholder={c.companyPh}
                        className={INPUT_CLASS}
                      />
                    </div>

                    <div>
                      <label className={LABEL_CLASS} htmlFor="poc-email">
                        <Mail size={12} className="inline text-[#00e9fa] mr-1.5" />
                        {c.email} <span className="text-[#00e9fa]">*</span>
                      </label>
                      <input
                        id="poc-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={setField('email')}
                        placeholder={c.emailPh}
                        className={INPUT_CLASS}
                      />
                    </div>

                    <div>
                      <label className={LABEL_CLASS} htmlFor="poc-role">
                        <Briefcase size={12} className="inline text-[#00e9fa] mr-1.5" />
                        {c.role}
                      </label>
                      <input
                        id="poc-role"
                        type="text"
                        value={formData.role}
                        onChange={setField('role')}
                        placeholder={c.rolePh}
                        className={INPUT_CLASS}
                      />
                    </div>

                    <div>
                      <label className={LABEL_CLASS} htmlFor="poc-sector">
                        <Layers size={12} className="inline text-[#00e9fa] mr-1.5" />
                        {c.sector}
                      </label>
                      <select
                        id="poc-sector"
                        value={formData.sector}
                        onChange={setField('sector')}
                        className={`${INPUT_CLASS} cursor-pointer font-mono text-sm`}
                      >
                        {SECTORS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option[lang]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={LABEL_CLASS} htmlFor="poc-interest">
                        <Layers size={12} className="inline text-[#00e9fa] mr-1.5" />
                        {c.interest}
                      </label>
                      <select
                        id="poc-interest"
                        value={formData.interest}
                        onChange={setField('interest')}
                        className={`${INPUT_CLASS} cursor-pointer font-mono text-sm`}
                      >
                        {INTERESTS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option[lang]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={LABEL_CLASS} htmlFor="poc-challenge">
                      <HelpCircle size={12} className="inline text-[#00e9fa] mr-1.5" />
                      {c.challenge} <span className="text-[#00e9fa]">*</span>
                    </label>
                    <textarea
                      id="poc-challenge"
                      required
                      rows={4}
                      value={formData.challenge}
                      onChange={setField('challenge')}
                      placeholder={c.challengePh}
                      className={`${INPUT_CLASS} resize-none`}
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      id="poc-consent"
                      type="checkbox"
                      required
                      checked={formData.consent}
                      onChange={setField('consent')}
                      className="mt-0.5 accent-[#00e9fa]"
                    />
                    <p className="text-[11px] font-mono text-gray-400 leading-relaxed">
                      <label htmlFor="poc-consent" className="cursor-pointer">
                        {c.consent}
                      </label>{' '}
                      <button
                        type="button"
                        onClick={onOpenPrivacy}
                        className="text-[#00e9fa] underline hover:text-[#33edfb] transition-colors"
                      >
                        {c.legalLink}
                      </button>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="xl-btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      c.submitting
                    ) : (
                      <>
                        {c.submit}
                        <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
