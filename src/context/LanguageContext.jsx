import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const translations = {
    es: {
        // Navigation
        nav_home: 'INICIO',
        nav_soluciones: 'SOLUCIONES',
        nav_tecnologia: 'TECNOLOGÍA Y SEGURIDAD',
        nav_impacto: 'IMPACTO (ROI)',
        nav_fundador: 'FUNDADOR',
        nav_contacto: 'CONTACTO',
        lang_es: 'ES',
        lang_en: 'EN',
        nav_poc: 'Solicitar PoC',

        // Footer
        footer_tagline: 'Ingeniería de datos, visualización 3D e IA para entornos industriales.',
        footer_contact: 'Contacto directo',
        footer_access: 'Accesos',
        footer_networks: 'Redes',
        footer_rights: 'Política de Tratamiento de Datos (Ley 1581 de 2012) | © 2026 Xlerion. Todos los derechos reservados.',
        footer_claim: 'Transformando datos en inteligencia visual.',
        footer_access_home: 'Inicio',
        footer_access_soluciones: 'Soluciones',
        footer_access_tecnologia: 'Tecnología y Seguridad',
        footer_access_impacto: 'Impacto (ROI)',
        footer_access_fundador: 'Fundador',
        footer_access_contacto: 'Contacto',
        footer_legal_privacy: 'Política de Tratamiento de Datos (Ley 1581 de 2012)',
        footer_legal_terms: 'Términos y Condiciones de Servicio',
        footer_email: 'contacto@xlerion.co',
        footer_location: 'Bogotá / Nocaima, Cundinamarca, Colombia',

        // Hero Section
        hero_badge: 'DEEPTECH INDUSTRIAL: MINERÍA • MANUFACTURA • SMART CITIES',
        hero_title: 'Transforme sus datos industriales en Inteligencia Visual 3D y Plataformas de IA en Tiempo Real.',
        hero_subtitle: 'Arquitecturas de software escalables y tolerantes a fallos. Más de 10 años de experiencia integrando visualización 3D interactiva (WebGL/Three.js) e Inteligencia Artificial (RAG/LangChain) para operaciones críticas.',
        hero_cta_primary: 'Solicitar Prueba de Concepto (PoC)',
        hero_cta_secondary: 'Explorar Arquitectura Técnica',
        hero_scroll: 'Explorar proyectos',
        hero_corner_top: '+ XLERION_VIEWPORT // WEBGL_ACTIVE',
        hero_corner_bottom: "COORD_LATAM [04°42'N 74°04'W]",

        // Soluciones / Core Offerings
        soluciones_title: 'Arquitecturas de Nivel Empresarial para Entornos Críticos',
        soluciones_subtitle: 'Tres líneas de solución validadas en producción, diseñadas para operar en nube privada, on-premise o entornos air-gapped.',
        solucion1_title: 'Gemelos Digitales 3D (SmartFactory)',
        solucion1_desc: 'Monitoreo de telemetría industrial y mantenimiento predictivo con renderizado acelerado por GPU en el navegador.',
        solucion1_metrics: [
            { label: 'Throughput WebSockets', value: '>100 msg/s' },
            { label: 'Renderizado 3D', value: '60 FPS' },
            { label: 'Detección anomalías', value: 'Z-score' },
        ],
        solucion1_stack: 'React 18 · Three.js · FastAPI · Docker',
        solucion2_title: 'Asistentes Corporativos RAG (Enterprise AI)',
        solucion2_desc: 'Reducción del tiempo de búsqueda en bases de conocimiento no estructuradas (manuales técnicos, legales, operaciones) mediante IA generativa controlada.',
        solucion2_metrics: [
            { label: 'Chunking semántico', value: 'Semántico' },
            { label: 'Búsqueda híbrida', value: 'Vectorial + Léxica' },
            { label: 'Re-ranking', value: 'Anti-alucinaciones' },
        ],
        solucion2_stack: 'Python · LangChain · PostgreSQL (pgvector) · Celery + Redis',
        solucion3_title: 'Backend de Telemetría Resiliente (IoT Industrial)',
        solucion3_desc: 'Ingesta de datos de sensores en entornos con conectividad intermitente o de baja calidad.',
        solucion3_metrics: [
            { label: 'Uptime', value: '99.9%' },
            { label: 'Persistencia local', value: 'Buffering' },
            { label: 'Reconciliación', value: 'Atómica' },
        ],
        solucion3_stack: 'Python (Asyncio) · MQTT · TimescaleDB · Linux Edge (Arm64)',

        // Tech Stack & Compliance
        techstack_title: 'Ingeniería para la Confianza de CTOs y Auditores de TI',
        techstack_subtitle: 'Sin dependencias experimentales. Cada componente se selecciona por su soporte a largo plazo (LTS), tolerancia a fallos y auditoría.',
        techstack_arch_title: 'Arquitectura por Capas',
        techstack_arch_vis: 'React, Three.js, Compresión geométrica Draco (glTF)',
        techstack_arch_backend: 'Python 3.11+, FastAPI, PostgreSQL, TimescaleDB',
        techstack_arch_ai: 'LangChain, Modelos locales o API segura, pgvector',
        techstack_arch_infra: 'Docker, Kubernetes, Gateways Edge Linux',
        techstack_security_title: 'Seguridad y Cumplimiento (Alineado a ISO/IEC 27001)',
        techstack_sec_encryption_title: 'Cifrado',
        techstack_sec_encryption_desc: 'AES-256 en reposo y TLS 1.3 con Perfect Forward Secrecy en tránsito (HTTPS/WSS/MQTTS).',
        techstack_sec_sovereignty_title: 'Soberanía de Datos',
        techstack_sec_sovereignty_desc: 'Despliegue On-Premise o VPC privada. Aislamiento de redes disponible.',
        techstack_sec_normativa_title: 'Normativa Colombiana',
        techstack_sec_normativa_desc: 'Cumplimiento estricto de la Ley 1581 de 2012 (Habeas Data) y el Decreto 1377 de 2013 en el tratamiento de cualquier dato personal o sensible en los sistemas.',
        techstack_sec_quality_title: 'Calidad de Software',
        techstack_sec_quality_desc: 'Prácticas de CI/CD, tipado estricto y logging estructurado en JSON (trazabilidad completa, alineado a principios ISO/IEC 25010).',

        // Impacto / ROI
        impacto_title: 'Resultados Medibles, No Solo Promesas',
        impacto_subtitle: 'Basado en métricas auditadas de implementaciones reales en sectores industriales.',
        impacto_m1_value: '−60%',
        impacto_m1_label: 'Tiempo de toma de decisiones operativas',
        impacto_m1_case: 'Plataforma de gestión municipal',
        impacto_m2_value: '−40%',
        impacto_m2_label: 'Tiempo de análisis de datos complejos',
        impacto_m2_case: 'Visualización 3D para estrategias neurocientíficas/industriales',
        impacto_m3_value: '−80%',
        impacto_m3_label: 'Tiempo de exportación de pipelines 3D',
        impacto_m3_case: 'Automatización propietaria',
        impacto_m4_value: '99.9%',
        impacto_m4_label: 'Uptime en ingesta de telemetría',
        impacto_m4_case: 'Arquitectura de persistencia local',
        impacto_note: 'Ofrecemos una calculadora de ROI personalizada para su operación específica durante la fase de PoC.',

        // Founder
        founder_title: 'Liderazgo Técnico y Founder-Market Fit',
        founder_subtitle: 'Sobre el Fundador',
        founder_intro: 'Xlerion es liderada por Miguel E. Rodriguez Martinez, Ingeniero Full-Stack Senior con más de 10 años de experiencia diseñando arquitecturas donde los datos en tiempo real cobran vida. Mi enfoque no es solo entregar código, sino garantizar la resiliencia de los datos, la optimización de pipelines y la alineación estratégica del proyecto con los objetivos de negocio.',
        founder_name: 'Miguel E. Rodriguez Martinez',
        founder_role: 'Fundador & Lead Technical Architect',
        founder_location: 'Bogotá, Colombia (Disponible para despliegues nacionales y trabajo remoto global)',
        founder_certs_label: 'Credenciales Clave',
        founder_cert1: 'PMP® Project Management Professional (PMI, 2020)',
        founder_cert2: 'AI/GenAI Specialization with Honors (UC Irvine, 2024)',
        founder_cert3: 'AI Developer Professional (IBM Watson, 2018)',

        // Contact / PoC
        contact_title: 'Inicie su Prueba de Concepto Técnica',
        contact_subtitle: 'Cada solicitud es analizada directamente por nuestra arquitectura. Recibirá una respuesta técnica estructurada en menos de 24 horas hábiles. Firmamos NDA (Acuerdo de Confidencialidad) antes de revisar planos, redes o telemetría de planta.',
        contact_form_title: 'Formulario de solicitud de PoC',
        contact_form_subtitle: 'Campos requeridos para preparar la evaluación técnica',
        contact_form_name: 'Nombre completo',
        contact_form_company: 'Empresa',
        contact_form_email: 'Correo corporativo',
        contact_form_role: 'Cargo',
        contact_form_sector: 'Sector de interés',
        contact_form_interest: 'Línea de interés',
        contact_form_challenge: '¿Cuál es su mayor desafío actual con los datos?',
        contact_form_name_ph: 'Ej. Ing. Carlos Mendoza',
        contact_form_company_ph: 'Ej. Minera Andina S.A.',
        contact_form_email_ph: 'nombre@empresa.com',
        contact_form_role_ph: 'Ej. CTO / Gerente de Planta / Director TI',
        contact_form_challenge_ph: 'Describa su desafío actual con los datos industriales...',
        contact_form_consent: 'Autorizo el tratamiento de mis datos personales conforme a la Política de Tratamiento de Datos de Xlerion, en cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013 de la República de Colombia.',
        contact_form_submit: 'Solicitar Evaluación Técnica y PoC',
        contact_email_label: 'Correo',
        contact_email_value: 'contacto@xlerion.co',
        contact_location_label: 'Ubicación',
        contact_location_value: 'Bogotá / Nocaima, Cundinamarca, Colombia',
        contact_sla_label: 'SLA de respuesta',
        contact_sla_value: '< 24 horas hábiles',
        contact_sector_options: ['Minería', 'Manufactura', 'Smart Cities', 'Energía', 'Otro'],
        contact_interest_options: ['Gemelos Digitales 3D', 'Plataformas RAG/IA', 'Telemetría IoT', 'Consultoría'],
        contact_legal_notice: 'Política de Tratamiento de Datos (Ley 1581 de 2012) | © 2026 Xlerion',

        // Common UI
        ui_loading: 'Cargando...',
        ui_error: 'Error',
        ui_retry: 'Reintentar',
        ui_close: 'Cerrar',
        ui_send: 'Enviar',
        ui_download: 'Descargar',
        ui_learn_more: 'Saber más',
    },
    en: {
        // Navigation
        nav_home: 'HOME',
        nav_soluciones: 'SOLUTIONS',
        nav_tecnologia: 'TECHNOLOGY & SECURITY',
        nav_impacto: 'IMPACT (ROI)',
        nav_fundador: 'FOUNDER',
        nav_contacto: 'CONTACT',
        lang_es: 'ES',
        lang_en: 'EN',
        nav_poc: 'Request PoC',

        // Footer
        footer_tagline: 'Data engineering, 3D visualization & AI for industrial environments.',
        footer_contact: 'Direct contact',
        footer_access: 'Access',
        footer_networks: 'Networks',
        footer_rights: 'Data Processing Policy (Law 1581 of 2012) | © 2026 Xlerion. All rights reserved.',
        footer_claim: 'Transforming data into visual intelligence.',
        footer_access_home: 'Home',
        footer_access_soluciones: 'Solutions',
        footer_access_tecnologia: 'Technology & Security',
        footer_access_impacto: 'Impact (ROI)',
        footer_access_fundador: 'Founder',
        footer_access_contacto: 'Contact',
        footer_legal_privacy: 'Data Processing Policy (Law 1581 of 2012)',
        footer_legal_terms: 'Terms and Conditions of Service',
        footer_email: 'contacto@xlerion.co',
        footer_location: 'Bogotá / Nocaima, Cundinamarca, Colombia',

        // Hero Section
        hero_badge: 'INDUSTRIAL DEEPTECH: MINING • MANUFACTURING • SMART CITIES',
        hero_title: 'Transform Your Industrial Data into 3D Visual Intelligence and Real-Time AI Platforms.',
        hero_subtitle: 'Scalable and fault-tolerant software architectures. Over 10 years of experience integrating interactive 3D visualization (WebGL/Three.js) and Artificial Intelligence (RAG/LangChain) for critical operations.',
        hero_cta_primary: 'Request Proof of Concept (PoC)',
        hero_cta_secondary: 'Explore Technical Architecture',
        hero_scroll: 'Explore Projects',
        hero_corner_top: '+ XLERION_VIEWPORT // WEBGL_ACTIVE',
        hero_corner_bottom: "COORD_LATAM [04°42'N 74°04'W]",

        // Soluciones / Core Offerings
        soluciones_title: 'Enterprise-Grade Architectures for Critical Environments',
        soluciones_subtitle: 'Three production-validated solution lines, designed to operate in private cloud, on-premise, or air-gapped environments.',
        solucion1_title: 'Digital Twins 3D (SmartFactory)',
        solucion1_desc: 'Industrial telemetry monitoring and predictive maintenance with GPU-accelerated rendering in the browser.',
        solucion1_metrics: [
            { label: 'WebSocket Throughput', value: '>100 msg/s' },
            { label: '3D Rendering', value: '60 FPS' },
            { label: 'Anomaly Detection', value: 'Z-score' },
        ],
        solucion1_stack: 'React 18 · Three.js · FastAPI · Docker',
        solucion2_title: 'Enterprise RAG Assistants',
        solucion2_desc: 'Reduced search time in unstructured knowledge bases (technical manuals, legal, operations) through controlled generative AI.',
        solucion2_metrics: [
            { label: 'Semantic Chunking', value: 'Semantic' },
            { label: 'Hybrid Search', value: 'Vector + Lexical' },
            { label: 'Re-ranking', value: 'Anti-Hallucination' },
        ],
        solucion2_stack: 'Python · LangChain · PostgreSQL (pgvector) · Celery + Redis',
        solucion3_title: 'Resilient Telemetry Backend (Industrial IoT)',
        solucion3_desc: 'Sensor data ingestion in environments with intermittent or low-quality connectivity.',
        solucion3_metrics: [
            { label: 'Uptime', value: '99.9%' },
            { label: 'Local Persistence', value: 'Buffering' },
            { label: 'Reconciliation', value: 'Atomic' },
        ],
        solucion3_stack: 'Python (Asyncio) · MQTT · TimescaleDB · Linux Edge (Arm64)',

        // Tech Stack & Compliance
        techstack_title: 'Engineering for CTO and IT Auditor Trust',
        techstack_subtitle: 'No experimental dependencies. Each component is selected for long-term support (LTS), fault tolerance and auditability.',
        techstack_arch_title: 'Layered Architecture',
        techstack_arch_vis: 'React, Three.js, Draco Geometric Compression (glTF)',
        techstack_arch_backend: 'Python 3.11+, FastAPI, PostgreSQL, TimescaleDB',
        techstack_arch_ai: 'LangChain, Local Models or Secure API, pgvector',
        techstack_arch_infra: 'Docker, Kubernetes, Linux Edge Gateways',
        techstack_security_title: 'Security and Compliance (Aligned to ISO/IEC 27001)',
        techstack_sec_encryption_title: 'Encryption',
        techstack_sec_encryption_desc: 'AES-256 at rest and TLS 1.3 with Perfect Forward Secrecy in transit (HTTPS/WSS/MQTTS).',
        techstack_sec_sovereignty_title: 'Data Sovereignty',
        techstack_sec_sovereignty_desc: 'On-Premise or Private VPC deployment. Network isolation available.',
        techstack_sec_normativa_title: 'Colombian Regulation',
        techstack_sec_normativa_desc: 'Strict compliance with Law 1581 of 2012 (Habeas Data) and Decree 1377 of 2013 in the processing of any personal or sensitive data in the systems.',
        techstack_sec_quality_title: 'Software Quality',
        techstack_sec_quality_desc: 'CI/CD practices, strict typing and structured JSON logging (full traceability, aligned with ISO/IEC 25010 principles).',

        // Impacto / ROI
        impacto_title: 'Measurable Results, Not Just Promises',
        impacto_subtitle: 'Based on audited metrics from real implementations in industrial sectors.',
        impacto_m1_value: '−60%',
        impacto_m1_label: 'Operational decision-making time',
        impacto_m1_case: 'Municipal management platform',
        impacto_m2_value: '−40%',
        impacto_m2_label: 'Complex data analysis time',
        impacto_m2_case: '3D visualization for neuro-scientific/industrial strategies',
        impacto_m3_value: '−80%',
        impacto_m3_label: '3D pipeline export time',
        impacto_m3_case: 'Proprietary automation',
        impacto_m4_value: '99.9%',
        impacto_m4_label: 'Telemetry ingestion uptime',
        impacto_m4_case: 'Local persistence architecture',
        impacto_note: 'We offer a customized ROI calculator for your specific operation during the PoC phase.',

        // Founder
        founder_title: 'Technical Leadership and Founder-Market Fit',
        founder_subtitle: 'About the Founder',
        founder_intro: 'Xlerion is led by Miguel E. Rodriguez Martinez, Senior Full-Stack Engineer with over 10 years of experience designing architectures where real-time data comes alive. My focus is not just delivering code, but ensuring data resilience, pipeline optimization, and strategic alignment of the project with business objectives.',
        founder_name: 'Miguel E. Rodriguez Martinez',
        founder_role: 'Founder & Lead Technical Architect',
        founder_location: 'Bogotá, Colombia (Available for national deployments and global remote work)',
        founder_certs_label: 'Key Credentials',
        founder_cert1: 'PMP® Project Management Professional (PMI, 2020)',
        founder_cert2: 'AI/GenAI Specialization with Honors (UC Irvine, 2024)',
        founder_cert3: 'AI Developer Professional (IBM Watson, 2018)',

        // Contact / PoC
        contact_title: 'Start Your Technical Proof of Concept',
        contact_subtitle: 'Each request is analyzed directly by our architecture team. You will receive a structured technical response in under 24 business hours. We sign an NDA (Confidentiality Agreement) before reviewing blueprints, networks or plant telemetry.',
        contact_form_title: 'PoC Request Form',
        contact_form_subtitle: 'Required fields to prepare the technical evaluation',
        contact_form_name: 'Full Name',
        contact_form_company: 'Company',
        contact_form_email: 'Corporate Email',
        contact_form_role: 'Role',
        contact_form_sector: 'Industry of Interest',
        contact_form_interest: 'Line of Interest',
        contact_form_challenge: 'What is your biggest data challenge today?',
        contact_form_name_ph: 'E.g. Eng. Carlos Mendoza',
        contact_form_company_ph: 'E.g. Andean Mining Corp.',
        contact_form_email_ph: 'name@company.com',
        contact_form_role_ph: 'E.g. CTO / Plant Manager / IT Director',
        contact_form_challenge_ph: 'Describe your current challenge with industrial data...',
        contact_form_consent: 'I authorize the processing of my personal data in accordance with Xlerion Data Processing Policy, complying with Law 1581 of 2012 and Decree 1377 of 2013 of the Republic of Colombia.',
        contact_form_submit: 'Request Technical Evaluation and PoC',
        contact_email_label: 'Email',
        contact_email_value: 'contacto@xlerion.co',
        contact_location_label: 'Location',
        contact_location_value: 'Bogotá / Nocaima, Cundinamarca, Colombia',
        contact_sla_label: 'Response SLA',
        contact_sla_value: '< 24 business hours',
        contact_sector_options: ['Mining', 'Manufacturing', 'Smart Cities', 'Energy', 'Other'],
        contact_interest_options: ['Digital Twins 3D', 'RAG/AI Platforms', 'IoT Telemetry', 'Consulting'],
        contact_legal_notice: 'Data Processing Policy (Law 1581 of 2012) | © 2026 Xlerion',

        // Common UI
        ui_loading: 'Loading...',
        ui_error: 'Error',
        ui_retry: 'Retry',
        ui_close: 'Close',
        ui_send: 'Send',
        ui_download: 'Download',
        ui_learn_more: 'Learn more',
    },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('xlerion-lang') || 'es';
        }
        return 'es';
    });

    useEffect(() => {
        localStorage.setItem('xlerion-lang', lang);
        document.documentElement.lang = lang;
    }, [lang]);

    const t = useMemo(() => {
        const dict = translations[lang] || translations.es;
        return (key) => {
            const keys = key.split('.');
            let value = dict;
            for (const k of keys) {
                if (value && typeof value === 'object' && k in value) {
                    value = value[k];
                } else {
                    return key;
                }
            }
            return typeof value === 'string' ? value : key;
        };
    }, [lang]);

    const value = useMemo(() => ({ lang, setLang, t, translations: translations[lang] }), [lang, t]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}