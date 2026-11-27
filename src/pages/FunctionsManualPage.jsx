import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function Section({ id, n, title, children }) {
  return (
    <section id={id} className="scroll-mt-24 mb-14">
      <h2 className="flex items-baseline gap-3 text-2xl md:text-3xl font-bold text-white mb-6 pb-3 border-b border-[#00e9fa]/30">
        <span className="font-mono text-sm text-[#00e9fa]">{n}</span>
        <span>{title}</span>
      </h2>
      <div className="space-y-4 text-sm leading-relaxed text-gray-300">{children}</div>
    </section>
  );
}

function Sub({ children }) {
  return <h3 className="font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] text-[#00e9fa] mt-8 mb-3">{children}</h3>;
}

function Card({ children }) {
  return <div className="rounded-lg border border-white/[0.08] bg-[#0a0a12]/80 p-5 md:p-6">{children}</div>;
}

function DocTable({ head, rows }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
      <table className="w-full text-sm border-collapse min-w-[640px]">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} className="border-b border-white/[0.08] bg-[#00e9fa]/[0.07] text-[#00e9fa] font-mono text-[10px] md:text-[11px] uppercase tracking-wider p-3 text-left align-bottom">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className={`border-b border-white/[0.05] p-3 align-top leading-relaxed ${ci === 0 ? 'text-white font-medium' : 'text-gray-400'}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Ul({ items }) {
  return (
    <ul className="space-y-2 list-none p-0 m-0">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3"><span className="text-[#00e9fa] mt-1">•</span><span className="text-gray-300">{it}</span></li>
      ))}
    </ul>
  );
}

export default function FunctionsManualPage() {
  const { lang } = useLanguage();

  useEffect(() => {
    const prev = document.title;
    document.title = lang === 'es' ? 'Manual de Funciones | XLERION' : 'Functions Manual | XLERION';
    return () => { document.title = prev; };
  }, [lang]);

  const toc = [
    ['#marco', '1. Marco general'],
    ['#govtech', '2. GovTech'],
    ['#blockchain', '3. Blockchain Fiscal'],
    ['#gemelos', '4. Gemelos Digitales 3D'],
    ['#rag', '5. Asistentes RAG'],
    ['#gamestudio', '6. Game Studio'],
    ['#advisory', '7. Xlerion Advisory'],
    ['#raci', '8. Matriz RACI'],
    ['#kpis', '9. KPIs y SLA'],
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#00e9fa] mb-3">Xlerion · {lang === 'es' ? 'Documento operativo' : 'Operational document'}</p>
        <h1 className="text-3xl md:text-5xl font-semibold mb-4">{lang === 'es' ? 'Manual de Funciones y Servicios Operativos' : 'Functions and Operational Services Manual'}</h1>
        <p className="text-gray-400 max-w-3xl mb-8">
          {lang === 'es'
            ? 'Estandariza las funciones operativas, la arquitectura técnica, los flujos de trabajo, las matrices de responsabilidad y los protocolos de entrega de cada línea de servicio de Xlerion S.A.S.'
            : 'Standardizes operational functions, technical architecture, workflows, responsibility matrices, and delivery protocols for each Xlerion S.A.S. service line. The official body is published in Spanish.'}
        </p>

        <div className="rounded-xl border border-[#00e9fa]/20 bg-[#00e9fa]/[0.04] p-4 mb-10 text-sm text-gray-300">
          <strong className="text-[#00e9fa]">{lang === 'es' ? 'Nota: ' : 'Note: '}</strong>
          {lang === 'es'
            ? 'Este manual describe la operación y alcance de servicios de Xlerion S.A.S. Su contenido se publica en español como versión operativa de referencia.'
            : 'This manual describes Xlerion S.A.S. service operations and scope. The reference content is published in Spanish.'}
        </div>

        <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-10">
          <aside className="lg:sticky lg:top-24 self-start">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00e9fa] mb-3">{lang === 'es' ? 'Contenido' : 'Contents'}</p>
              <nav className="space-y-1">
                {toc.map(([href, label]) => (
                  <a key={href} href={href} className="block text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded px-2 py-1.5 transition-colors">{label}</a>
                ))}
              </nav>
            </div>
          </aside>

          <main>
            <Section id="marco" n="1" title="Marco General de Gobernanza y Arquitectura Tecnológica">
              <p>Xlerion S.A.S. es una empresa colombiana especializada en tecnología DeepTech, informática industrial, procesamiento de telemetría en tiempo real, inteligencia visual 3D y soluciones de software para la gestión pública (GovTech) e industrial. Registrada bajo el Formulario Oficial MinTIC GDO-TIC-FM-025 V 9 y acreditada en el Banco de Empresas de la Industria Digital del Ministerio de las Tecnologías de la Información y las Comunicaciones, la organización opera bajo un modelo de innovación distribuida con sedes operativas y administrativas en Bogotá, D.C. y Chía / Nocaima, Cundinamarca.</p>

              <Sub>1.1. Principios Operativos y Arquitectura Desacoplada Transversal</Sub>
              <p>Todas las líneas de servicio de Xlerion se ejecutan sobre un motor de arquitectura desacoplada y modular diseñada para garantizar un alto rendimiento en la ingesta de datos, renderizado 3D fluido en navegadores web sin requerir instalaciones locales, y cumplimiento estricto de los estándares internacionales de seguridad de la información.</p>
              <DocTable
                head={['Capa', 'Tecnologías / Función']}
                rows={[
                  ['Capa de Visualización e Interfaz', 'React 18, Three.js, WebGL (renderizado GPU a 60 FPS en navegador), WebXR y Tailwind CSS.'],
                  ['Capa de Cómputo y Borde (Edge)', 'Cloudflare Workers, Cloudflare Pages, FastAPI y microservicios en contenedores Docker.'],
                  ['Capa de Datos, Blockchain e IA', 'Motores de analítica en tiempo real (cálculo de anomalías Z-score), pipelines RAG con LangChain y pgvector, redes permisionadas Hyperledger Fabric e ingesta de sensores IoT sobre protocolos LoRaWAN.'],
                ]}
              />

              <Sub>1.2. Estándares de Seguridad y Cumplimiento Normativo</Sub>
              <DocTable
                head={['Marco', 'Requisito operativo']}
                rows={[
                  ['Seguridad de la Información (ISO/IEC 27001)', 'Cifrado de datos en reposo mediante AES-256 y cifrado en tránsito mediante TLS 1.3 con Perfect Forward Secrecy.'],
                  ['Protección de Datos Personales (Ley 1581 de 2012 y Decreto 1377 de 2013)', 'Protocolos institucionales para el tratamiento de datos personales, garantizando los derechos ARCO (Acceso, Rectificación, Cancelación y Oposición) y el consentimiento expreso del usuario.'],
                  ['Gobernanza de Acceso (RBAC)', 'Control de acceso basado en roles impulsado por autenticación mediante JSON Web Tokens (JWT) bajo el principio de mínimo privilegio.'],
                  ['Trazabilidad Imputable', 'Registro de eventos en bitácoras inmutables y de solo lectura (append-only) para auditorías técnicas e institucionales.'],
                ]}
              />
            </Section>

            <Section id="govtech" n="2" title="Servicio 1: Plataforma de Inteligencia Artificial para Gobiernos Locales (GovTech)">
              <Sub>2.1. Propósito y Alcance del Servicio</Sub>
              <p>El servicio GovTech de Xlerion está orientado a la modernización de la administración pública municipal, permitiendo la transformación digital de las alcaldías y secretarías locales mediante la automatización de la atención ciudadana, el monitoreo transparente de la gestión y la toma de decisiones basada en analítica predictiva urbana.</p>

              <Sub>2.2. Funciones Operativas y Componentes Técnicos</Sub>
              <DocTable
                head={['Componente del Servicio', 'Descripción Funcional', 'Especificación Técnica']}
                rows={[
                  ['Chatbot Ciudadano RAG', 'Asistente virtual inteligente para responder consultas ciudadanas, guiar trámites y reducir tiempos de espera en ventanilla.', 'Pipelines RAG impulsados por LangChain, bases de datos vectoriales en pgvector, ingesta de documentos normativos y canalización multicanal.'],
                  ['Dashboard de Transparencia', 'Panel de control público e institucional para monitorear indicadores clave de desempeño (KPIs) y ejecución presupuestal.', 'Interfaz web interactiva en React 18, conexión en tiempo real a APIs de ERPs municipales o cargas de datos CSV.'],
                  ['Analítica Predictiva Urbana', 'Módulo de inteligencia computacional para predecir necesidades y optimizar recursos municipales.', 'Algoritmos de aprendizaje automático sobre series de tiempo en movilidad, salud pública, educación y seguridad ciudadana.'],
                ]}
              />

              <Sub>2.3. Protocolo de Despliegue (Piloto Gratuito de 3 Meses)</Sub>
              <Card>
                <Ul items={[
                  'Duración: Tres (3) meses calendario.',
                  'Alcance configurado: despliegue de un Chatbot Ciudadano configurado para un (1) trámite municipal prioritario.',
                  'Configuración de un Dashboard inicial con cinco (5) indicadores clave de transparencia.',
                  'Generación de un Reporte Predictivo basado en datos públicos locales.',
                  'Métricas de éxito (KPIs): Reducción mínima del 60% en el tiempo de toma de decisiones operativas y nivel de satisfacción ciudadana/municipal (NPS) igual o superior a 7/10.',
                ]} />
              </Card>
            </Section>

            <Section id="blockchain" n="3" title="Servicio 2: Blockchain Fiscal para la Gestión Presupuestal Municipal">
              <Sub>3.1. Propósito y Arquitectura de Contabilidad Distribuida</Sub>
              <p>El servicio de Blockchain Fiscal de Xlerion implementa una infraestructura de contabilidad distribuida permisionada destinada a erradicar la opacidad, la ineficiencia y los riesgos de alteración en la ejecución del gasto público municipal. La plataforma registra cada hito fiscal mediante firmas criptográficas inmutables.</p>
              <p>El sistema reemplaza las conciliaciones manuales por contratos inteligentes y hashes on-chain que garantizan la auditoría en tiempo real y la confianza ciudadana en la contratación pública.</p>

              <Sub>3.2. Funciones Operativas del Servicio</Sub>
              <Ul items={[
                'Registro Inmutable de Eventos Fiscales: Captura de aprobaciones, órdenes de compra y registros de pago convirtiéndolos en hashes criptográficos registrados en la cadena de bloques.',
                'Ejecución de Contratos Inteligentes: Automatización de reglas contractuales y liberación controlada de pagos previa verificación de cumplimiento mediante Chaincode (Go / Node.js).',
                'Portal Público de Transparencia: Interfaz pública que expone los indicadores de ejecución presupuestal para verificación de cualquier ciudadano.',
                'Herramientas de Conciliación para Auditores: Entorno de auditoría automática que coteja transacciones bancarias y ejecuciones presupuestales, reduciendo el tiempo de auditoría en más del 30% y alcanzando niveles de conciliación automática superiores al 70%.',
              ]} />

              <Sub>3.3. Especificaciones del Stack y Requisitos Operativos</Sub>
              <Card>
                <p><strong className="text-white">Tecnologías Core:</strong> Hyperledger Fabric, Chaincode (Go / Node.js), Node.js, Python, AWS S3 / MinIO (almacenamiento off-chain cifrado AES-256), ElasticSearch, React / Next.js, Kubernetes, Infraestructura de Llave Pública (PKI) y Cloud KMS.</p>
                <p className="mt-3"><strong className="text-white">Requisitos del Cliente Municipal:</strong> Entrega de datos del proceso fiscal (vía API o archivos CSV estructurados), designación de 1 a 2 contactos técnicos y aprobación de políticas de privacidad para manejo exclusivo de hashes on-chain.</p>
              </Card>
            </Section>

            <Section id="gemelos" n="4" title="Servicio 3: Gemelos Digitales 3D e Inteligencia Visual Industrial (SmartFactory DeepTech)">
              <Sub>4.1. Propósito y Visualización 3D en Tiempo Real</Sub>
              <p>El servicio de Gemelos Digitales 3D (SmartFactory) de Xlerion está diseñado para sectores industriales como manufactura, minería, energía y ciudades inteligentes (smart cities). Permite crear réplicas digitales exactas de activos físicos, plantas de producción o maquinarias críticas, desplegables directamente en navegadores web sin requerir la instalación de software especializado ni plugins.</p>

              <Sub>4.2. Funciones Operativas y Telemetría Resiliente</Sub>
              <DocTable
                head={['Función Operativa', 'Descripción Técnica y Métricas']}
                rows={[
                  ['Monitoreo Visual 3D', 'Renderizado a 60 Frames Per Second (FPS) con compresión geométrica Draco glTF y controles interactivos de órbita 360°.'],
                  ['Ingesta de Telemetría', 'Procesamiento continuo superior a 100 mensajes por segundo (>100 msg/s) con latencias de sincronización de 13 a 24 milisegundos.'],
                  ['Detección de Anomalías', 'Evaluación estadística continua mediante cálculo de puntaje Z (Z = (x - μ) / σ) sobre variables térmicas, vibracionales y rotacionales.'],
                  ['Telemetría IoT Resiliente', 'Captura y almacenamiento en búfer local de datos de sensores en campo bajo conectividad inestable (vía LoRaWAN), con resincronización automática.'],
                ]}
              />

              <Sub>4.3. Variables Industriales Monitoreadas en Producción</Sub>
              <DocTable
                head={['Vector', 'Ejemplo de sensor / lectura']}
                rows={[
                  ['Vector Térmico', 'Lectura de temperatura de núcleo (sensor TMP-44, e.g., 68.5 °C a 69.0 °C).'],
                  ['Vector Mecánico', 'Amplitud de vibración (sensor VIB-09, e.g., 1.80 a 1.82 mm/s).'],
                  ['Vector Rotacional', 'Velocidad de giro del eje (sensor RPM-01, e.g., 3431 a 3435 RPM).'],
                  ['Vector de Flujo', 'Caudal de fluidos operativos (sensor FLW-12, e.g., 411.0 L/min).'],
                ]}
              />

              <Sub>4.4. Modelos de Entregables y Ciclos de Proyecto</Sub>
              <DocTable
                head={['Modelo', 'Alcance / Plazo']}
                rows={[
                  ['Paquetes de Validación Rápida (30 a 90 días)', 'Entrega de Pruebas de Concepto (PoC), configuradores 3D WebGL independientes y auditorías de factibilidad de IA para calcular el Retorno de Inversión (ROI).'],
                  ['Despliegues Enterprise DeepTech (6 a 18 meses)', 'Modelado completo de plantas industriales, integración de telemetría masiva en tiempo real y despliegues en infraestructura privada u On-Premise.'],
                ]}
              />
            </Section>

            <Section id="rag" n="5" title="Servicio 4: Asistentes RAG Empresariales e Inteligencia Artificial Aplicada">
              <Sub>5.1. Propósito y Procesamiento Semántico</Sub>
              <p>El servicio de Asistentes RAG (Generación Aumentada por Recuperación) de Xlerion proporciona a las empresas e instituciones asistentes virtuales de IA capaces de responder consultas complejas fundamentándose exclusivamente en la documentación interna de la organización, eliminando el riesgo de alucinaciones.</p>

              <Sub>5.2. Funciones Operativas y Módulos de Integración</Sub>
              <Ul items={[
                'Ingesta Asincrónica de Documentos: Procesamiento en segundo plano de grandes volúmenes de manuales técnicos, normativas o historiales operativos mediante Celery y Redis.',
                'Búsqueda Híbrida y Re-Ranking: Combinación de búsqueda por similitud vectorial (usando pgvector en PostgreSQL) y búsqueda léxica con reordenamiento semántico para maximizar la precisión de las respuestas.',
                'Control de Acceso por Roles (RBAC): Restricción de acceso a la información indexada según el perfil y permisos del usuario solicitante.',
                'Integración Multicanal: Despliegue del asistente en plataformas web corporativas, portales internos o canales de mensajería como WhatsApp (utilizando arquitecturas desacopladas en Django / FastAPI).',
              ]} />
            </Section>

            <Section id="gamestudio" n="6" title="Servicio 5: Xlerion Game Studio (Simuladores Industriales y Videojuegos)">
              <Sub>6.1. Propósito y Línea de Simuladores Industriales</Sub>
              <p>Xlerion Game Studio es la división especializada en el desarrollo de videojuegos serios (Serious Games), simuladores de capacitación operativa e iteraciones interactivas 3D. Utiliza la misma tecnología base de renderizado y motor físico de los gemelos digitales para la formación segura de personal en entornos de alto riesgo (seguridad y salud en el trabajo - SST, minería, manufactura).</p>

              <Sub>6.2. Marco de Propiedad Intelectual y Licenciamiento</Sub>
              <DocTable
                head={['Aspecto', 'Regla']}
                rows={[
                  ['Titularidad Patrimonial', 'Xlerion S.A.S. mantiene la titularidad exclusiva de los derechos patrimoniales sobre su Tecnología Base, motores 3D, frameworks de red, librerías de código y activos preexistentes.'],
                  ['Derechos Morales', 'Se reconoce la paternidad e integridad de las obras creadas por los desarrolladores y diseñadores según la legislación colombiana (Ley 23 de 1982).'],
                  ['Licencia de Uso al Cliente', 'Se otorga una licencia de uso comercial no exclusiva sobre el producto final, quedando prohibida la reventa, sublicenciamiento o descompilado de la Tecnología Base subyacente.'],
                ]}
              />
            </Section>

            <Section id="advisory" n="7" title="Servicio 6: Xlerion Advisory y Habilitación SaaS Regional">
              <Sub>7.1. Propósito y Estructuración Tecnológica</Sub>
              <p>Xlerion Advisory es el servicio de consultoría estratégica y habilitación tecnológica diseñado para estructurar proyectos de transformación digital, modelos de Software como Servicio (SaaS) multi-inquilino y alianzas de innovación territorial.</p>

              <Sub>7.2. Funciones de Habilitación SaaS y Casos de Despliegue</Sub>
              <Ul items={[
                'Estructuración SaaS Multi-Inquilino: Diseño de plataformas escalables (Python/Django, React, MySQL/PostgreSQL) para resolver brechas digitales en sectores regionales (e.g., plataformas turísticas y gastronómicas con buscadores inteligentes y módulos 3D).',
                'Plataformas de Comercio Electrónico Circular: Desarrollo de arquitecturas e-commerce en producción con probadores virtuales 3D (Three.js), procesamiento de pagos automatizado (Wompi, Bancolombia, PSE, Nequi, Daviplata) e ingesta en infraestructura Cloudflare Workers.',
                'Reducción de Tiempos de Análisis: Implementación de soluciones de visualización de datos que reducen hasta en un 40% el tiempo de análisis estratégico para tomadores de decisiones.',
              ]} />
            </Section>

            <Section id="raci" n="8" title="Matriz RACI de Roles y Responsabilidades Operativas">
              <p>Para garantizar la ejecución impecable de cada servicio, se define la siguiente matriz de asignación de responsabilidades RACI (Responsable de la ejecución, Aprobador final, Consultado, Informado):</p>
              <DocTable
                head={['Rol Operativo / Función', 'GovTech', 'Blockchain Fiscal', 'Gemelos 3D', 'Asistentes RAG', 'Game Studio', 'Advisory']}
                rows={[
                  ['Director de Producto (CEO / CTO)', 'A', 'A', 'A', 'A', 'A', 'A'],
                  ['Ingeniero Full-Stack / 3D Dev', 'R', 'C', 'R', 'R', 'R', 'R'],
                  ['Arquitecto Blockchain & Datos', 'I', 'R', 'C', 'C', 'I', 'C'],
                  ['Especialista en IA & RAG', 'R', 'I', 'C', 'R', 'C', 'I'],
                  ['Oficial de Seguridad y Cumplimiento', 'C', 'R', 'C', 'C', 'C', 'R'],
                  ['Líder de Arte & Diseño de Experiencia', 'C', 'I', 'R', 'I', 'R', 'C'],
                ]}
              />
            </Section>

            <Section id="kpis" n="9" title="Indicadores de Rendimiento (KPIs) y SLA del Servicio">
              <p>Xlerion respalda la entrega de sus servicios mediante Acuerdos de Nivel de Servicio (SLA) auditados y métricas cuantitativas comprobadas en entornos de producción:</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  ['-60%', 'Reducción en el tiempo de toma de decisiones operativas en gestión pública.'],
                  ['-40%', 'Reducción de costos operativos (OPEX) por prevención de paradas no programadas.'],
                  ['-80%', 'Reducción en el tiempo de generación de reportes y exportación de pipelines 3D.'],
                  ['99.9%', 'Disponibilidad del sistema (Uptime) en ingesta y procesamiento de telemetría.'],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
                    <div className="text-2xl font-bold text-[#00e9fa] font-mono">{k}</div>
                    <div className="text-sm text-gray-400 mt-1">{v}</div>
                  </div>
                ))}
              </div>

              <Sub>9.1. Niveles de Soporte y Tiempos de Respuesta (SLA)</Sub>
              <DocTable
                head={['Área', 'Compromiso']}
                rows={[
                  ['Disponibilidad del Servicio', '99.9% de tiempo de actividad (Uptime) en servicios en la nube y colectores de telemetría.'],
                  ['Soporte Técnico de Mantenimiento', 'Cobertura 24/7 para incidencias de severidad crítica (Nivel 1) con tiempo de respuesta inicial inferior a 2 horas.'],
                  ['Auditoría Normativa', 'Evaluaciones de cumplimiento bajo Ley 1581 de 2012 y estándares ISO/IEC 27001 incluidas en los informes de cierre de piloto.'],
                ]}
              />
            </Section>

            <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-4 text-sm">
              <Link to="/legal" className="text-gray-400 hover:text-[#00e9fa] transition-colors">← {lang === 'es' ? 'Centro Legal' : 'Legal Center'}</Link>
              <Link to="/" className="text-gray-400 hover:text-[#00e9fa] transition-colors">{lang === 'es' ? 'Inicio' : 'Home'}</Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}