import { useLanguage } from "../context/LanguageContext";
import { Handshake, ArrowRight, CheckCircle2, Users, FileText, Shield } from "lucide-react";

const teamingData = {
  en: {
    title: "Partner With Us",
    subtitle: "Looking for a reliable technology partner for your next government or enterprise project?",
    benefits: [
      {
        icon: Shield,
        title: "Proven past performance",
        description: "Track record of successful implementations across government agencies and Fortune 500 companies."
      },
      {
        icon: Users,
        title: "Complementary capabilities",
        description: "Deep expertise in AI/ML, cloud architecture, and digital transformation to complement your core offerings."
      },
      {
        icon: FileText,
        title: "Flexible engagement models",
        description: "Teaming agreements, subcontracting, or joint ventures - we adapt to your needs."
      }
    ],
    process: [
      "Initial consultation to understand your requirements",
      "Capability matching and team composition",
      "Teaming agreement and NDA execution",
      "Joint solution development and proposal support",
      "Contract execution and delivery"
    ],
    stats: [
      { value: "95%", label: "Win Rate with Partners" },
      { value: "50+", label: "Successful Teamings" },
      { value: "24h", label: "Response Time" },
      { value: "100%", label: "Client Retention" }
    ]
  },
  es: {
    title: "Asóciese con Nosotros",
    subtitle: "¿Busca un socio tecnológico confiable para su próximo proyecto gubernamental o empresarial?",
    benefits: [
      {
        icon: Shield,
        title: "Desempeño comprobado",
        description: "Historial exitoso de implementaciones en agencias gubernamentales y empresas Fortune 500."
      },
      {
        icon: Users,
        title: "Capacidades complementarias",
        description: "Experiencia profunda en AI/ML, arquitectura cloud y transformación digital para complementar sus ofertas."
      },
      {
        icon: FileText,
        title: "Modelos flexibles",
        description: "Acuerdos de asociación, subcontratación o joint ventures - nos adaptamos a sus necesidades."
      }
    ],
    process: [
      "Consulta inicial para entender sus requisitos",
      "Coincidencia de capacidades y composición del equipo",
      "Ejecución de acuerdo de asociación y NDA",
      "Desarrollo de solución conjunta y soporte de propuesta",
      "Ejecución del contrato y entrega"
    ],
    stats: [
      { value: "95%", label: "Tasa de Éxito con Socios" },
      { value: "50+", label: "Asociaciones Exitosas" },
      { value: "24h", label: "Tiempo de Respuesta" },
      { value: "100%", label: "Retención de Clientes" }
    ]
  }
};

export default function TeamingSection() {
  const { lang } = useLanguage();
  const data = teamingData[lang];

  return (
    <section id="teaming" className="py-20 relative bg-dark/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16" data-reveal>
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">
            {lang === "es" ? "Programa de Socios" : "Partner Program"}
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mt-4 mb-6">
            {data.title}
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            {data.subtitle}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16" data-reveal>
          {data.stats.map((stat, i) => (
            <div key={i} className="bg-dark-light/50 border border-primary/10 rounded-xl p-6 text-center card-hover">
              <div className="text-3xl font-black text-primary mb-2">{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16" data-reveal>
          {data.benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <div key={i} className="bg-dark-light/50 border border-primary/10 rounded-xl p-6 card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-white/60 text-sm">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Process */}
        <div className="bg-dark-light/30 border border-primary/10 rounded-2xl p-8 mb-16" data-reveal>
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            {lang === "es" ? "Nuestro Proceso" : "Our Process"}
          </h3>
          <div className="space-y-4">
            {data.process.map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-sm">{i + 1}</span>
                </div>
                <div className="flex items-center gap-3 flex-1">
                  <CheckCircle2 className="w-5 h-5 text-primary/60 flex-shrink-0" />
                  <span className="text-white/80">{step}</span>
                </div>
                {i < data.process.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-primary/30 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center" data-reveal>
          <a
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-dark font-bold hover:bg-primary/90 transition-all"
          >
            <Handshake className="w-5 h-5" />
            {lang === "es" ? "Iniciar Conversación" : "Start Conversation"}
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
