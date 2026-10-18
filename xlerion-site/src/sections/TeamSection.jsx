import { useLanguage } from "../context/LanguageContext";
import { Linkedin, Mail, MapPin, Award, Briefcase, GraduationCap } from "lucide-react";

const teamData = {
  en: [
    {
      name: "Miguel Rodríguez Martínez",
      role: "CEO & Founder",
      bio: "Visionary technology leader with 15+ years driving digital transformation across government and enterprise sectors. Former tech lead at major consulting firms.",
      location: "Bogotá, Colombia",
      linkedin: "#",
      specialties: ["Digital Transformation", "Enterprise Architecture", "Government IT"],
      experience: "15+ years",
      education: "MSc Computer Science, Universidad de los Andes",
      certifications: ["AWS Solutions Architect", "TOGAF 9.2", "PMP"]
    },
    {
      name: "Engineering Team",
      role: "Core Development",
      bio: "A distributed team of senior engineers specializing in AI/ML, cloud architecture, and full-stack development. Combined 50+ years of enterprise experience.",
      location: "Remote / Colombia",
      linkedin: "#",
      specialties: ["AI/ML", "Cloud Architecture", "Full-Stack Development"],
      experience: "50+ combined years",
      education: "Top universities across Latin America",
      certifications: ["AWS", "Azure", "Google Cloud", "Kubernetes"]
    }
  ],
  es: [
    {
      name: "Miguel Rodríguez Martínez",
      role: "CEO & Fundador",
      bio: "Líder tecnológico visionario con más de 15 años impulsando la transformación digital en sectores gubernamentales y empresariales. Ex-líder técnico en firmas de consultoría importantes.",
      location: "Bogotá, Colombia",
      linkedin: "#",
      specialties: ["Transformación Digital", "Arquitectura Empresarial", "TI Gubernamental"],
      experience: "15+ años",
      education: "MSc Ciencias de la Computación, Universidad de los Andes",
      certifications: ["AWS Solutions Architect", "TOGAF 9.2", "PMP"]
    },
    {
      name: "Equipo de Ingeniería",
      role: "Desarrollo Core",
      bio: "Un equipo distribuido de ingenieros senior especializados en AI/ML, arquitectura cloud y desarrollo full-stack. Más de 50 años de experiencia combinada en empresas.",
      location: "Remoto / Colombia",
      linkedin: "#",
      specialties: ["AI/ML", "Arquitectura Cloud", "Desarrollo Full-Stack"],
      experience: "50+ años combinados",
      education: "Principales universidades de América Latina",
      certifications: ["AWS", "Azure", "Google Cloud", "Kubernetes"]
    }
  ]
};

export default function TeamSection() {
  const { lang } = useLanguage();
  const team = teamData[lang];

  return (
    <section id="team" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16" data-reveal>
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">
            {lang === "es" ? "Nuestro Equipo" : "Our Team"}
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mt-4 mb-6">
            {lang === "es" ? "Liderazgo y Expertise" : "Leadership & Expertise"}
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            {lang === "es"
              ? "Profesionales experimentados comprometidos con la excelencia en tecnología y servicios."
              : "Experienced professionals committed to technology and service excellence."}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {team.map((member, i) => (
            <div
              key={i}
              className="bg-dark-light/50 border border-primary/10 rounded-2xl p-8 card-hover group"
              data-reveal
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-black text-primary">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-primary/70 font-medium">{member.role}</p>
                  <div className="flex items-center gap-2 text-white/40 text-sm mt-1">
                    <MapPin className="w-4 h-4" />
                    {member.location}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-white/60 text-sm mb-6 leading-relaxed">{member.bio}</p>

              {/* Experience & Education */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 p-3 bg-dark/50 rounded-lg">
                  <Briefcase className="w-4 h-4 text-primary/60" />
                  <div>
                    <div className="text-xs text-white/40">{lang === "es" ? "Experiencia" : "Experience"}</div>
                    <div className="text-white text-sm font-medium">{member.experience}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-dark/50 rounded-lg">
                  <GraduationCap className="w-4 h-4 text-primary/60" />
                  <div>
                    <div className="text-xs text-white/40">{lang === "es" ? "Educación" : "Education"}</div>
                    <div className="text-white text-sm font-medium truncate">{member.education.split(",")[0]}</div>
                  </div>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/40 block mb-2">
                  {lang === "es" ? "Especialidades" : "Specialties"}
                </span>
                <div className="flex flex-wrap gap-2">
                  {member.specialties.map((spec, j) => (
                    <span key={j} className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/40 block mb-2">
                  {lang === "es" ? "Certificaciones" : "Certifications"}
                </span>
                <div className="flex flex-wrap gap-2">
                  {member.certifications.map((cert, j) => (
                    <span key={j} className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-green-500/10 text-green-400">
                      <Award className="w-3 h-3" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social */}
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <a
                  href={member.linkedin}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all text-sm"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
                <a
                  href="/contacto"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 transition-all text-sm"
                >
                  <Mail className="w-4 h-4" />
                  Contact
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
