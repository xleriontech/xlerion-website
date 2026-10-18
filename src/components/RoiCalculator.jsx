import React, { useState } from 'react';
import { ArrowRight, Calculator, Clock, DollarSign, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SLIDERS = [
  { key: 'assets', min: 5, max: 200, step: 5 },
  { key: 'cost', min: 2000, max: 80000, step: 2000 },
  { key: 'incidents', min: 2, max: 40, step: 1 },
  { key: 'team', min: 3, max: 80, step: 1 },
];

const COPY = {
  es: {
    title: 'Calculadora de ROI paramétrica',
    subtitle: 'Modelado de impacto para operaciones industriales críticas',
    sliders: {
      assets: { label: 'Activos críticos sensorizados', unit: 'activos', marks: ['5 activos', '100 activos', '200 activos'] },
      cost: { label: 'Coste promedio de hora de parada', unit: 'USD/h', marks: ['$2,000 USD/h', '$40,000 USD/h', '$80,000 USD/h'] },
      incidents: { label: 'Horas de incidentes / retrasos al mes', unit: 'h / mes', marks: ['2 h', '20 h', '40 h'] },
      team: { label: 'Tamaño del equipo técnico / mantenimiento', unit: 'personas', marks: ['3 personas', '40 personas', '80 personas'] },
    },
    outputTitle: 'Ahorro estimado proyectado',
    outputTag: 'DICTAMEN // ROI-MODEL V4',
    monthly: 'Ahorro mensual estimado',
    annual: 'Ahorro anual estimado',
    engHours: 'Horas de ingeniería ahorradas',
    engHoursUnit: 'h / mes',
    payback: 'Amortización PoC',
    paybackUnit: 'meses',
    usd: 'USD',
    apply: 'Aplicar estos parámetros a mi solicitud de PoC',
    basisTitle: 'Supuestos del modelo',
    basis1: 'Reducción de horas de parada: −55%',
    basis2: 'Ahorro de ingeniería: 28 h/persona/mes a $65/h',
    basis3: 'Amortización acotada entre 1.8 y 4.5 meses',
    footnote: 'Basado en métricas de casos reales FOVIS, AONC y SmartFactory',
    sector: 'Operación industrial crítica',
    challengePrefix: 'Paradas imprevistas y latencia de análisis',
    hoursShort: 'h/mes',
    peopleShort: 'personas',
  },
  en: {
    title: 'Parametric ROI Calculator',
    subtitle: 'Impact modeling for critical industrial operations',
    sliders: {
      assets: { label: 'Sensorized critical assets', unit: 'assets', marks: ['5 assets', '100 assets', '200 assets'] },
      cost: { label: 'Average downtime cost per hour', unit: 'USD/h', marks: ['$2,000 USD/h', '$40,000 USD/h', '$80,000 USD/h'] },
      incidents: { label: 'Incident / delay hours per month', unit: 'h / month', marks: ['2 h', '20 h', '40 h'] },
      team: { label: 'Technical / maintenance team size', unit: 'people', marks: ['3 people', '40 people', '80 people'] },
    },
    outputTitle: 'Projected estimated savings',
    outputTag: 'VERDICT // ROI-MODEL V4',
    monthly: 'Estimated monthly savings',
    annual: 'Estimated annual savings',
    engHours: 'Engineering hours saved',
    engHoursUnit: 'h / month',
    payback: 'PoC payback',
    paybackUnit: 'months',
    usd: 'USD',
    apply: 'Apply these parameters to my PoC request',
    basisTitle: 'Model assumptions',
    basis1: 'Downtime hour reduction: −55%',
    basis2: 'Engineering savings: 28 h/person/month at $65/h',
    basis3: 'Payback bounded between 1.8 and 4.5 months',
    footnote: 'Based on real case metrics from FOVIS, AONC and SmartFactory',
    sector: 'Critical industrial operation',
    challengePrefix: 'Unplanned downtime and analysis latency',
    hoursShort: 'h/mo',
    peopleShort: 'people',
  },
};

export default function RoiCalculator({ onApply }) {
  const { lang } = useLanguage();
  const c = COPY[lang] || COPY.es;

  const [values, setValues] = useState({ assets: 35, cost: 18000, incidents: 14, team: 18 });

  const setValue = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));

  // Model: -55% downtime hours + 28 h/engineer/month at $65/h
  const downtimeReductionHours = values.incidents * 0.55;
  const monthlyDowntimeSavings = downtimeReductionHours * values.cost;
  const engineeringHoursSaved = values.team * 28;
  const monthlyEngineeringSavings = engineeringHoursSaved * 65;
  const totalMonthlySavings = monthlyDowntimeSavings + monthlyEngineeringSavings;
  const totalAnnualSavings = totalMonthlySavings * 12;
  const paybackMonths = Math.max(1.8, Math.min(4.5, (45000 / totalMonthlySavings) * 1.4)).toFixed(1);
  const totalHoursSaved = Math.round(downtimeReductionHours + engineeringHoursSaved);

  const handleApply = () => {
    if (!onApply) return;
    onApply({
      sector: c.sector,
      nodes: values.assets,
      challenge: `${c.challengePrefix} · ${values.incidents} ${c.hoursShort} · $${values.cost.toLocaleString()} ${c.sliders.cost.unit} · ${values.team} ${c.peopleShort}`,
    });
  };

  return (
    <div className="bg-[#050508] border border-[#00e9fa]/20 rounded-lg p-6 md:p-8" data-reveal>
      {/* Header */}
      <div className="flex items-start gap-4 pb-5 border-b border-white/[0.08]">
        <div className="w-10 h-10 rounded-lg bg-[#00e9fa]/10 border border-[#00e9fa]/20 flex items-center justify-center text-[#00e9fa] shrink-0">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-white">{c.title}</h3>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-gray-500 mt-1">{c.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Controls */}
        <div className="lg:col-span-7 space-y-6">
          {SLIDERS.map((slider) => {
            const meta = c.sliders[slider.key];
            const value = values[slider.key];
            return (
              <div key={slider.key}>
                <div className="flex justify-between items-center gap-4 mb-2">
                  <span className="text-xs font-mono uppercase tracking-[0.15em] text-gray-400">{meta.label}</span>
                  <span className="font-mono text-sm font-bold text-[#00e9fa] whitespace-nowrap">
                    {slider.key === 'cost' ? '$' : ''}{value.toLocaleString()} {meta.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={value}
                  onChange={(e) => setValue(slider.key, Number(e.target.value))}
                  className="w-full h-2 bg-white/[0.06] rounded-lg appearance-none cursor-pointer accent-[#00e9fa]"
                  aria-label={meta.label}
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
                  {meta.marks.map((mark) => (
                    <span key={mark}>{mark}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Outputs */}
        <div className="lg:col-span-5 bg-black/60 border border-[#00e9fa]/20 rounded-lg p-5 flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[#00e9fa]">
                <Sparkles className="w-3.5 h-3.5" /> {c.outputTitle}
              </span>
              <span className="text-[10px] font-mono text-gray-500">{c.outputTag}</span>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-[#0a0a12]/80 border border-white/[0.08]">
              <span className="text-[11px] font-mono text-gray-400 block">{c.monthly}</span>
              <span className="font-mono text-2xl md:text-3xl font-extrabold text-[#00e9fa]">
                ${Math.round(totalMonthlySavings).toLocaleString()}
              </span>
              <span className="text-[11px] font-mono text-gray-500"> {c.usd}</span>
              <span className="text-[10px] font-mono text-gray-500 block mt-1">
                {c.annual}: ${Math.round(totalAnnualSavings).toLocaleString()} {c.usd}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="p-3 rounded-lg bg-[#0a0a12]/80 border border-white/[0.08]">
                <span className="flex items-center gap-1 text-[10px] font-mono text-gray-400">
                  <Clock className="w-3 h-3 text-[#00e9fa]" /> {c.engHours}
                </span>
                <span className="block mt-1 font-mono text-sm font-bold text-white">
                  {totalHoursSaved} {c.engHoursUnit}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#0a0a12]/80 border border-white/[0.08]">
                <span className="flex items-center gap-1 text-[10px] font-mono text-gray-400">
                  <DollarSign className="w-3 h-3 text-[#00e9fa]" /> {c.payback}
                </span>
                <span className="block mt-1 font-mono text-sm font-bold text-amber-400">
                  ~{paybackMonths} {c.paybackUnit}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.08]">
              <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-2">{c.basisTitle}</span>
              <ul className="space-y-1">
                {[c.basis1, c.basis2, c.basis3].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[11px] font-mono text-gray-400">
                    <span className="w-1 h-1 rounded-full bg-[#00e9fa] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {onApply && (
            <div className="pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={handleApply}
                className="w-full xl-btn-primary group !text-xs"
              >
                <span>{c.apply}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-gray-500 text-center mt-3">
                <ShieldCheck className="w-3 h-3 text-[#00e9fa]" />
                {c.footnote}
              </p>
            </div>
          )}

          {!onApply && (
            <p className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-gray-500 text-center pt-4 border-t border-white/[0.08]">
              <ShieldCheck className="w-3 h-3 text-[#00e9fa]" />
              {c.footnote}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
