import { useLanguage } from "../context/LanguageContext";
import {
  Shield, Award, FileCheck, Building2, Users, Globe,
  CheckCircle2, ArrowRight
} from "lucide-react";

const certifications = {
  en: [
    {
      icon: Shield,
      title: "ISO 27001:2022",
      subtitle: "Information Security Management",
      description: "Certified for robust information security practices, ensuring client data protection and regulatory compliance.",
      status: "Active",
      scope: "All Operations"
    },
    {
      icon: Award,
      title: "ISO 9001:2015",
      subtitle: "Quality Management Systems",
      description: "Demonstrating commitment to quality assurance and continuous improvement in service delivery.",
      status: "Active",
      scope: "All Operations"
    },
    {
      icon: FileCheck,
      title: "SOC 2 Type II",
      subtitle: "Security, Availability, Confidentiality",
      description: "Audited controls for security, availability, processing integrity, confidentiality, and privacy.",
      status: "Compliant",
      scope: "Platform Services"
    },
    {
      icon: Building2,
      title: "GSA Schedule",
      subtitle: "Contract Vehicle",
      description: "Listed on GSA Multiple Award Schedule for streamlined government procurement.",
      status: "Available",
      scope: "IT Services"
    },
    {
      icon: Users,
      title: "SBA 8(a) Certified",
      subtitle: "Small Business Administration",
      description: "Federal contracting advantage for socially and economically disadvantaged businesses.",
      status: "Active",
      scope: "Federal"
    },
    {
      icon: Globe,
      title: "Cloud Partner",
      subtitle: "AWS / Azure / GCP",
      description: "Authorized consulting partner with proven cloud architecture and migration expertise.",
      status: "Gold Tier",
      scope: "Cloud Solutions"
    }
  ],
  es: [
    {
      icon: Shield,
      title: "ISO 27001:2022",
      subtitle: "Gestión de Seguridad de la Información",
      description: "Certificados en prácticas robustas de seguridad de la información, asegurando protección de datos y cumplimiento regulatorio.",
      status: "Activo",
      scope: "Todas las Operaciones"
    },
    {
      icon: Award,
      title: "ISO 9001:2015",
      subtitle: "Sistemas de Gestión de Calidad",
      description: "Demostrando compromiso con aseguramiento de calidad y mejora continua en la entrega de servicios.",
      status: "Activo",
      scope: "Todas las Operaciones"
    },
    {
      icon: FileCheck,
      title: "SOC 2 Tipo II",
      subtitle: "Seguridad, Disponibilidad, Confidencialidad",
      description: "Controles auditados para seguridad, disponibilidad, integridad de procesamiento, confidencialidad y privacidad.",
      status: "Cumple",
      scope: "Servicios de Plataforma"
    },
    {
      icon: Building2,
      title: "Contrato GSA",
      subtitle: "Vehículo de Contratación",
      description: "Listados en el Programa de Adquisiciones Múltiples de GSA para contratación gubernamental ágil.",
      status: "Disponible",
      scope: "Servicios de TI"
    },
    {
      icon: Users,
      title: "Certificación SBA 8(a)",
      subtitle: "Administración de Pequeños Negocios",
      description: "Ventaja en contratación federal para empresas social y económicamente desfavorecidas.",
      status: "Activo",
      scope: "Federal"
    },
    {
      icon: Globe,
      title: "Socio en la Nube",
      subtitle: "AWS / Azure / GCP",
      description: "Socio consultor autorizado con experiencia demostrada en arquitectura y migración a la nube.",
      status: "Nivel Oro",
      scope: "Soluciones en la Nube"
    }
  ]
};

const contractVehicles = {
  en: [
    { name: "GSA MAS", code: "GS-35F-0119T", description: "Multiple Award Schedule - IT Professional Services" },
    { name: "OASIS+", ID: "OASIS+ SB", description: "One Acquisition Solution for Integrated Services - Small Business" },
    { name: "8(a) STARS III", code: "47QRA19D006Z", description: "Streamlined Technology Acquisition Resource for Services" },
    { name: "SEWP V", code: "NNG15SD25B", description: "Solutions for Enterprise-Wide Products" },
    { name: "Alliant 2 SB", code: "36CG1022D90521", description: "Governmentwide Acquisition Contract for IT Solutions" },
    { name: "Direct Award", code: "FAR 13", description: "Micro-purchase and Simplified Acquisition Procedures" }
  ],
  es: [
    { name: "GSA MAS", code: "GS-35F-0119T", description: "Programa de Adquisiciones Múltiples - Servicios Profesionales de TI" },
    { name: "OASIS+", ID: "OASIS+ SB", description: "Una Solución Integrada de Adquisición - Pequeños Negocios" },
    { name: "8(a) STARS III", code: "47QRA19D006Z", description: "Adquisición Simplificada de Tecnología para Servicios" },
    { name: "SEWP V", code: "NNG15SD25B", description: "Soluciones para Productos de Empresa" },
    { name: "Alliant 2 SB", code: "36CG1022D90521", description: "Contrato de Adquisición de TI del Gobierno" },
    { name: "Direct Award", code: "FAR 13", description: "Micro-compra y Procedimientos de Adquisición Simplificados" }
  ]
};

export default function CertificationsSection() {
  const { lang } = useLanguage();

  return (
    <section id="certifications" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16" data-reveal>
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">
            {lang === "es" ? "Vehículos de Compra" : "Procurement Vehicles"}
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mt-4 mb-6">
            {lang === "es"
              ? "Certificaciones y Contratos"
              : "Certifications & Contracts"}
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            {lang === "es"
              ? "Múltiples vehículos de compra para facilitar la contratación pública y privada."
              : "Multiple procurement vehicles to streamline public and private sector engagement."}
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20" data-reveal>
          {certifications[lang].map((cert, i) => {
            const Icon = cert.icon;
            return (
              <div
                key={i}
                className="bg-dark-light/50 border border-primary/10 rounded-xl p-6 card-hover group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-all">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{cert.title}</h3>
                    <p className="text-primary/70 text-sm">{cert.subtitle}</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm mb-4">{cert.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                    {cert.status}
                  </span>
                  <span className="text-xs text-white/40">{cert.scope}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contract Vehicles */}
        <div data-reveal>
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            {lang === "es" ? "Vehículos de Contratación" : "Contract Vehicles"}
          </h3>
          <div className="bg-dark-light/30 border border-primary/10 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contractVehicles[lang].map((vehicle, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 bg-dark/50 rounded-xl border border-white/5 hover:border-primary/20 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">{vehicle.name}</span>
                      <span className="text-xs text-primary/60">{vehicle.code}</span>
                    </div>
                    <p className="text-white/50 text-xs mt-1">{vehicle.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12" data-reveal>
          <a
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-dark font-bold hover:bg-primary/90 transition-all"
          >
            {lang === "es" ? "Solicitar Información de Contratos" : "Request Contract Information"}
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
