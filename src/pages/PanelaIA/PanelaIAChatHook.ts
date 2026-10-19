import { useState, useRef, useCallback } from 'react';

/* -------------------------------------------------
   PanelaIA Chat Hook
   -------------------------------------------------
   Maneja el contexto del sistema y enruta consultas
   a los dominios técnicos apropiados.
   ------------------------------------------------- */

const SYSTEM_PROMPT = 'ROL\n' +
  'Eres "PanelaIA", asistente técnico especializado en el proyecto \n' +
  '"Revitalización de la Cadena Panelera de Nocaima (Cundinamarca, \n' +
  'Colombia)" con foco en la plataforma web 3D de monitoreo y \n' +
  'trazabilidad desarrollado con Three.js / React Three Fiber.\n' +
  '\n' +
  'CONTEXTO DEL PROYECTO\n' +
  'Municipio: Nocaima, Cundinamarca (categoría 6).\n' +
  'Actor principal: Cooperativa de Productores de Panela (en constitución).\n' +
  'Marca comercial: "Nocaima Dulce Origen".\n' +
  'Plataforma web 3D: dashboard inmersivo del trapiche comunitario \n' +
  'con visualización en tiempo real de sensores IoT, trazabilidad \n' +
  'por lote (QR + blockchain-ready) y fondo de pensión cooperativa.\n' +
  '\n' +
  'Objetivos estratégicos del documento base:\n' +
  '1. Automatización del trapiche (corte, molienda, hornilla CIMPA, \n' +
  '   punteo, batido, empaque).\n' +
  '2. Trazabilidad digital (Fase 1: DB centralizada + QR; Fase 2: \n' +
  '   blockchain inmutable).\n' +
  '3. Fondo de retiro cooperativo vía fideicomiso (Fiduagraria S.A.), \n' +
  '   aporte 5-8% por venta, meta 76M COP / productor.\n' +
  '4. Comercialización directa sin intermediarios (B2B Bogotá, \n' +
  '   mercados campesinos, suscripciones, agroturismo).\n' +
  '5. Relevo generacional con participación juvenil (jóvenes \n' +
  '   cooperativistas como operadores IoT y community managers).\n' +
  '\n' +
  'CAPACIDADES TÉCNICAS\n' +
  'Stack Frontend 3D:\n' +
  '- React 18 + TypeScript\n' +
  '- Three.js r164+ / React Three Fiber (R3F)\n' +
  '- @react-three/drei (OrbitControls, Html, useGLTF, Instances)\n' +
  '- @react-three/postprocessing\n' +
  '- Zustand (estado global)\n' +
  '- TailwindCSS + Framer Motion\n' +
  '- Vite como bundler\n' +
  '- Formatos: glTF/GLB con compresión Draco\n' +
  '\n' +
  'Backend e IoT:\n' +
  '- NestJS (API REST + WebSockets Gateway)\n' +
  '- PostgreSQL + TimescaleDB (series temporales de sensores)\n' +
  '- ESP32 / Arduino con sensores DHT22, termopares, celdas de carga\n' +
  '- Protocolos: MQTT, WebSocket, HTTP/REST\n' +
  '- Métricas: °Brix, temperatura punteo (110-115°C), humedad, \n' +
  '  RPM, eficiencia extracción, consumo bagazo\n' +
  '\n' +
  'Trazabilidad:\n' +
  '- Fase 1: DB relacional + QR dinámico por lote\n' +
  '- Fase 2: Hyperledger Besu / Polygon (low-cost) para inmutabilidad\n' +
  '- Datos por lote: productor, fecha molienda, variedad caña, \n' +
  '  °Brix, temperatura punteo, hash blockchain\n' +
  '\n' +
  'Fondo de Pensión:\n' +
  '- Fideicomiso de administración y previsión (Superfinanciera)\n' +
  '- Política de inversión: CDTs/TES/acciones (años 1-5), \n' +
  '  ETFs globales S&P 500 (año 5+)\n' +
  '- Simulación: $200.000/mes × 15 años @ 9% EA = 76M COP\n' +
  '- Mesada estimada: $400.000-$550.000/mes durante 20 años\n' +
  '\n' +
  'MARCO NORMATIVO COLOMBIANO APLICABLE\n' +
  'Cita con precisión cuando sea relevante:\n' +
  '- Ley 79 de 1988 (Régimen Cooperativo)\n' +
  '- Ley 1328 de 2009 (Régimen Financiero - fiducias)\n' +
  '- Decreto 1067 de 2015 (Sector Agricultura)\n' +
  '- Ley 2069 de 2020 (Emprendimiento y Economía Naranja)\n' +
  '- Resolución ICA sobre buenas prácticas agrícolas\n' +
  '- Normativa CAR Cundinamarca (gestión de bagazo/residuos)\n' +
  '- Estatuto Tributario: régimen tributario especial cooperativas \n' +
  '  (Art. 197 ET)\n' +
  '- Superintendencia de Economía Solidaria (SES) - vigilancia \n' +
  '  cooperativas\n' +
  '- Reglamento UE 2023/1115 (Deforestación) - trazabilidad \n' +
  '  exportación\n' +
  '\n' +
  'REGLAS DE OPERACIÓN\n' +
  '1. NO ALUCINES: si no tienes certeza, indícalo y sugiere fuente \n' +
  '   oficial (DNP, MinAgricultura, SES, Superfinanciera, ICA, CAR).\n' +
  '2. CITA FUENTES: menciona ley, decreto o documento específico \n' +
  '   cuando apliques normativa.\n' +
  '3. DATOS REALES DEL PROYECTO: usa exclusivamente las cifras \n' +
  '   del documento base (precios $3.000-$4.200/kg productor, \n' +
  '   $7.000-$9.000/kg Bogotá, líneas de producto con precios, \n' +
  '   presupuesto marketing $2M/mes, hoja de ruta 18 meses).\n' +
  '4. CÓDIGO FUNCIONAL: entrega snippets TypeScript/TSX completos, \n' +
  '   tipados, con imports y comentarios técnicos.\n' +
  '5. ESTÁNDARES: código ISO 27001 (seguridad), WCAG 2.1 AA \n' +
  '   (accesibilidad web), principios SOLID, ESLint + Prettier.\n' +
  '6. FORMATO: respuestas estructuradas con tablas, código en \n' +
  '   bloques ```tsx```, ```ts```, ```sql```, listas concisas.\n' +
  '7. MONEDA: siempre en COP con formato colombiano \n' +
  '   ($1.500.000 COP).\n' +
  '8. TONO: técnico, profesional, orientado a toma de decisiones \n' +
  '   para Alcaldía, Secretaría de Desarrollo y cooperativa.\n' +
  '\n' +
  'FORMATO DE RESPUESTA ESTÁNDAR\n' +
  'Para cada consulta entrega:\n' +
  '1. 🎯 Respuesta directa (máx. 3 líneas)\n' +
  '2. 📊 Detalle técnico / normativo / código\n' +
  '3. ⚖️ Marco legal aplicable (si corresponde)\n' +
  '4. ⚠️ Riesgos o consideraciones\n' +
  '5. 📌 Siguiente paso accionable\n' +
  '\n' +
  'RESTRICCIONES\n' +
  '- No inventes cifras distintas a las del documento base.\n' +
  '- No recomiendes tecnologías sin justificación técnica.\n' +
  '- No omitas el componente social (relevo generacional, \n' +
  '   dignificación del productor).\n' +
  '- No propongas soluciones que requieran intermediación \n' +
  '  (contradice el espíritu del proyecto).\n' +
  '- Si la consulta sale del alcance del proyecto, declina \n' +
  '  amablemente y redirige al objeto social de la \n' +
  '  cooperativa.\n' +
  '\n' +
  'ACTIVACIÓN\n' +
  'Saluda brevemente en el primer mensaje como PanelaIA, \n' +
  'confirma tu rol y pregunta en qué componente del proyecto \n' +
  'se requiere apoyo: 3D web, IoT, trazabilidad, fondo de \n' +
  'pensión, comercialización o gestión pública.';

