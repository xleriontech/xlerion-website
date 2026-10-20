import React, { useEffect, useRef, useState } from 'react';
import {
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  FileText,
  Download,
  Send,
  Building2,
  User,
  Briefcase,
  Layers,
  HelpCircle,
  Check,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';

const SECTORS_ES = ['Minería', 'Manufactura', 'Smart Cities', 'Energía', 'Otro'];
const SECTORS_EN = ['Mining', 'Manufacturing', 'Smart Cities', 'Energy', 'Other'];

const INTERESTS_ES = ['Gemelos Digitales 3D', 'Plataformas RAG/IA', 'Telemetría IoT', 'Consultoría'];
const INTERESTS_EN = ['Digital Twins 3D', 'RAG/AI Platforms', 'IoT Telemetry', 'Consulting'];

const INITIAL_FORM = {
  name: '',
  company: '',
  email: '',
  role: '',
  sector: '',
  interest: '',
  challenge: '',
  consent: false,
};

const INPUT_CLASS =
  'w-full bg-[#050508] border border-white/10 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:border-[#00e9fa] outline-none transition-colors';

const LABEL_CLASS = 'block text-xs font-mono uppercase tracking-[0.15em] text-gray-400 mb-2';

const COPY = {
  es: {
    subtitle: 'Inicie su Prueba de Concepto Técnica',
    title: 'Solicitud de PoC',
    commitmentTitle: 'Compromiso de respuesta técnica',
    commitmentDesc:
      'Cada solicitud es analizada directamente por nuestra arquitectura. Recibirá una respuesta técnica estructurada en menos de 24 horas hábiles. Firmamos NDA (Acuerdo de Confidencialidad) antes de revisar planos, redes o telemetría de planta.',
    channelLabel: 'Correo corporativo',
    channelValue: 'contacto@xlerion.co',
    hqLabel: 'Ubicación',
    hqValue: 'Bogotá / Nocaima, Cundinamarca, Colombia',
    slaLabel: 'SLA de respuesta',
    slaValue: '< 24 horas hábiles',
    ndaLabel: 'NDA',
    ndaValue: 'Firmamos Acuerdo de Confidencialidad mutuo antes de compartir planos, redes o telemetría de planta.',
    formTitle: 'Formulario de solicitud de PoC',
    formSubtitle: 'Campos requeridos para preparar la evaluación técnica',
    name: 'Nombre completo',
    company: 'Empresa',
    email: 'Correo corporativo',
    role: 'Cargo',
    sector: 'Sector de interés',
    interest: 'Línea de interés',
    challenge: '¿Cuál es su mayor desafío actual con los datos?',
    namePh: 'Ej. Ing. Carlos Mendoza',
    companyPh: 'Ej. Minera Andina S.A.',
    emailPh: 'nombre@empresa.com',
    rolePh: 'Ej. CTO / Gerente de Planta / Director TI',
    challengePh: 'Describa su desafío actual con los datos industriales...',
    consent: 'Autorizo el tratamiento de mis datos personales conforme a la Política de Tratamiento de Datos de Xlerion, en cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013 de la República de Colombia.',
    submit: 'Solicitar Evaluación Técnica y PoC',
    submitting: 'Procesando solicitud técnica...',
    successTicket: 'Ticket generado',
    successTitle: 'Solicitud de PoC registrada exitosamente',
    successThanks: 'Gracias,',
    successArchitect: 'Hemos asignado su desafío técnico al equipo de arquitectura de Xlerion y le contactaremos en menos de 24 horas hábiles.',
    contactEmail: 'contacto@xlerion.co',
    contactLocation: 'Bogotá / Nocaima, Cundinamarca, Colombia',
    contactSla: '< 24 horas hábiles',
    legalNotice: 'Política de Tratamiento de Datos (Ley 1581 de 2012) | © 2026 Xlerion',
  },
  en: {
    subtitle: 'Start Your Technical Proof of Concept',
    title: 'PoC Request',
    commitmentTitle: 'Technical response commitment',
    commitmentDesc: 'Each request is analyzed directly by our architecture team. You will receive a structured technical response in under 24 business hours. We sign an NDA (Confidentiality Agreement) before reviewing blueprints, networks or plant telemetry.',
    channelLabel: 'Corporate email',
    channelValue: 'contacto@xlerion.co',
    hqLabel: 'Location',
    hqValue: 'Bogotá / Nocaima, Cundinamarca, Colombia',
    slaLabel: 'Response SLA',
    slaValue: '< 24 business hours',
    ndaLabel: 'NDA',
    ndaValue: 'We sign a mutual Confidentiality Agreement before sharing blueprints, network diagrams or plant telemetry.',
    formTitle: 'PoC Request Form',
    formSubtitle: 'Required fields to prepare the technical evaluation',
    name: 'Full Name',
    company: 'Company',
    email: 'Corporate Email',
    role: 'Role',
    sector: 'Industry of Interest',
    interest: 'Line of Interest',
    challenge: 'What is your biggest data challenge today?',
    namePh: 'E.g. Eng. Carlos Mendoza',
    companyPh: 'E.g. Andean Mining Corp.',
    emailPh: 'name@company.com',
    rolePh: 'E.g. CTO / Plant Manager / IT Director',
    challengePh: 'Describe your current challenge with industrial data...',
    consent: 'I authorize the processing of my personal data in accordance with Xlerion Data Processing Policy, complying with Law 1581 of 2012 and Decree 1377 of 2013 of the Republic of Colombia.',
    submit: 'Request Technical Evaluation and PoC',
    submitting: 'Processing technical request...',
    successTicket: 'Ticket generated',
    successTitle: 'PoC request successfully registered',
    successThanks: 'Thank you,',
    successArchitect: 'We have assigned your technical challenge to the Xlerion architecture team and will contact you within 24 business hours.',
    contactEmail: 'contacto@xlerion.co',
    contactLocation: 'Bogotá / Nocaima, Cundinamarca, Colombia',
    contactSla: '< 24 business hours',
    legalNotice: 'Data Processing Policy (Law 1581 of 2012) | © 2026 Xlerion',
  },
};

const matchOption = (options, input) => {
  if (!input) return null;
  const norm = String(input).trim().toLowerCase();
  const found = options.find((o) => o.toLowerCase() === norm);
  return found ? found : null;
};

export default function ContactPoCSection() {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.es;
  const sectors = lang === 'en' ? SECTORS_EN : SECTORS_ES;
  const interests = lang === 'en' ? INTERESTS_EN : INTERESTS_ES;

  const [formData, setFormData] = useState(() => ({ ...INITIAL_FORM }));
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

  const isCorporateEmail = (email) => {
    if (!email) return false;
    const publicDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'icloud.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return domain && !publicDomains.includes(domain);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !formData.consent) return;

    if (!isCorporateEmail(formData.email)) {
      alert('El correo debe ser corporativo (no se aceptan dominios públicos genéricos como gmail.com, yahoo.com, etc.)');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setTicketId(data.ticketId || 'XLR-' + Date.now());
        setIsSuccess(true);
      } else {
        alert(data.error || 'Error al enviar la solicitud');
      }
    } catch {
      alert('Error de conexión. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewQuery = () => {
    setFormData(INITIAL_FORM);
    setTicketId('');
    setIsSuccess(false);
  };

  const contactRows = [
    { icon: Mail, label: c.channelLabel, value: c.contactEmail, accent: 'text-[#00e9fa]' },
    { icon: MapPin, label: c.hqLabel, value: c.contactLocation, accent: 'text-[#00e9fa]' },
    { icon: Clock, label: c.slaLabel, value: c.contactSla, accent: 'text-[#00e9fa]' },
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
                    <div className="w-8 h-8 rounded-md bg-[#0b1018] border border-[#00e9fa]/30 flex items-center justify-center shrink-0">
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
                  <h3 className="text-white text-sm font-semibold">Ficha Técnica Ejecutiva</h3>
                  <p className="mt-1 text-[11px] font-mono uppercase tracking-[0.15em] text-gray-500">
                    Documento de arquitectura B2B v4.2
                  </p>
                </div>
              </div>
            </div>

            {/* Data protection notice */}
            <div className="bg-[#050508] border border-white/[0.08] rounded-lg p-4 flex items-start gap-3">
              <ShieldCheck size={16} className="text-[#00e9fa] shrink-0 mt-0.5" />
              <span className="text-[11px] font-mono text-gray-400 leading-relaxed">
                {c.legalNotice}
              </span>
            </div>
          </div>

          {/* Right column: evaluation form */}
          <div data-reveal className="stagger-2">
            {isSuccess ? (
              <div className="relative bg-[#0a0a12]/80 border border-[#00e9fa]/20 rounded-lg p-6 md:p-8 backdrop-blur-sm glow-on-hover">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#00e9fa]/20 flex items-center justify-center mx-auto mb-4">
                    <Check size={24} className="text-[#00e9fa]" />
                  </div>
                  <h3 className="text-white text-lg font-semibold mb-2">{c.successTitle}</h3>
                  <p className="text-gray-400 text-sm mb-4">{c.successThanks} <span className="text-white font-mono">#{ticketId}</span></p>
                  <p className="text-sm text-[#00e9fa] mb-6">{c.successArchitect}</p>
                  <button type="button" onClick={handleNewQuery} className="xl-btn-secondary text-xs">
                    Nueva consulta
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative bg-[#0a0a12]/80 border border-[#00e9fa]/20 rounded-lg p-6 md:p-8 backdrop-blur-sm glow-on-hover">
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
                        <option value="">Seleccionar sector</option>
                        {sectors.map((option) => (
                          <option key={option} value={option}>{option}</option>
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
                        <option value="">Seleccionar línea de interés</option>
                        {interests.map((option) => (
                          <option key={option} value={option}>{option}</option>
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
                      </label>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="xl-btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        {c.submitting} <Send size={16} />
                      </>
                    ) : (
                      <>
                        {c.submit} <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}