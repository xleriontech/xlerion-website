/* =============================================================
 * XLERION — Digital Business Cards
 * Fuente única de verdad (Single Source of Truth).
 * Los datos provienen literalmente del briefing del cliente.
 * NO inventar copy: leer siempre desde aquí.
 * ============================================================= */

const foundersData = {
  /* ================= MIGUEL E. RODRÍGUEZ ================= */
  miguel: {
    id: 'miguel',
    slug: 'tarjeta-miguel.html',
    /* Ruta publica corta (servida por el .htaccess como documento principal) */
    publicSlug: 'mike',

    /* --- 1. Header / Status --- */
    brand: 'XLERION',
    brandSub: '// DEEPTECH_INDUSTRIAL',
    status: 'SYSTEM_ACTIVE / DISPONIBLE PARA PROYECTOS',
    statusTone: 'active', // verde → 'active'

    /* --- 2. Perfil Principal --- */
    initials: 'MR',
    name: 'Miguel E. Rodríguez',
    fullName: 'Miguel E. Rodriguez Martinez',
    role: 'Founder & Lead Technical Architect',
    tagline:
      'Arquitecturas 3D en tiempo real · IA Generativa RAG · IoT Industrial · Resiliencia de datos.',
    photo: '/images/mike-vcard.png',
    photoAlt: 'Miguel E. Rodríguez',
    photoZoom: '120%',
    photoFocus: '50% 25%',

    vcard: {
      first: 'Miguel E.',
      last: 'Rodriguez Martinez',
    },
    vcardNote: 'DeepTech Industrial - Gemelos Digitales 3D, IA RAG, IoT Industrial',

    /* Empresa */
    nit: '81720164',

    /* --- Canales de distribucion --- */
    channels: {
      install: true,
      share: true,
      wallet: true,
      nfc: true,
      counter: true,
    },

    /* --- 3. Sección: STACK DE CONFIANZA --- */
    section: {
      label: 'STACK DE CONFIANZA',
      kind: 'chips',
      items: [
        { icon: 'bi-code-slash', text: 'React 18' },
        { icon: 'bi-box', text: 'Three.js / WebGL' },
        { icon: 'bi-cpu', text: 'Python / FastAPI' },
        { icon: 'bi-diagram-3', text: 'LangChain / RAG' },
        { icon: 'bi-shield-check', text: 'ISO/IEC 27001' },
        { icon: 'bi-lock', text: 'Ley 1581 (Habeas Data)' },
      ],
    },

    /* --- 4. Botones de Acción --- */
    ctas: [
      {
        icon: 'bi-download',
        label: 'Agregar a Contactos',
        hint: 'vCard',
        kind: 'primary',
        action: 'vcard',
      },
      {
        icon: 'bi-chat-dots-fill',
        label: 'Hablar por WhatsApp',
        hint: 'Mensaje directo',
        kind: 'secondary',
        action: 'whatsapp',
      },
      {
        icon: 'bi-box-arrow-up-right',
        label: 'Ver Portafolio',
        hint: 'xlerion.com.co',
        kind: 'tertiary',
        href: 'https://xlerion.com.co',
      },
      {
        icon: 'bi-linkedin',
        label: 'LinkedIn',
        hint: 'mikerodriguez84',
        kind: 'tertiary',
        href: 'https://www.linkedin.com/in/mikerodriguez84',
      },
    ],

    /* --- 5. Footer / Datos de Contacto --- */
    contact: {
      location: 'Bogotá, Colombia',
      email: 'miguelxlerion@gmail.com',
      phone: '+57 313 226 3265',
      phoneTel: '+573132263265',
    },

    links: {
      portfolio: 'https://xlerion.com.co',
      linkedin: 'https://www.linkedin.com/in/mikerodriguez84',
      whatsapp: '573132263265',
      whatsappMessage:
        'Hola Miguel, escaneé tu tarjeta digital de Xlerion y me interesa su stack de IA/3D.',
    },

    disclaimer:
      'Tus datos de interacción son procesados bajo la Ley 1581 de 2012 (Habeas Data) y no son compartidos con terceros.',
  },

  /* ================= JULIETTE GONZÁLEZ ================= */
  juliette: {
    id: 'juliette',
    slug: 'tarjeta-juliette.html',
    publicSlug: 'juliette',

    /* --- 1. Header / Status --- */
    brand: 'XLERION',
    brandSub: '// DEEPTECH_INDUSTRIAL',
    status: 'ALIANZAS_ABIERTAS / NETWORK_ACTIVE',
    statusTone: 'active',

    /* --- 2. Perfil Principal --- */
    initials: 'JG',
    name: 'Juliette González',
    fullName: 'Juliette González',
    role: 'Co-Founder & Business Strategy',
    tagline:
      'Viabilidad comercial · Alianzas estratégicas · Escalabilidad y confianza para ecosistemas DeepTech en LATAM.',
    photo: '/images/juliette-vcard.jpg',
    photoAlt: 'Juliette González',
    photoZoom: '110%',
    photoFocus: '68% 20%',

    vcard: {
      first: 'Juliette',
      last: 'González',
    },
    vcardNote: 'DeepTech Industrial - Gemelos Digitales 3D, IA RAG, IoT Industrial',

    /* Empresa */
    nit: '',

    /* --- Canales de distribucion --- */
    channels: {
      install: true,
      share: true,
      wallet: true,
      nfc: true,
      counter: true,
    },

    /* --- 3. Sección: VALOR DE NEGOCIO --- */
    section: {
      label: 'VALOR DE NEGOCIO',
      kind: 'metrics',
      items: [
        {
          index: '01',
          icon: 'bi-graph-up-arrow',
          title: 'Optimización de Costos',
          desc: 'Eficiencia operativa en sourcing y contratación tecnológica.',
        },
        {
          index: '02',
          icon: 'bi-people',
          title: 'Sourcing Estratégico',
          desc: 'Red de talento y partners de hardware/software en la región.',
        },
        {
          index: '03',
          icon: 'bi-rocket-takeoff',
          title: 'Escalabilidad de Modelos',
          desc: 'Del PoC a la producción empresarial defendible en costos.',
        },
      ],
    },

    /* --- 4. Botones de Acción --- */
    ctas: [
      {
        icon: 'bi-download',
        label: 'Agregar a Contactos',
        hint: 'vCard',
        kind: 'primary',
        action: 'vcard',
      },
      {
        icon: 'bi-calendar2-week',
        label: 'Explorar Alianzas',
        hint: '15 min',
        kind: 'secondary',
        href: 'https://calendly.com/xlerion/15min',
      },
      {
        icon: 'bi-file-earmark-arrow-down',
        label: 'Descargar One-Pager',
        hint: 'PDF Corporativo',
        kind: 'tertiary',
        href: '/Xlerion_OnePager.pdf',
        download: true,
      },
      {
        icon: 'bi-linkedin',
        label: 'LinkedIn',
        hint: 'juliette-gt',
        kind: 'tertiary',
        href: 'https://www.linkedin.com/in/juliette-gt/',
      },
    ],

    /* --- 5. Footer / Datos de Contacto --- */
    contact: {
      location: 'Chía, Cundinamarca, Colombia',
      email: 'juliette@xlerion.com.co',
      phone: '+57 3008744650',
      phoneTel: '+573008744650',
    },

    links: {
      portfolio: 'https://xlerion.com.co',
      linkedin: 'https://www.linkedin.com/in/juliette-gt/',
      calendly: 'https://calendly.com/xlerion/15min',
      onePager: '/Xlerion_OnePager.pdf',
      // WhatsApp: se abre el chat con el numero, sin mensaje prellenado
      // (no hay copy aprobado para Juliette).
      whatsapp: '573008744650',
      whatsappMessage: '',
    },

    disclaimer:
      'Tus datos de interacción son procesados bajo la Ley 1581 de 2012 (Habeas Data) y no son compartidos con terceros.',
  },
};

/* Tarjeta activa: cada HTML define su propia constante antes de cargar card.js */
if (typeof ACTIVE_FOUNDER === 'undefined') {
  var ACTIVE_FOUNDER = 'miguel';
}

/*
 * Exponer en window de forma explicita.
 * Un `const` en el ambito global de un script clasico vive en el ambito
 * lexico del global scope, NO como propiedad de `window`: sin esta linea,
 * `window.foundersData` seria undefined y distribution.js no arrancaria.
 */
if (typeof window !== 'undefined') {
  window.foundersData = foundersData;
  window.ACTIVE_FOUNDER = ACTIVE_FOUNDER;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { foundersData };
}