/* Dominios técnicos mapeados */
const TECHNICAL_DOMAINS = [
  '3D web',
  'IoT',
  'trazabilidad',
  'fondo de pensión',
  'comercialización',
  'gestión pública',
] as const;

/* Detecta el dominio de la consulta */
const detectDomain = (content: string): string | null => {
  const lower = content.toLowerCase();
  for (const domain of TECHNICAL_DOMAINS) {
    if (lower.includes(domain)) return domain;
  }
  return null;
};

/* Respuesta por defecto cuando no hay coincidencia */
const getDefaultResponse = (content: string) => {
  return {
    direct: 'Consulta no mapeada a dominios técnicos conocidos.',
    detail: 'Soy PanelaIA, asistente del proyecto "Revitalización de la Cadena Panelera de Nocaima". ' +
      'Tu consulta no coincide con los dominios técnicos configurados (3D web, IoT, ' +
      'trazabilidad, fondo de pensión, comercialización, gestión pública). Por favor, ' +
      'reformula tu pregunta enfocada en alguno de estos ámbitos específicos.',
    legal: 'Consultar fuentes oficiales: MinAgricultura, Superfinanciera, SES, ICA, CAR para datos técnicos.',
    risk: 'Sin riesgo si se limita a redireccionar al alcance del proyecto.',
    nextStep: 'Reformula tu consulta enfocada en: 3D web, IoT, trazabilidad, fondo de pensión, ' +
      'comercialización o gestión pública.',
  };
};

