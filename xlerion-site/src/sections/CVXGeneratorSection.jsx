import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Bot, AlertTriangle, Target, Shield, CheckCircle2, XCircle, Monitor, Film, Briefcase, Eye } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const templatesData = {
  software: {
    title: { es: 'Plantilla Base: Desarrollo de Software & Back-End', en: 'Base Template: Software Development & Back-End' },
    headline: 'Senior Software Engineer | Node.js, Python, AWS | Escalabilidad de Microservicios',
    skills: ['Node.js', 'Python', 'Java', 'AWS (EC2, S3, RDS)', 'Docker', 'Kubernetes', 'PostgreSQL', 'CI/CD (GitHub Actions)'],
    metricsTip: { es: 'Enfócate en métricas de rendimiento del servidor (latencia, reducción de costos en la nube, optimización de consultas SQL con grandes datasets).', en: 'Focus on server performance metrics (latency, cloud cost reduction, SQL query optimization with large datasets).' },
    portfolioFocus: { es: 'Repositorios de GitHub con arquitecturas limpias, archivos README explicativos con diagramas de flujo y pruebas unitarias integradas.', en: 'GitHub repositories with clean architectures, explanatory README files with flow diagrams and integrated unit tests.' }
  },
  web: {
    title: { es: 'Plantilla Base: Programación Web & Frontend', en: 'Base Template: Web Programming & Frontend' },
    headline: 'Frontend Developer | React, Next.js, TypeScript | UI/UX Performance Optimization',
    skills: ['JavaScript (ES6+)', 'TypeScript', 'React.js', 'Next.js', 'Tailwind CSS', 'Redux', 'HTML5/CSS3', 'Jest / Cypress'],
    metricsTip: { es: 'Mide el impacto en conversión de usuarios, reducción de tiempos de carga (Core Web Vitals) y escalabilidad de componentes visuales.', en: 'Measure impact on user conversion, loading time reduction (Core Web Vitals) and visual component scalability.' },
    portfolioFocus: { es: 'Aplicaciones web desplegadas con demos en vivo funcionales y portafolios interactivos desarrollados en marcos como Framer.', en: 'Deployed web applications with functional live demos and interactive portfolios built in frameworks like Framer.' }
  },
  multimedia: {
    title: { es: 'Plantilla Base: Producción Multimedia & Video', en: 'Base Template: Multimedia Production & Video' },
    headline: 'Multimedia Producer & Video Editor | Motion Graphics, Post-Producción | UI/UX',
    skills: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Figma', 'Storytelling Audiovisual', 'Optimización Web de Assets'],
    metricsTip: { es: 'Destaca tasas de retención de audiencia, incremento de engagement en campañas y optimización de flujos de trabajo de producción.', en: 'Highlight audience retention rates, campaign engagement increases and production workflow optimization.' },
    portfolioFocus: { es: 'Casos de estudio narrativos en portafolios (Readymag/Framer) que muestren el proceso creativo desde el concepto hasta la entrega final.', en: 'Narrative case studies in portfolios (Readymag/Framer) showing the creative process from concept to final delivery.' }
  },
  '3d': {
    title: { es: 'Plantilla Base: Modelado & Animación 3D', en: 'Base Template: 3D Modeling & Animation' },
    headline: '3D Artist & Technical Designer | Maya, ZBrush, Unreal Engine | Retopología Móvil',
    skills: ['Autodesk Maya', 'ZBrush', 'Unreal Engine 5', 'Unity', 'Substance Painter', 'Optimización de Mallas', 'PBR Texturing'],
    metricsTip: { es: 'Mide la optimización del conteo de polígonos para motores en tiempo real y tasas de frame-rate estables en entornos interactivos.', en: 'Measure polygon count optimization for real-time engines and stable frame-rate in interactive environments.' },
    portfolioFocus: { es: 'GitHub / ArtStation con jerarquía limpia de carpetas (Assets, Textures, Wireframes) y demos interactivas en Unreal/Unity.', en: 'GitHub / ArtStation with clean folder hierarchy (Assets, Textures, Wireframes) and interactive demos in Unreal/Unity.' }
  }
};

