import { useLanguage } from "../context/LanguageContext";
import { ArrowRight, ExternalLink, Building2, Globe, Server, Shield, BarChart3, Users } from "lucide-react";

const caseStudies = {
  en: [
    {
      icon: Building2,
      title: "Digital Identity System for National Registry",
      client: "Government Agency",
      industry: "Government",
      problem: "Legacy identity verification system processing 2M+ daily requests with 40% failure rate, causing citizen frustration and operational bottlenecks.",
      approach: "Designed cloud-native identity platform using microservices architecture with real-time biometric validation. Implemented zero-trust security model and auto-scaling infrastructure.",
      result: "Reduced verification time from 45 seconds to 3 seconds. Achieved 99.97% uptime. Processing capacity increased to 10M+ daily requests.",
      metrics: [
        { value: "99.97%", label: "Uptime" },
        { value: "15x", label: "Faster Processing" },
        { value: "5x", label: "Capacity Increase" }
      ],
      tags: ["Cloud Architecture", "Microservices", "Security", "Government"]
    },
    {
      icon: Globe,
      title: "AI-Powered Customer Service Transformation",
      client: "Fortune 500 Retailer",
      industry: "Retail",
      problem: "Customer service center handling 50,000+ daily calls with 70% first-call resolution rate and high operational costs.",
      approach: "Deployed conversational AI platform with natural language understanding, integrated with existing CRM. Implemented smart routing and agent-assist capabilities.",
      result: "First-call resolution improved to 94%. Operational costs reduced by 35%. Customer satisfaction score increased from 3.2 to 4.6/5.",
      metrics: [
        { value: "94%", label: "Resolution Rate" },
        { value: "35%", label: "Cost Reduction" },
        { value: "4.6/5", label: "CSAT Score" }
      ],
      tags: ["AI/ML", "Conversational AI", "CRM Integration", "Automation"]
    },
    {
      icon: Server,
      title: "Multi-Cloud Migration for Financial Services",
      client: "Regional Bank",
      industry: "Financial Services",
      problem: "On-premise data center reaching capacity limits with high infrastructure costs and limited disaster recovery capabilities.",
      approach: "Developed multi-cloud strategy across AWS and Azure. Implemented infrastructure-as-code, automated deployment pipelines, and comprehensive monitoring.",
      result: "Infrastructure costs reduced by 42%. Deployment frequency increased from monthly to multiple times daily. Achieved RPO < 1 hour and RTO < 15 minutes.",
      metrics: [
        { value: "42%", label: "Cost Savings" },
        { value: "30x", label: "Faster Deployments" },
        { value: "99.99%", label: "Availability" }
      ],
      tags: ["Multi-Cloud", "IaC", "DevOps", "Financial Services"]
    },
    {
      icon: Shield,
      title: "Cybersecurity Operations Center Modernization",
      client: "Federal Agency",
      industry: "Government",
      problem: "SOC team overwhelmed with 10,000+ daily alerts, 80% false positives, and mean time to detect of 72 hours.",
      approach: "Implemented AI-driven SIEM with automated threat intelligence integration. Developed custom detection rules and automated response playbooks.",
      result: "False positives reduced to 15%. Mean time to detect dropped to 4 hours. Incident response time improved by 85%.",
      metrics: [
        { value: "85%", label: "Faster Detection" },
        { value: "85%", label: "Fewer False Positives" },
        { value: "24/7", label: "Monitoring Coverage" }
      ],
      tags: ["Cybersecurity", "AI/ML", "SIEM", "Federal"]
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics Platform for Healthcare",
      client: "Healthcare Network",
      industry: "Healthcare",
      problem: "Fragmented data across 15 hospitals with no real-time visibility into patient outcomes, resource utilization, or operational metrics.",
      approach: "Built unified data lake with real-time streaming pipeline. Developed custom dashboards for clinical, operational, and executive stakeholders.",
      result: "Real-time visibility across all facilities. Patient readmission rates reduced by 28%. Resource allocation optimized saving $12M annually.",
      metrics: [
        { value: "28%", label: "Lower Readmissions" },
        { value: "$12M", label: "Annual Savings" },
        { value: "15", label: "Facilities Connected" }
      ],
      tags: ["Data Analytics", "Real-Time", "Healthcare", "HIPAA"]
    },
    {
      icon: Users,
      title: "Enterprise Collaboration Platform Migration",
      client: "Government Ministry",
      industry: "Government",
      problem: "Outdated collaboration tools with security vulnerabilities, poor user experience, and limited mobile access for 50,000+ employees.",
      approach: "Led enterprise migration to Microsoft 365 with custom security policies, automated provisioning, and comprehensive training program.",
      result: "100% successful migration with zero security incidents. User satisfaction increased by 60%. IT support tickets reduced by 45%.",
      metrics: [
        { value: "50K+", label: "Users Migrated" },
        { value: "0", label: "Security Incidents" },
        { value: "45%", label: "Fewer Support Tickets" }
      ],
      tags: ["Microsoft 365", "Migration", "Change Management", "Government"]
    }
  ],
  es: [
    {
      icon: Building2,
      title: "Sistema de Identidad Digital para Registro Nacional",
      client: "Agencia Gubernamental",
      industry: "Gobierno",
      problem: "Sistema de verificación de identidad heredado procesando 2M+ solicitudes diarias con 45% tasa de fallo, causando frustración ciudadana y cuellos de botella operativos.",
      approach: "Diseñamos plataforma de identidad nativa en la nube usando arquitectura de microservicios con validación biométrica en tiempo real. Implementamos modelo de seguridad zero-trust e infraestructura auto-escalable.",
      result: "Tiempo de verificación reducido de 45 segundos a 3 segundos. Alcanzamos 99.97% de disponibilidad. Capacidad de procesamiento aumentada a 10M+ solicitudes diarias.",
      metrics: [
        { value: "99.97%", label: "Disponibilidad" },
        { value: "15x", label: "Procesamiento Más Rápido" },
        { value: "5x", label: "Aumento de Capacidad" }
      ],
      tags: ["Arquitectura Cloud", "Microservicios", "Seguridad", "Gobierno"]
    },
    {
      icon: Globe,
      title: "Transformación de Atención al Cliente con AI",
      client: "Minorista Fortune 500",
      industry: "Comercio",
      problem: "Centro de atención manejando 50,000+ llamadas diarias con 70% resolución en primera llamada y altos costos operativos.",
      approach: "Implementamos plataforma de AI conversacional con comprensión de lenguaje natural, integrada con CRM existente. Desarrollamos routing inteligente y capacidades de asistencia al agente.",
      result: "Resolución en primera llamada mejorada a 94%. Costos operativos reducidos en 35%. Puntuación de satisfacción del cliente aumentó de 3.2 a 4.6/5.",
      metrics: [
        { value: "94%", label: "Tasa de Resolución" },
        { value: "35%", label: "Reducción de Costos" },
        { value: "4.6/5", label: "Puntuación CSAT" }
      ],
      tags: ["AI/ML", "AI Conversacional", "Integración CRM", "Automatización"]
    },
    {
      icon: Server,
      title: "Migración Multi-Cloud para Servicios Financieros",
      client: "Banco Regional",
      industry: "Servicios Financieros",
      problem: "Data center on-premise alcanzando límites de capacidad con altos costos de infraestructura y capacidades limitadas de recuperación ante desastres.",
      approach: "Desarrollamos estrategia multi-cloud en AWS e Azure. Implementamos infraestructura como código, pipelines de despliegue automatizados y monitoreo integral.",
      result: "Costos de infraestructura reducidos en 42%. Frecuencia de despliegues aumentada de mensual a múltiples veces al día. Alcanzamos RPO < 1 hora y RTO < 15 minutos.",
      metrics: [
        { value: "42%", label: "Ahorro de Costos" },
        { value: "30x", label: "Despliegues Más Rápidos" },
        { value: "99.99%", label: "Disponibilidad" }
      ],
      tags: ["Multi-Cloud", "IaC", "DevOps", "Servicios Financieros"]
    },
    {
      icon: Shield,
      title: "Modernización de Centro de Operaciones de Ciberseguridad",
      client: "Agencia Federal",
      industry: "Gobierno",
      problem: "Equipo SOC abrumado con 10,000+ alertas diarias, 80% falsos positivos y tiempo medio de detección de 72 horas.",
      approach: "Implementamos SIEM con AI y integración automatizada de inteligencia de amenazas. Desarrollamos reglas de detección personalizadas y playbooks de respuesta automatizada.",
      result: "Falsos positivos reducidos a 15%. Tiempo medio de detección bajó a 4 horas. Tiempo de respuesta a incidentes mejorado en 85%.",
      metrics: [
        { value: "85%", label: "Detección Más Rápida" },
        { value: "85%", label: "Menos Falsos Positivos" },
        { value: "24/7", label: "Cobertura de Monitoreo" }
      ],
      tags: ["Ciberseguridad", "AI/ML", "SIEM", "Federal"]
    },
    {
      icon: BarChart3,
      title: "Plataforma de Analytics en Tiempo Real para Salud",
      client: "Red de Salud",
      industry: "Salud",
      problem: "Datos fragmentados en 15 hospitales sin visibilidad en tiempo real sobre resultados de pacientes, utilización de recursos o métricas operativas.",
      approach: "Construimos lago de datos unificado con pipeline de streaming en tiempo real. Desarrollamos dashboards personalizados para partes interesadas clínicas, operativas y ejecutivas.",
      result: "Visibilidad en tiempo real en todas las instalaciones. Tasas de reingreso de pacientes reducidas en 28%. Asignación de recursos optimizada ahorrando $12M anuales.",
      metrics: [
        { value: "28%", label: "Menos Reingresos" },
        { value: "$12M", label: "Ahorro Anual" },
        { value: "15", label: "Instalaciones Conectadas" }
      ],
      tags: ["Analytics de Datos", "Tiempo Real", "Salud", "HIPAA"]
    },
    {
      icon: Users,
      title: "Migración de Plataforma de Colaboración Empresarial",
      client: "Ministerio Gubernamental",
      industry: "Gobierno",
      problem: "Herramientas de colaboración obsoletas con vulnerabilidades de seguridad, mala experiencia de usuario y acceso móvil limitado para 50,000+ empleados.",
      approach: "Lideramos migración empresarial a Microsoft 365 con políticas de seguridad personalizadas, aprovisionamiento automatizado y programa de capacitación integral.",
      result: "100% migración exitosa con cero incidentes de seguridad. Satisfacción del usuario aumentó en 60%. Tickets de soporte de TI reducidos en 45%.",
      metrics: [
        { value: "50K+", label: "Usuarios Migrados" },
        { value: "0", label: "Incidentes de Seguridad" },
        { value: "45%", label: "Menos Tickets de Soporte" }
      ],
      tags: ["Microsoft 365", "Migración", "Gestión del Cambio", "Gobierno"]
    }
  ]
};