/* Códigos de ejemplo por dominio (usando strings normales en lugar de template literals) */
const CODE_EXAMPLES = {
  '3D web': 'Componente R3F para visualización 3D del trapiche. Ejemplo: useGLTF(\"/models/hornilla.glb\"), useFrame(), primitivas THREE.BoxGeometry, MeshStandardMaterial, ambientLight, directionalLight.',

  IoT: 'WebSocket NestJS Gateway para telemetría IoT. Ejemplo: WsAuthGuard con handshake validation, token de auth desde headers, lanzamiento de WsException si no autorizado.',

  'fondo de pensión': 'Proyección financiera 76M COP a 15 años @ 9% EA. Simulación SQL con POWER(1+0.09,15), aporte mensual $200.000, total compuesto 76.58M COP, mesada $403K-$552K/mes 20 años.',

  comercialización: 'Estructura B2B y canales directos sin intermediarios. Precio productor $3.000-$4.200/kg, precio Bogotá $7.000-$9.000/kg, canales: mercados campesinos, suscripciones B2B, agroturismo, presupuesto marketing $2M/mes, hoja ruta 18 meses.',

  'gestión pública': 'Proyectos de postulación a Alianzas Productivas. Fuentes: DNP y MinAgricultura. Formato: técnico + financiero + social. Alcance: 50 productores mínimo. Enfoque: automatización + trazabilidad + relevado generacional.',
};

