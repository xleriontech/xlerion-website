import { useLanguage } from "../context/LanguageContext";
import { ExternalLink } from "lucide-react";

export default function CaseStudyCard({ caseStudy }) {
  const { lang } = useLanguage();
  const t = caseStudy[lang] || caseStudy.en;

  return (
    <div className="bg-dark-light/50 border border-primary/10 rounded-xl overflow-hidden card-hover group">
      <div className="p-6">
        {/* Client & Industry */}
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            {t.industry}
          </span>
          <span className="text-xs text-white/40">
            {t.client}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
          {t.title}
        </h3>

        {/* Problem → Approach → Result */}
        <div className="space-y-4 mb-6">
          {/* Problem */}
          <div className="border-l-2 border-red-500/50 pl-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-400/70">
              {lang === "es" ? "Problema" : "Problem"}
            </span>
            <p className="text-white/60 text-sm mt-1">{t.problem}</p>
          </div>

          {/* Approach */}
          <div className="border-l-2 border-yellow-500/50 pl-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-yellow-400/70">
              {lang === "es" ? "Enfoque" : "Approach"}
            </span>
            <p className="text-white/60 text-sm mt-1">{t.approach}</p>
          </div>

          {/* Result */}
          <div className="border-l-2 border-green-500/50 pl-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-green-400/70">
              {lang === "es" ? "Resultado" : "Result"}
            </span>
            <p className="text-white/60 text-sm mt-1">{t.result}</p>
          </div>
        </div>

        {/* Metrics */}
        {t.metrics && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {t.metrics.map((metric, i) => (
              <div key={i} className="text-center p-2 bg-dark/50 rounded-lg">
                <div className="text-primary font-bold text-lg">{metric.value}</div>
                <div className="text-white/40 text-xs">{metric.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {t.tags && (
          <div className="flex flex-wrap gap-2">
            {t.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 text-xs rounded bg-white/5 text-white/50">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
