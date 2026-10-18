import { useLanguage } from "../context/LanguageContext";
import { Target, Compass, Wrench, BarChart3, ArrowRight } from "lucide-react";

const methodologyData = {
  en: {
    title: "Our Delivery Methodology",
    subtitle: "Structured approach to ensure consistent, measurable outcomes",
    phases: [
      {
        icon: Target,
        name: "Discovery & Assessment",
        duration: "2-4 weeks",
        activities: [
          "Stakeholder interviews and requirements gathering",
          "Current state technology assessment",
          "Gap analysis and risk identification",
          "Business case development with ROI projections"
        ],
        deliverables: "Assessment Report, Roadmap, Business Case"
      },
      {
        icon: Compass,
        name: "Strategy & Design",
        duration: "3-6 weeks",
        activities: [
          "Solution architecture and technology selection",
          "Implementation roadmap with milestones",
          "Governance framework design",
          "Resource planning and team assembly"
        ],
        deliverables: "Solution Design Document, Project Plan, Governance Framework"
      },
      {
        icon: Wrench,
        name: "Implementation & Integration",
        duration: "8-16 weeks",
        activities: [
          "Agile sprints with bi-weekly demos",
          "System integration and testing",
          "Data migration and validation",
          "User training and change management"
        ],
        deliverables: "Working Solution, Test Results, Training Materials"
      },
      {
        icon: BarChart3,
        name: "Optimization & Support",
        duration: "Ongoing",
        activities: [
          "Performance monitoring and tuning",
          "Continuous improvement recommendations",
          "24/7 support and incident management",
          "Quarterly business reviews"
        ],
        deliverables: "Performance Reports, Optimization Recommendations, SLA Reports"
      }
    ]
  },
  es: {
    title: "Nuestra Metodología de Entrega",
    subtitle: "Enfoque estructurado para garantizar resultados consistentes y medibles",
    phases: [
      {
        icon: Target,
        name: "Descubrimiento y Evaluación",
        duration: "2-4 semanas",
        activities: [
          "Entrevistas con partes interesadas y recolección de requisitos",
          "Evaluación del estado actual de tecnología",
          "Análisis de brechas e identificación de riesgos",
          "Desarrollo del caso de negocio con proyecciones de ROI"
        ],
        deliverables: "Informe de Evaluación, Hoja de Ruta, Caso de Negocio"
      },
      {
        icon: Compass,
        name: "Estrategia y Diseño",
        duration: "3-6 semanas",
        activities: [
          "Arquitectura de solución y selección tecnológica",
          "Hoja de ruta de implementación con hitos",
          "Diseño del marco de gobernanza",
          "Planificación de recursos y ensamblaje del equipo"
        ],
        deliverables: "Documento de Diseño de Solución, Plan de Proyecto, Marco de Gobernanza"
      },
      {
        icon: Wrench,
        name: "Implementación e Integración",
        duration: "8-16 semanas",
        activities: [
          "Sprints ágiles con demos bisemanales",
          "Integración y pruebas del sistema",
          "Migración y validación de datos",
          "Capacitación de usuarios y gestión del cambio"
        ],
        deliverables: "Solución Funcional, Resultados de Pruebas, Materiales de Capacitación"
      },
      {
        icon: BarChart3,
        name: "Optimización y Soporte",
        duration: "Permanente",
        activities: [
          "Monitoreo y ajuste de rendimiento",
          "Recomendaciones de mejora continua",
          "Soporte 24/7 y gestión de incidentes",
          "Revisiones de negocio trimestrales"
        ],
        deliverables: "Informes de Rendimiento, Recomendaciones de Optimización, Informes SLA"
      }
    ]
  }
};

export default function MethodologySection() {
  const { lang } = useLanguage();
  const data = methodologyData[lang];

  return (
    <section id="methodology" className="py-20 relative bg-dark/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16" data-reveal>
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">
            {lang === "es" ? "Cómo Trabajamos" : "How We Work"}
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mt-4 mb-6">
            {data.title}
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            {data.subtitle}
          </p>
        </div>

        {/* Phases Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-primary/20" />

          {data.phases.map((phase, i) => {
            const Icon = phase.icon;
            const isLeft = i % 2 === 0;

            return (
              <div
                key={i}
                className={`relative flex flex-col md:flex-row items-start mb-12 ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                data-reveal
              >
                {/* Content Card */}
                <div className={`flex-1 ${isLeft ? "md:pr-12" : "md:pl-12"}`}>
                  <div className="bg-dark-light/50 border border-primary/10 rounded-xl p-6 card-hover ml-12 md:ml-0">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{phase.name}</h3>
                        <span className="text-xs text-primary/70">{phase.duration}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {phase.activities.map((activity, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 flex-shrink-0" />
                          <span className="text-white/60 text-sm">{activity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
                        {lang === "es" ? "Entregables" : "Deliverables"}
                      </span>
                      <p className="text-primary/70 text-sm mt-1">{phase.deliverables}</p>
                    </div>
                  </div>
                </div>

                {/* Center Node */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary border-4 border-dark flex items-center justify-center z-10">
                  <span className="text-dark font-bold text-sm">{i + 1}</span>
                </div>

                {/* Spacer for other side */}
                <div className="hidden md:block flex-1" />
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12" data-reveal>
          <a
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-dark font-bold hover:bg-primary/90 transition-all"
          >
            {lang === "es" ? "Discutir Su Proyecto" : "Discuss Your Project"}
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