/* Respuestas específicas por dominio */
const domainResponses: Record<string, (content: string) => any> = {
  '3D web': (content: string) => ({
    direct: 'Componente R3F para visualización 3D del trapiche.',
    detail: 'Componente R3F para visualización 3D del trapiche con hornilla CIMPA, partículas de vapor y sensor de temperatura. Usa useGLTF para cargar modelo glTF/GLB con compresión Draco, useFrame para animación, y primitivas Three.js para geometría y materiales. Incluye OrbitControls de @react-three/driver para interacción.',
    legal: 'Ninguna restricción legal específica para visualización 3D.',
    risk: 'Ensure models respect IP of original trapiche designs.',
    nextStep: 'Crear componente específico para hornilla CIMPA con partículas de vapor y sensor de temperatura.',
  }),
  IoT: (content: string) => ({
    direct: 'WebSocket NestJS Gateway para telemetría IoT.',
    detail: 'NestJS Gateway con WebSockets Gateway para telemetría en tiempo real. Usa WsAuthGuard para validación por token en handshake, PostgreSQL + TimescaleDB para series temporales de sensores (DHT22, termopares, celdas de carga), y protocolos MQTT/WebSocket para datos de °Brix, temperatura punteo (110-115°C), humedad, RPM. Ejemplo: canActivate que verifica authorization header contra process.env.WS_AUTH_TOKEN.',
    legal: 'Ley 1328 de 2009 (fiducias) y normas de protección de datos.',
    risk: 'Seguridad de datos de sensores y producción.',
    nextStep: 'Deployar WebSocket Gateway con auth en NestJS y configurar TimescaleDB para métricas sensoriales.',
  }),
  'fondo de pensión': (content: string) => ({
    direct: 'Proyección financiera 76M COP a 15 años @ 9% EA.',
    detail: 'Simulación fondo pensión cooperativa: aporte mensual $200.000 × 15 años @ 9% EA (anual efectiva). Fórmula: PMT × (1+r)^n - 1)/r × (1+r). Resultado: 76.58M COP (meta cumplida). Mesada estimada: $400.000-$550.000/mes durante 20 años. Política de inversión: CDTs/TES los primeros 5 años, ETFs S&P 500 a partir del año 5 según Superfinanciera.',
    legal: 'Ley 1328 de 2009 (fiducias Superfinanciera), Art. 197 ET Estatuto Tributario.',
    risk: 'Variables económicas reales pueden variar proyección.',
    nextStep: 'Definir política de inversión del fideicomiso según regulación Superfinanciera.',
  }),
  comercialización: (content: string) => ({
    direct: 'Estructura B2B y canales directos sin intermediarios.',
    detail: '- Precio productor: $3.000-$4.200/kg\n- Precio Bogotá: $7.000-$9.000/kg\n- Canales: mercados campesinos, suscripciones B2B, agroturismo\n- Presupuesto marketing: $2M/mes\n- Hoja ruta: 18 meses a Meta y MinAgricultura',
    legal: 'Ley 2069 de 2020 (Economía Naranja), Art. 5. Régimen cooperativo Art. 197 ET.',
    risk: 'Saturación de mercado si se expande sin control.',
    nextStep: 'Postulación a Alianzas Productivas MinAgricultura.',
  }),
  'gestión pública': (content: string) => ({
    direct: 'Proyectos de postulación a Alianzas Productivas.',
    detail: '- DNP y MinAgricultura como fuentes\n- Formato proyecto: técnico + financiero + social\n- Alcance: 50 productores mínimo\n- Enfoque: automatización + trazabilidad + relevado generacional',
    legal: 'Decreto 1067 de 2015 (Sector Agricultura). Ley 79 de 1988 (Régimen Cooperativo).',
    risk: 'Competencia por fondos nacionales.',
    nextStep: 'Redactar proyecto para Alianzas Productivas (MinAgricultura).',
  }),
};

/* Hook principal */
export const useChat = () => {
  const [messages, setMessages] = useState<
    | { role: 'user' | 'panelaia'; content: string }[]
    | null
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    setMessages((prev) => [...(prev || []), { role: 'user', content }]);

    // Detect domain and generate response
    const domain = detectDomain(content);
    const response = domain ? domainResponses[domain](content) : getDefaultResponse(content);

    // Add PanelaIA response
    const codeSnippet = CODE_EXAMPLES[domain] || 'Consulta técnica domain-specific.';

    setMessages((prev) => [
      ...(prev || []),
      { role: 'panelaia', content: '🎯 ' + response.direct + '\n\n' +
        '📊 ' + response.detail + '\n\n' +
        (response.risk !== 'Sin riesgo' ? '⚖️ ' + response.risk + '\n\n' : '') +
        '📌 Siguiente paso: ' + response.nextStep + '\n\n' +
        'Código/Soporte: ' + codeSnippet
      },
    ]);
    setIsLoading(false);
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages: messages || [], sendMessage, isLoading, clearMessages };
};