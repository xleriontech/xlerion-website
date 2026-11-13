import React from 'react';
import {
  Award,
  GraduationCap,
  Shield,
  MapPin,
  Briefcase,
  ArrowUpRight,
  Coins,
  Users,
  Rocket,
  User,
  IdCard,
  Linkedin,
  CalendarDays,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';
import { FOUNDER_SECTION, FOUNDERS } from '../data/founders';

/**
 * Iconos de la sección. Todos del set de lucide-react; el color lo aporta
 * la paleta del sitio (#00e9fa + neutros), no tonos sueltos.
 */
const ICONS = {
  award: Award,
  graduation: GraduationCap,
  shield: Shield,
  coins: Coins,
  users: Users,
  rocket: Rocket,
  user: User,
  card: IdCard,
  linkedin: Linkedin,
  calendar: CalendarDays,
};

export default function FounderLeadershipSection({ onOpenPoC }) {
  const { lang } = useLanguage();
  const locale = lang === 'en' ? 'en' : 'es';
  const c = FOUNDER_SECTION[locale];

  return (
    <section
      id="liderazgo"
      className="relative py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      <div data-reveal>
        <SectionHeader title={c.title} subtitle={c.subtitle} />
      </div>

      <p data-reveal className="stagger-1 max-w-3xl -mt-6 mb-12 text-sm md:text-base text-gray-400 leading-relaxed font-sans">
        {c.intro}
      </p>

      {/* Los dos fundadores, mismo componente y misma paleta */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {FOUNDERS.map((founder, i) => (
          <FounderCard
            key={founder.id}
            founder={founder}
            locale={locale}
            revealDelay={i}
          />
        ))}
      </div>

      {/* Acción de la sección */}
      <div data-reveal className="stagger-3 mt-10 md:mt-12 flex flex-wrap items-center gap-5">
        <button type="button" onClick={onOpenPoC} className="xl-btn-primary">
          <Briefcase size={16} />
          {c.cta}
          <ArrowUpRight size={16} />
        </button>
        <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-gray-500">
          {'// '}
          {c.ctaHint}
        </span>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function FounderCard({ founder, locale, revealDelay }) {
  return (
    <article
      data-reveal
      className={`stagger-${revealDelay + 2} relative bg-[#0a0a12]/80 border border-[#00e9fa]/20 rounded-lg p-6 md:p-8 card-hover flex flex-col`}
    >
      {/* Estado del fundador */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
          {'// '}
          {founder.index}
        </span>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00e9fa]/25 bg-[#00e9fa]/[0.06] font-mono text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-[#00e9fa]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00e9fa] shadow-[0_0_8px_#00e9fa] animate-pulse" />
          {founder.status[locale]}
        </span>
      </div>

      {/* Identidad */}
      <div className="flex items-start gap-4 sm:gap-5">
        <div className="relative w-20 h-20 sm:w-28 sm:h-28 shrink-0 rounded-lg overflow-hidden border border-[#00e9fa]/40 shadow-[0_0_30px_rgba(0,233,250,0.18)] glow-on-hover">
          <img
            src={founder.photo}
            alt={founder.photoAlt[locale]}
            loading="lazy"
            className="w-full h-full object-cover"
            style={{
              transform: `scale(${founder.photoZoom || 1})`,
              transformOrigin: founder.photoOrigin || 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12]/80 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="min-w-0">
          <h3 className="text-lg md:text-2xl font-bold text-white leading-tight">
            {founder.name}
          </h3>
          <p className="mt-1.5 font-semibold text-[#00e9fa] text-sm md:text-base leading-snug">
            {founder.role[locale]}
          </p>
          <p className="mt-2.5 inline-flex items-start gap-2 text-xs font-mono text-gray-400 leading-snug">
            <MapPin size={13} className="text-[#00e9fa] shrink-0 mt-0.5" />
            {founder.location[locale]}
          </p>
          <p className="mt-1.5 inline-flex items-start gap-2 text-[11px] font-mono text-gray-500 leading-snug">
            <Globe size={12} className="text-[#00e9fa]/70 shrink-0 mt-0.5" />
            {founder.availability[locale]}
          </p>
        </div>
      </div>

      {/* Enfoque */}
      <p className="mt-6 text-xs md:text-sm text-gray-400 leading-relaxed">
        {founder.tagline[locale]}
      </p>

      {/* Items */}
      <div className="mt-6 pt-6 border-t border-white/[0.08]">
        <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00e9fa] mb-4">
          {founder.focusLabel[locale]}
        </h4>
        <ul className="space-y-3">
          {founder.focus.map((item, index) => {
            const Icon = ICONS[item.icon] || Shield;
            return (
              <li
                key={item.title}
                className="flex items-start gap-3 p-4 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:border-[#00e9fa]/30 transition-colors duration-300"
              >
                <span className="w-8 h-8 rounded-md bg-[#0b1018] border border-[#00e9fa]/30 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-[#00e9fa]" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-baseline gap-2">
                    <span className="font-mono text-[10px] text-[#00e9fa]/70">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-semibold text-white leading-snug">
                      {item.titleEn && locale === 'en' ? item.titleEn : item.title}
                    </span>
                  </span>
                  <span className="block mt-1 text-xs text-gray-400 leading-relaxed">
                    {item.desc[locale]}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Enlaces */}
      <div className="mt-auto pt-6 flex flex-wrap gap-2.5">
        {founder.links.map((link) => {
          const Icon = ICONS[link.icon] || ExternalLink;
          const cls =
            'inline-flex items-center gap-2 px-3.5 py-2 rounded-md border border-[#00e9fa]/25 bg-[#00e9fa]/[0.05] text-[#00e9fa] font-mono text-[10px] uppercase tracking-[0.15em] transition-all duration-300 hover:bg-[#00e9fa]/15 hover:border-[#00e9fa]/50';
          const inner = (
            <>
              <Icon size={13} />
              {link.label[locale]}
            </>
          );

          // 'static' -> documento del servidor (tarjeta digital): recarga real.
          // 'spa'    -> ruta de la SPA: navegacion client-side.
          if (link.kind === 'spa') {
            return (
              <Link key={link.href + link.label.es} to={link.href} className={cls}>
                {inner}
              </Link>
            );
          }

          return (
            <a
              key={link.href + link.label.es}
              href={link.href}
              {...(link.kind === 'static'
                ? {}
                : { target: '_blank', rel: 'noopener noreferrer' })}
              className={cls}
            >
              {inner}
            </a>
          );
        })}
      </div>
    </article>
  );
}