const linkedinData = {
  foto: {
    title: { es: 'La Primera Impresión', en: 'The First Impression' },
    badges: ['21x Más Visitas', '36x Más Mensajes'],
    p1: { es: 'La foto de perfil es innegociable. Debe mostrar tu rostro abarcando el 60-70% del espacio, preferiblemente con una sonrisa natural, fondo neutro y vestimenta alineada a tu sector.', en: 'The profile photo is non-negotiable. It should show your face covering 60-70% of the space, preferably with a natural smile, neutral background and attire aligned to your sector.' }
  },
  titular: {
    title: { es: 'La Zona de Mayor Relevancia (220 Caracteres)', en: 'The Highest Relevance Zone (220 Characters)' },
    badges: ['Algoritmo x5 Peso', 'Indexación Semántica'],
    p1: { es: 'El titular no debe ser solo tu cargo actual. Es la principal fuente para el algoritmo de búsqueda. Usa la estructura: [Especialidad] | [Tecnologías Clave] | [Valor].', en: 'The headline shouldn\'t just be your current position. It\'s the main source for the search algorithm. Use the structure: [Specialty] | [Key Technologies] | [Value].' }
  },
  extracto: {
    title: { es: 'Narrativa en Primera Persona', en: 'First-Person Narrative' },
    badges: ['Conexión Humana', '2,600 Caracteres'],
    p1: { es: 'Escribe en primera persona. Un CV formal es frío; LinkedIn es una red social. Tienes 3 segundos para atrapar con un gancho de impacto en las primeras 3 líneas.', en: 'Write in first person. A formal CV is cold; LinkedIn is a social network. You have 3 seconds to catch attention with an impact hook in the first 3 lines.' }
  },
  destacados: {
    title: { es: 'El Escaparate Visual y Validación', en: 'The Visual Showcase & Validation' },
    badges: ['Pruebas Empíricas', 'Skills-first'],
    p1: { es: 'Fija entre 3 y 6 elementos (repositorios de GitHub, casos de estudio interactivos) y aprueba los exámenes de aptitud de LinkedIn para obtener la insignia verificado.', en: 'Pin 3 to 6 elements (GitHub repositories, interactive case studies) and pass LinkedIn skill assessments to get the verified badge.' }
  }
};