export default function CaseStudiesSection() {
  const { lang } = useLanguage();
  const cases = caseStudies[lang];

  return (
    <section id="case-studies" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16" data-reveal>
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">
            {lang === "es" ? "Casos de Éxito" : "Success Stories"}
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mt-4 mb-6">
            {lang === "es" ? "Nuestros Resultados Hablan" : "Our Results Speak"}
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            {lang === "es"
              ? "Proyectos reales con resultados medibles que transforman negocios."
              : "Real projects with measurable results that transform businesses."}
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {cases.map((caseStudy, i) => {
            const Icon = caseStudy.icon;
            return (
              <div
                key={i}
                className="bg-dark-light/50 border border-primary/10 rounded-2xl overflow-hidden card-hover group"
                data-reveal
              >
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-all">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-2 inline-block">
                        {caseStudy.industry}
                      </span>
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                        {caseStudy.title}
                      </h3>
                      <p className="text-white/40 text-sm">{caseStudy.client}</p>
                    </div>
                  </div>

                  {/* Problem → Approach → Result */}
                  <div className="space-y-4 mb-6">
                    <div className="border-l-2 border-red-500/50 pl-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-red-400/70">
                        {lang === "es" ? "Problema" : "Problem"}
                      </span>
                      <p className="text-white/60 text-sm mt-1">{caseStudy.problem}</p>
                    </div>

                    <div className="border-l-2 border-yellow-500/50 pl-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-yellow-400/70">
                        {lang === "es" ? "Enfoque" : "Approach"}
                      </span>
                      <p className="text-white/60 text-sm mt-1">{caseStudy.approach}</p>
                    </div>

                    <div className="border-l-2 border-green-500/50 pl-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-green-400/70">
                        {lang === "es" ? "Resultado" : "Result"}
                      </span>
                      <p className="text-white/60 text-sm mt-1">{caseStudy.result}</p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {caseStudy.metrics.map((metric, j) => (
                      <div key={j} className="text-center p-3 bg-dark/50 rounded-lg border border-white/5">
                        <div className="text-primary font-bold text-lg">{metric.value}</div>
                        <div className="text-white/40 text-xs">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {caseStudy.tags.map((tag, j) => (
                      <span key={j} className="px-3 py-1 text-xs rounded-full bg-white/5 text-white/50 border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16" data-reveal>
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
