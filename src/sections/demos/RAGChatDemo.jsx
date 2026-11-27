import React, { useEffect, useRef, useState } from 'react';
import { Bot, FileText, User } from 'lucide-react';
import DemoShell from './DemoShell';

/**
 * RAGChatDemo — mock animado de un asistente corporativo RAG.
 * Mensajes predefinidos que aparecen en secuencia (pregunta → tipeo →
 * respuesta con citas de fuente). Se congela cuando `active` es false.
 */

const SCRIPTS = {
  es: [
    { kind: 'user', text: '¿Cuál es el torque máximo del motor M-204 en el mantenimiento preventivo?' },
    { kind: 'typing' },
    {
      kind: 'assistant',
      text: 'El torque máximo de apriete es 240 Nm, con intervalo de servicio cada 2.000 horas de operación.',
      sources: ['manual-m204.pdf · §4.2'],
    },
    { kind: 'user', text: '¿Qué norma aplica para la inspección térmica anual?' },
    { kind: 'typing' },
    {
      kind: 'assistant',
      text: 'Aplica el artículo 18 de la RETIE para verificación térmica anual en instalaciones industriales.',
      sources: ['RETIE-2022.pdf · art. 18'],
    },
  ],
  en: [
    { kind: 'user', text: 'What is the maximum torque for motor M-204 in preventive maintenance?' },
    { kind: 'typing' },
    {
      kind: 'assistant',
      text: 'The maximum tightening torque is 240 Nm, with a service interval every 2,000 operating hours.',
      sources: ['manual-m204.pdf · §4.2'],
    },
    { kind: 'user', text: 'Which standard applies to the annual thermal inspection?' },
    { kind: 'typing' },
    {
      kind: 'assistant',
      text: 'Article 18 of the RETIE standard applies for annual thermal verification in industrial facilities.',
      sources: ['RETIE-2022.pdf · art. 18'],
    },
  ],
};

function delayFor(step, script) {
  if (step === 0) return 700;
  const kind = script[step].kind;
  if (kind === 'typing') return 1300;
  return 1600;
}

export default function RAGChatDemo({ active, lang }) {
  const script = SCRIPTS[lang] || SCRIPTS.es;
  const [step, setStep] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    setStep(0);
  }, [lang]);

  useEffect(() => {
    if (!active) return undefined;

    if (step >= script.length) {
      const restart = setTimeout(() => setStep(0), 4000);
      return () => clearTimeout(restart);
    }

    const timer = setTimeout(() => setStep((s) => s + 1), delayFor(step, script));
    return () => clearTimeout(timer);
  }, [active, step, script]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [step]);

  const visible = script.slice(0, step);
  const typing = step < script.length && script[step].kind === 'typing';
  const messageCount = visible.filter((m) => m.kind !== 'typing').length;

  return (
    <DemoShell
      title={lang === 'es' ? 'ASISTENTE_CORPORATIVO // RAG' : 'CORPORATE_ASSISTANT // RAG'}
      right={
        <span className="hidden sm:inline-block text-[#00e9fa]/70 border border-[#00e9fa]/20 rounded px-1.5 py-0.5 bg-[#00e9fa]/5">
          {lang === 'es' ? 'BÚSQUEDA HÍBRIDA · CON FUENTES' : 'HYBRID SEARCH · SOURCED'}
        </span>
      }
      footer={
        <div className="flex items-center justify-between text-gray-500">
          <span className="flex items-center gap-1.5">
            <Bot size={12} className="text-[#00e9fa]" />
            {lang === 'es' ? 'Respuestas ancladas a documentos internos' : 'Answers anchored to internal documents'}
          </span>
          <span className="text-[#00e9fa]">{messageCount} msg</span>
        </div>
      }
    >
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth"
        aria-label={lang === 'es' ? 'Demostración de chat RAG' : 'RAG chat demo'}
      >
        {visible.map((message, i) => {
          if (message.kind === 'typing') return null;
          const isUser = message.kind === 'user';
          return (
            <div key={i} className={`xl-slide-up flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-[12px] leading-relaxed ${
                  isUser
                    ? 'bg-[#00e9fa]/10 border border-[#00e9fa]/30 text-white'
                    : 'bg-white/[0.03] border border-white/[0.08] text-gray-300'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[9px] font-mono uppercase tracking-[0.15em] text-gray-500">
                  {isUser ? <User size={10} /> : <Bot size={10} className="text-[#00e9fa]" />}
                  {isUser ? (lang === 'es' ? 'Operario' : 'Operator') : 'RAG'}
                </div>
                {message.text}
                {message.sources && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {message.sources.map((source) => (
                      <span
                        key={source}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-[#00e9fa]/20 bg-[#00e9fa]/5 text-[9px] font-mono text-[#00e9fa]"
                      >
                        <FileText size={9} />
                        {source}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {typing && (
          <div className="xl-slide-up flex justify-start">
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] px-3 py-2.5">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="xl-typing-dot inline-block h-1.5 w-1.5 rounded-full bg-[#00e9fa]"
                  style={{ animationDelay: `${dot * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </DemoShell>
  );
}