export default function CVXGeneratorSection() {
  const { lang } = useLanguage();
  const [activeTemplate, setActiveTemplate] = useState('software');
  const [activeLinkedIn, setActiveLinkedIn] = useState('foto');
  const [activeTab, setActiveTab] = useState('github');
  const chartRef = useRef(null);

  const t = (obj) => obj[lang] || obj.es;

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [lang]);

  const chartData = {
    labels: [
      lang === 'es' ? 'Optimizado ATS (1 Col)' : 'ATS Optimized (1 Col)',
      lang === 'es' ? 'Híbrido Estratégico' : 'Strategic Hybrid',
      lang === 'es' ? '2 Columnas / Lateral' : '2 Columns / Sidebar',
      lang === 'es' ? 'Diseño Creativo / Gráfico' : 'Creative / Graphic Design'
    ],
    datasets: [{
      label: lang === 'es' ? 'Precisión de Extracción (%)' : 'Extraction Accuracy (%)',
      data: [96, 89, 71, 22],
      backgroundColor: [
        'rgba(0, 233, 250, 0.9)',
        'rgba(0, 233, 250, 0.6)',
        'rgba(239, 68, 68, 0.6)',
        'rgba(239, 68, 68, 0.9)'
      ],
      borderWidth: 0,
      borderRadius: 6
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(7, 7, 16, 0.95)',
        titleColor: '#00e9fa',
        bodyColor: '#fff',
        padding: 12,
        borderColor: 'rgba(0, 233, 250, 0.2)',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => `${lang === 'es' ? 'Precisión' : 'Accuracy'}: ${ctx.raw}%`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.5)', callback: (v) => v + '%' }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255,255,255,0.5)', maxRotation: 0 }
      }
    }
  };

  return (
    <section id="cvx-generator" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16" data-reveal>
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">
            {lang === 'es' ? 'Generador de CV' : 'CV Generator'}
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-white mt-4 mb-6">
            {lang === 'es' ? 'Generador CVX' : 'CVX Generator'}
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            {lang === 'es'
              ? 'Estrategias de presentación Tech & Multimedia 2026. Supera los sistemas ATS y destaca ante reclutadores.'
              : 'Tech & Multimedia presentation strategies 2026. Beat ATS systems and stand out to recruiters.'}
          </p>
        </div>

        {/* Section 1: Context */}
        <div className="mb-20" data-reveal>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-lg">🌍</span>
            </div>
            <h3 className="text-2xl font-bold text-white">
              {lang === 'es' ? 'El Contexto Laboral 2026' : 'Job Market Context 2026'}
            </h3>
          </div>
          <p className="text-white/60 mb-8 max-w-3xl">
            {lang === 'es'
              ? 'La masificación de herramientas de IA ha generado una crisis de homogeneización documental. Comprender este panorama es el primer paso para diferenciarse.'
              : 'The massification of AI tools has created a documentation homogeneity crisis. Understanding this landscape is the first step to differentiate.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-light/50 border border-primary/10 rounded-2xl p-6 card-hover group">
              <div className="text-4xl mb-3"><Bot className="w-10 h-10 text-primary" /></div>
              <div className="text-5xl font-black text-primary mb-2">70%</div>
              <h4 className="text-lg font-bold text-white mb-2">
                {lang === 'es' ? 'Candidatos usan IA' : 'Candidates use AI'}
              </h4>
              <p className="text-white/50 text-sm">
                {lang === 'es'
                  ? 'Para redactar automáticamente sus solicitudes y currículums, eliminando la autenticidad humana.'
                  : 'To automatically draft their applications and resumes, eliminating human authenticity.'}
              </p>
            </div>

            <div className="bg-dark-light/50 border border-primary/10 rounded-2xl p-6 card-hover group">
              <div className="text-4xl mb-3"><AlertTriangle className="w-10 h-10 text-yellow-500" /></div>
              <div className="text-5xl font-black text-primary mb-2">64%</div>
              <h4 className="text-lg font-bold text-white mb-2">
                {lang === 'es' ? 'Reclutadores Saturados' : 'Saturated Recruiters'}
              </h4>
              <p className="text-white/50 text-sm">
                {lang === 'es'
                  ? 'Reportan recibir perfiles idénticos y sin diferenciación, dificultando la selección manual.'
                  : 'Report receiving identical profiles without differentiation, making manual selection difficult.'}
              </p>
            </div>

            <div className="bg-dark-light/50 border border-primary/10 rounded-2xl p-6 card-hover group">
              <div className="text-4xl mb-3"><Target className="w-10 h-10 text-green-500" /></div>
              <div className="text-5xl font-black text-primary mb-2">100%</div>
              <h4 className="text-lg font-bold text-white mb-2">Skills-First Hiring</h4>
              <p className="text-white/50 text-sm">
                {lang === 'es'
                  ? 'La tendencia dominante. Las demostraciones empíricas de competencia superan a las credenciales académicas.'
                  : 'The dominant trend. Empirical competence demonstrations outweigh academic credentials.'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: ATS */}
        <div className="mb-20 bg-dark-light/30 border border-primary/10 rounded-2xl p-8" data-reveal>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              {lang === 'es' ? 'Dominando los Sistemas ATS' : 'Mastering ATS Systems'}
            </h3>
          </div>
          <p className="text-white/60 mb-8 max-w-3xl">
            {lang === 'es'
              ? 'El 98% de las empresas Fortune 500 usan sistemas automatizados de seguimiento. Tu diseño estético debe subordinarse a la legibilidad algorítmica.'
              : '98% of Fortune 500 companies use automated tracking systems. Your aesthetic design must be subordinate to algorithmic readability.'}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Chart */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4 text-center">
                {lang === 'es' ? 'Tasa de Éxito por Formato' : 'Success Rate by Format'}
              </h4>
              <div className="bg-dark/50 rounded-xl p-4 border border-white/5" style={{ height: 350 }}>
                <Bar ref={chartRef} data={chartData} options={chartOptions} />
              </div>
              <p className="text-xs text-white/40 mt-3 text-center">
                {lang === 'es'
                  ? 'Datos basados en precisión de lectura de motores semánticos'
                  : 'Data based on semantic engine reading accuracy'}
              </p>
            </div>

            {/* Do/Don't */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white border-b border-white/10 pb-2">
                {lang === 'es' ? 'Reglas Técnicas de Formateo' : 'Formatting Technical Rules'}
              </h4>

              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5">
                <h5 className="font-bold text-green-400 flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5" />
                  {lang === 'es' ? 'LO QUE SÍ FUNCIONA' : 'WHAT WORKS'}
                </h5>
                <ul className="space-y-2 text-sm text-green-300/80">
                  <li>• <strong>{lang === 'es' ? 'Columna Única:' : 'Single Column:'}</strong> {lang === 'es' ? 'Flujo lineal de lectura.' : 'Linear reading flow.'}</li>
                  <li>• <strong>{lang === 'es' ? 'Tipografías Seguras:' : 'Safe Fonts:'}</strong> Calibri, Arial, Georgia.</li>
                  <li>• <strong>{lang === 'es' ? 'Interlineado:' : 'Line Spacing:'}</strong> 1.15 - 1.30.</li>
                  <li>• <strong>{lang === 'es' ? 'Encabezados Estándar:' : 'Standard Headers:'}</strong> {lang === 'es' ? 'Experiencia, Formación, Habilidades.' : 'Experience, Education, Skills.'}</li>
                </ul>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
                <h5 className="font-bold text-red-400 flex items-center gap-2 mb-3">
                  <XCircle className="w-5 h-5" />
                  {lang === 'es' ? 'LO QUE ROMPE EL SISTEMA' : 'WHAT BREAKS THE SYSTEM'}
                </h5>
                <ul className="space-y-2 text-sm text-red-300/80">
                  <li>• <strong>{lang === 'es' ? 'Múltiples Columnas:' : 'Multiple Columns:'}</strong> {lang === 'es' ? 'Mezcla texto paralelo.' : 'Mixes parallel text.'}</li>
                  <li>• <strong>{lang === 'es' ? 'Cuadros y Tablas:' : 'Boxes and Tables:'}</strong> {lang === 'es' ? 'Invisibles para muchos procesadores.' : 'Invisible to many parsers.'}</li>
                  <li>• <strong>{lang === 'es' ? 'Gráficos de Habilidades:' : 'Skill Graphics:'}</strong> {lang === 'es' ? 'Barras, iconos o estrellas no se leen.' : 'Bars, icons or stars are not read.'}</li>
                  <li>• <strong>{lang === 'es' ? 'Datos en Cabeceras:' : 'Header Data:'}</strong> {lang === 'es' ? 'El ATS ignora estas regiones.' : 'ATS ignores these regions.'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Dual Strategy */}
        <div className="mb-20" data-reveal>
          <div className="text-center mb-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-2xl">⚔️</span>
              <h3 className="text-2xl font-bold text-white">
                {lang === 'es' ? 'La Estrategia de CV Dual' : 'The Dual CV Strategy'}
              </h3>
            </div>
            <p className="text-white/60">
              {lang === 'es'
                ? 'Un PDF plano para los bots ATS, y un enlace interactivo para impactar al evaluador humano.'
                : 'A flat PDF for ATS bots, and an interactive link to impact the human evaluator.'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('github')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'github'
                  ? 'bg-primary text-dark shadow-lg shadow-primary/30'
                  : 'bg-dark-light/50 text-white/60 border border-white/10 hover:bg-dark-light'
              }`}
            >
              <Monitor className="w-4 h-4 inline mr-2" />
              {lang === 'es' ? 'Portafolio en GitHub' : 'GitHub Portfolio'}
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'video'
                  ? 'bg-primary text-dark shadow-lg shadow-primary/30'
                  : 'bg-dark-light/50 text-white/60 border border-white/10 hover:bg-dark-light'
              }`}
            >
              <Film className="w-4 h-4 inline mr-2" />
              {lang === 'es' ? 'El Video CV' : 'Video CV'}
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'github' ? (
            <div className="bg-dark-light/50 border border-primary/10 rounded-2xl p-8">
              <div className="md:flex gap-8">
                <div className="flex-1 space-y-6">
                  <h4 className="text-xl font-bold text-white">
                    {lang === 'es' ? 'El README Dinámico y Repositorios' : 'Dynamic README and Repositories'}
                  </h4>
                  <p className="text-white/60">
                    {lang === 'es'
                      ? 'El perfil de GitHub es la tarjeta de presentación interactiva para desarrolladores. Debe demostrar prácticas de ingeniería, consistencia y comunicación técnica.'
                      : 'The GitHub profile is the interactive business card for developers. It must demonstrate engineering practices, consistency and technical communication.'}
                  </p>
                  <div className="space-y-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <h5 className="text-white font-bold">1. {lang === 'es' ? 'README del Perfil' : 'Profile README'}</h5>
                      <p className="text-sm text-white/50 mt-1">
                        {lang === 'es'
                          ? 'Usa herramientas como github-readme-stats para mostrar métricas visuales.'
                          : 'Use tools like github-readme-stats to show visual metrics.'}
                      </p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <h5 className="text-white font-bold">2. {lang === 'es' ? 'Repositorios Estratégicos (Pin)' : 'Strategic Repositories (Pin)'}</h5>
                      <p className="text-sm text-white/50 mt-1">
                        {lang === 'es'
                          ? 'Fija de 3 a 5 proyectos complejos funcionales.'
                          : 'Pin 3 to 5 complex functional projects.'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 mt-8 md:mt-0">
                  <div className="bg-dark/80 rounded-xl p-6 border border-white/10 font-mono text-sm leading-relaxed text-green-400">
                    <div><span className="text-pink-400">##</span> {lang === 'es' ? 'Hola, soy Developer' : 'Hi, I\'m Developer'} 👋</div>
                    <br />
                    <div><span className="text-blue-400">###</span> 🚀 {lang === 'es' ? 'Sobre Mí' : 'About Me'}</div>
                    <div className="text-white/40">- 🔭 {lang === 'es' ? 'Desarrollador Full Stack / Multimedia' : 'Full Stack Developer / Multimedia'}</div>
                    <br />
                    <div><span className="text-blue-400">###</span> 📊 {lang === 'es' ? 'Estadísticas' : 'Statistics'}</div>
                    <div>![GitHub Stats](url-to-stats)</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-primary/5 to-dark-light/50 border border-primary/10 rounded-2xl p-8">
              <div className="md:flex gap-8 items-center">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-4">
                    {lang === 'es' ? 'El Impacto del Video CV (60 Segundos)' : 'Video CV Impact (60 Seconds)'}
                  </h4>
                  <p className="text-white/60 mb-6">
                    {lang === 'es'
                      ? 'Genera un incremento del 300% en clics y aumenta las llamadas para entrevistas en un 10.3%.'
                      : 'Generates a 300% increase in clicks and increases interview calls by 10.3%.'}
                  </p>
                  <h5 className="font-bold text-white mb-3">
                    {lang === 'es' ? 'Estructura del Guion Perfecto:' : 'Perfect Script Structure:'}
                  </h5>
                  <ul className="space-y-2 text-sm text-white/60">
                    <li>✨ <strong>0-10s:</strong> {lang === 'es' ? 'Gancho - Nombre y objetivo.' : 'Hook - Name and objective.'}</li>
                    <li>📈 <strong>10-30s:</strong> {lang === 'es' ? 'Valor - 2-3 logros cuantitativos.' : 'Value - 2-3 quantitative achievements.'}</li>
                    <li>💡 <strong>30-50s:</strong> {lang === 'es' ? 'Diferenciación - Stack único o visión.' : 'Differentiation - Unique stack or vision.'}</li>
                    <li>🎯 <strong>50-60s:</strong> {lang === 'es' ? 'CTA - Invitación al portafolio.' : 'CTA - Portfolio invitation.'}</li>
                  </ul>
                </div>
                <div className="flex-1 mt-8 md:mt-0">
                  <div className="bg-dark-light/50 rounded-2xl p-6 border border-white/10">
                    <h5 className="font-bold text-white mb-4 text-center">
                      {lang === 'es' ? 'Formatos de Video CV' : 'Video CV Formats'}
                    </h5>
                    <p className="text-sm text-white/60">
                      • <strong>Talking Head:</strong> {lang === 'es' ? 'Presencia directa a cámara.' : 'Direct camera presence.'}<br />
                      • <strong>Screen Recording:</strong> {lang === 'es' ? 'Ideal para mostrar código o UI/UX.' : 'Ideal for showing code or UI/UX.'}<br />
                      • <strong>Document-to-Video:</strong> {lang === 'es' ? 'Generación automatizada vía IA.' : 'AI-automated generation.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Template Generator */}
        <div className="mb-20 bg-dark-light/30 border border-primary/10 rounded-2xl p-8" data-reveal>
          <div className="text-center mb-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-2xl">⚡</span>
              <h3 className="text-2xl font-bold text-white">
                {lang === 'es' ? 'Generador de Plantillas por Área' : 'Template Generator by Area'}
              </h3>
            </div>
            <p className="text-white/60">
              {lang === 'es'
                ? 'Selecciona tu especialidad para obtener un esquema optimizado de palabras clave y habilidades críticas.'
                : 'Select your specialty to get an optimized keyword and critical skills scheme.'}
            </p>
          </div>

          {/* Area Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { key: 'software', icon: '💻', label: lang === 'es' ? 'Software' : 'Software' },
              { key: 'web', icon: '🌐', label: lang === 'es' ? 'Web & Frontend' : 'Web & Frontend' },
              { key: 'multimedia', icon: '🎬', label: lang === 'es' ? 'Multimedia' : 'Multimedia' },
              { key: '3d', icon: '🧊', label: lang === 'es' ? '3D' : '3D' }
            ].map((area) => (
              <button
                key={area.key}
                onClick={() => setActiveTemplate(area.key)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeTemplate === area.key
                    ? 'bg-primary text-dark shadow-lg shadow-primary/30'
                    : 'bg-dark-light/50 text-white/60 border border-white/10 hover:bg-dark-light'
                }`}
              >
                {area.icon} {area.label}
              </button>
            ))}
          </div>

          {/* Template Output */}
          <div className="bg-dark/50 rounded-2xl p-6 border border-white/5 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs uppercase tracking-wider font-bold text-primary">
                {lang === 'es' ? 'Perfil Sugerido 2026' : 'Suggested Profile 2026'}
              </span>
              <h4 className="text-xl font-bold text-white mt-1">{t(templatesData[activeTemplate].title)}</h4>
            </div>
            <div>
              <h5 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                {lang === 'es' ? 'Titular para LinkedIn y CV (ATS-Safe)' : 'LinkedIn & CV Headline (ATS-Safe)'}
              </h5>
              <div className="bg-dark-light/50 p-3 rounded-xl border border-white/10 font-mono text-sm text-white">
                {templatesData[activeTemplate].headline}
              </div>
            </div>
            <div>
              <h5 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                {lang === 'es' ? 'Habilidades Técnicas Clave' : 'Key Technical Skills'}
              </h5>
              <div className="flex flex-wrap gap-2">
                {templatesData[activeTemplate].skills.map((skill, i) => (
                  <span key={i} className="bg-dark-light/50 border border-white/10 text-white/70 px-3 py-1 rounded-lg text-xs font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-dark-light/50 p-4 rounded-xl border border-white/10">
                <h5 className="font-bold text-white text-sm mb-1">💡 {lang === 'es' ? 'Enfoque de Métricas' : 'Metrics Focus'}</h5>
                <p className="text-xs text-white/50">{t(templatesData[activeTemplate].metricsTip)}</p>
              </div>
              <div className="bg-dark-light/50 p-4 rounded-xl border border-white/10">
                <h5 className="font-bold text-white text-sm mb-1">🔗 {lang === 'es' ? 'Demostración Empírica' : 'Empirical Demonstration'}</h5>
                <p className="text-xs text-white/50">{t(templatesData[activeTemplate].portfolioFocus)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: LinkedIn */}
        <div className="bg-dark-light/30 border border-primary/10 rounded-2xl p-8" data-reveal>
          <div className="text-center mb-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold text-white">
                {lang === 'es' ? 'Optimización Semántica en LinkedIn' : 'LinkedIn Semantic Optimization'}
              </h3>
            </div>
            <p className="text-white/60">
              {lang === 'es'
                ? 'El algoritmo busca el "Gráfico Semántico". Selecciona una sección para descubrir cómo optimizarla.'
                : 'The algorithm searches for the "Semantic Graph". Select a section to discover how to optimize it.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Buttons */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              {[
                { key: 'foto', icon: '📸', label: lang === 'es' ? 'Foto y Banner' : 'Photo & Banner' },
                { key: 'titular', icon: '🏷️', label: lang === 'es' ? 'Titular' : 'Headline' },
                { key: 'extracto', icon: '📝', label: lang === 'es' ? 'Extracto' : 'About' },
                { key: 'destacados', icon: '⭐', label: lang === 'es' ? 'Destacados' : 'Featured' }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveLinkedIn(item.key)}
                  className={`whitespace-nowrap flex-shrink-0 text-left px-5 py-4 rounded-xl border-2 font-bold transition-all ${
                    activeLinkedIn === item.key
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-transparent bg-dark-light/50 text-white/60 hover:bg-dark-light'
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="lg:col-span-8 bg-dark/50 rounded-2xl p-6 lg:p-8 border border-white/5 min-h-[300px] flex flex-col justify-center">
              <h4 className="text-2xl font-bold text-white mb-3">{t(linkedinData[activeLinkedIn].title)}</h4>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {linkedinData[activeLinkedIn].badges.map((badge, i) => (
                  <span key={i} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold border border-primary/20 whitespace-nowrap">
                    {badge}
                  </span>
                ))}
              </div>
              <p className="text-white/60 leading-relaxed">{t(linkedinData[activeLinkedIn].p1)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
