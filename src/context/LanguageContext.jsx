import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const translations = {
    es: {
        // Navigation
        nav_home: 'INICIO',
        nav_metrics: 'MÉTRICAS',
        nav_projects: 'PROYECTOS',
        nav_toolkit: 'TOOLKIT',
        nav_architecture: 'ARQUITECTURA',
        nav_leadership: 'LIDERAZGO',
        nav_contact: 'CONTACTO',
        lang_es: 'ES',
        lang_en: 'EN',

        // Footer
        footer_tagline: 'Ingeniería de datos, visualización 3D e IA para entornos industriales.',
        footer_contact: 'Contacto directo',
        footer_access: 'Accesos',
        footer_networks: 'Redes',
        footer_rights: 'Política de Tratamiento de Datos (Ley 1581 de 2012) | © 2026 Xlerion',
        footer_claim: 'Transformando datos en inteligencia visual.',
        footer_access_home: 'Inicio',
        footer_access_metrics: 'Métricas',
        footer_access_projects: 'Proyectos',
        footer_access_toolkit: 'Toolkit',
        footer_access_architecture: 'Arquitectura',
        footer_access_leadership: 'Liderazgo',
        footer_access_contact: 'Contacto',

        // Hero Section
        hero_badge: 'DEEPTECH INDUSTRIAL: MINERÍA • MANUFACTURA • SMART CITIES',
        hero_title: 'Transforme sus datos en Inteligencia Visual 3D y Plataformas de IA en Tiempo Real',
        hero_subtitle: 'Ingeniero Senior Full-Stack con más de 10 años de experiencia construyendo arquitecturas escalables donde los datos en tiempo real cobran vida en visualización 3D interactiva (Three.js) e integración de IA (RAG/LangChain).',
        hero_cta_primary: 'Solicitar Prueba de Concepto (PoC)',
        hero_cta_secondary: 'Ver Proyectos en GitHub',
        hero_scroll: 'Explorar proyectos',
        hero_corner_top: '+ XLERION_VIEWPORT // WEBGL_ACTIVE',
        hero_corner_bottom: "COORD_LATAM [04°42'N 74°04'W]",

        // Metrics Section
        metrics_subtitle: 'Métricas de Impacto',
        metrics_title: 'Barra de Confianza: Resultados Auditados',
        metrics_intro: 'Cuatro métricas clave de mi trayectoria, auditadas y verificadas en proyectos reales de DeepTech industrial.',
        metrics_kpis_title: 'KPIs Auditados',
        metrics_expand: 'Detalles',
        metrics_collapse: 'Ocultar',
        metrics_case_label: 'Caso',
        metrics_items: [
            {
                id: 'decision-time',
                icon: 'Clock',
                value: '-60%',
                label: 'Tiempo de toma de decisiones',
                caseStudy: 'Para 12+ administradores municipales, Plataforma FOVIS',
            },
            {
                id: 'analysis-time',
                icon: 'Brain',
                value: '-40%',
                label: 'Tiempo de análisis de datos complejos',
                caseStudy: 'Visualización 3D para estrategias neurocientíficas, AONC',
            },
            {
                id: 'pipeline-export',
                icon: 'Server',
                value: '-80%',
                label: 'Tiempo de exportación de pipelines 3D',
                caseStudy: 'Mediante suite de automatización personalizada con MaxScript',
            },
            {
                id: 'telemetry-uptime',
                icon: 'Activity',
                value: '99%',
                label: 'Uptime en ingesta de telemetría',
                caseStudy: 'Arquitectura tolerante a fallos con persistencia local',
            },
        ],

        // Case Studies / Projects Section
        projects_subtitle: 'Validación en Terreno & ROI Verificado',
        projects_title: 'Proyectos Destacados',
        projects_intro: 'Tres arquitecturas DeepTech industriales con resultados medidos y auditados en producción.',
        projects_filter_label: 'Filtrar por industria',
        projects_filters: [
            { id: 'all', label: 'Todos' },
            { id: 'manufactura', label: 'Manufactura' },
            { id: 'mineria', label: 'Minería' },
            { id: 'smart-cities', label: 'Smart Cities' },
        ],
        projects_challenge_label: 'El Reto',
        projects_solution_label: 'La Solución',
        projects_impact_label: 'El Impacto',
        projects_cta: 'Ver ficha técnica completa',
        projects_empty: 'No hay casos registrados para esta industria.',
        projects_cases: [
            {
                id: 'smartfactory-3d',
                industry: 'manufactura',
                industryLabel: 'Manufactura',
                title: 'SmartFactory 3D — Gemelo Digital Industrial',
                tagline: 'Monitoreo de telemetría industrial en tiempo real y mantenimiento predictivo.',
                clientCategory: 'Sector Industrial Pesado & Minería',
                image: '/images/deeptech/u2-smartfactory-twin.jpg',
                roiTimeline: 'ROI en 4.2 meses',
                challenge: 'Monitoreo de telemetría industrial en tiempo real y mantenimiento predictivo.',
                solution: 'Plataforma Full-Stack que sostiene >100 mensajes/segundo vía WebSockets manteniendo 60 FPS. Incluye detección de anomalías Z-score (NumPy) y autenticación JWT RBAC.',
                impact: 'Plataforma Full-Stack que sostiene >100 mensajes/segundo vía WebSockets manteniendo 60 FPS. Incluye detección de anomalías Z-score (NumPy) y autenticación JWT RBAC.',
                metrics: [
                    { value: '>100 msg/s', label: 'Throughput WebSockets' },
                    { value: '60 FPS', label: 'Renderizado 3D' },
                    { value: 'Z-score', label: 'Detección anomalías' },
                    { value: 'JWT RBAC', label: 'Autenticación' },
                ],
                techStack: ['React 18', 'Three.js', 'FastAPI', 'Python 3.11', 'WebSockets', 'Docker Compose'],
            },
            {
                id: 'enterprise-rag',
                industry: 'mineria',
                industryLabel: 'Minería',
                title: 'Enterprise RAG Assistant',
                tagline: 'Reducir el tiempo de búsqueda en bases de conocimiento corporativas con estructuras de datos no uniformes (legal, operaciones).',
                clientCategory: 'Compañía Multinacional de Energía y Operaciones',
                image: '/images/deeptech/u1-enterprise-rag.jpg',
                roiTimeline: 'Ahorro de 1.200 h/hombre al mes',
                challenge: 'Reducir el tiempo de búsqueda en bases de conocimiento corporativas con estructuras de datos no uniformes (legal, operaciones).',
                solution: 'Procesamiento asincrónico de PDFs, chunking semántico y búsqueda híbrida (vectorial + léxica) con re-ranking para prevenir alucinaciones de IA.',
                impact: 'Procesamiento asincrónico de PDFs, chunking semántico y búsqueda híbrida (vectorial + léxica) con re-ranking para prevenir alucinaciones de IA.',
                metrics: [
                    { value: 'Async', label: 'Procesamiento PDFs' },
                    { value: 'Semántico', label: 'Chunking' },
                    { value: 'Híbrida', label: 'Búsqueda vectorial+léxica' },
                    { value: 'Re-ranking', label: 'Anti-alucinaciones' },
                ],
                techStack: ['Python', 'Django/DRF', 'LangChain', 'PostgreSQL (pgvector)', 'Celery + Redis', 'Docker'],
            },
            {
                id: 'iot-telemetry-resilient',
                industry: 'smart-cities',
                industryLabel: 'Smart Cities',
                title: 'IoT Telemetry Resilient Backend',
                tagline: 'Ingesta de datos de sensores industriales en entornos con conectividad intermitente.',
                clientCategory: 'Entidad de Gobierno & Gestión Territorial',
                image: '/images/deeptech/u2-fovis-telemetry.jpg',
                roiTimeline: 'Operativo en 8 semanas',
                challenge: 'Ingesta de datos de sensores industriales en entornos con conectividad intermitente.',
                solution: 'Diseño tolerante a fallos con persistencia local (buffering), garantizando 99% de uptime bajo tráfico concurrente simulado.',
                impact: 'Diseño tolerante a fallos con persistencia local (buffering), garantizando 99% de uptime bajo tráfico concurrente simulado.',
                metrics: [
                    { value: '99%', label: 'Uptime telemetría' },
                    { value: 'Buffering', label: 'Persistencia local' },
                    { value: 'Atómica', label: 'Reconciliación transaccional' },
                    { value: 'Simulado', label: 'Tráfico concurrente' },
                ],
                techStack: ['Python (Asyncio)', 'Node.js', 'WebSockets/MQTT', 'PostgreSQL', 'Linux SysAdmin', 'Docker'],
            },
        ],

        // Toolkit Section
        toolkit_subtitle: 'Entorno Modular Propietario',
        toolkit_title: 'Xlerion Core Toolkit',
        toolkit_description: 'Entorno modular propietario para el diagnóstico y validación de sistemas técnicos. Incluye logging estructurado en JSON, comparadores de rendimiento, diagnóstico previo a tareas críticas y preservación de convenciones para garantizar la escalabilidad documental y operativa en pipelines empresariales.',
        toolkit_modules: [
            {
                icon: 'Code2',
                title: 'Logging Estructurado JSON',
                description: 'Logging estructurado en formato JSON para trazabilidad completa y debugging automatizado en pipelines distribuidos.',
            },
            {
                icon: 'BarChart2',
                title: 'Comparadores de Rendimiento',
                description: 'Benchmarks automatizados con métricas de latencia, throughput y uso de recursos para validación de rendimiento.',
            },
            {
                icon: 'Zap',
                title: 'Diagnóstico Pre-tarea',
                description: 'Validación automática de precondiciones antes de ejecutar tareas críticas en pipelines de producción.',
            },
            {
                icon: 'FileText',
                title: 'Preservación de Convenciones',
                description: 'Enforcement automático de convenciones de código, naming y arquitectura para escalabilidad documental.',
            },
            {
                icon: 'Cpu',
                title: 'Diagnóstico de Rendimiento',
                description: 'Profiling continuo y detección de cuellos de botella en tiempo real para pipelines críticos.',
            },
            {
                icon: 'Shield',
                title: 'Validación de Escalabilidad',
                description: 'Pruebas de carga y estrés automatizadas para garantizar escalabilidad documental y operativa.',
            },
        ],
        toolkit_cta: 'Solicitar Acceso al Toolkit',

        // Tech Stack & Security Section
        techstack_subtitle: 'Ingeniería de Nivel Empresarial',
        techstack_title: 'Stack Tecnológico y Estándares de Seguridad',
        techstack_intro: 'No utilizamos librerías experimentales ni dependencias frágiles. Cada componente del stack fue seleccionado por su tolerancia a fallos, soporte a largo plazo y rendimiento a escala industrial.',
        techstack_stack_heading: 'Stack Tecnológico por Capas',
        techstack_stack_intro: 'Arquitecturas modulares que cubren la visualización, la ingesta de datos, la inteligencia y el despliegue en infraestructura crítica.',
        techstack_stack_note: 'Auditoría CI/CD, tipado estricto y versiones con soporte a largo plazo (LTS).',
        techstack_categories: [
            {
                icon: 'Box',
                title: 'Visualización 3D & Frontend',
                description: 'Renderizado web acelerado por GPU, sin instalación de ejecutables locales.',
                techs: [
                    { name: 'React', role: 'Arquitectura UI / SPA reactiva', badge: 'Frontend' },
                    { name: 'Three.js', role: 'Motor WebGL 2.0 y shaders', badge: 'Core 3D' },
                    { name: 'Draco', role: 'Compresión geométrica glTF', badge: 'Rendimiento' },
                ],
            },
            {
                icon: 'Server',
                title: 'Backend, Ingesta & IoT',
                description: 'Servicios asíncronos de baja latencia y protocolos industriales.',
                techs: [
                    { name: 'FastAPI', role: 'APIs asíncronas en Python', badge: 'Backend' },
                    { name: 'Python', role: 'Pipelines de datos y lógica numérica', badge: 'Lenguaje' },
                    { name: 'WebSockets', role: 'Streaming full-duplex bidireccional', badge: 'Streaming' },
                    { name: 'MQTT', role: 'Telemetría ligera para IoT industrial', badge: 'Protocolo IoT' },
                ],
            },
            {
                icon: 'Database',
                title: 'Datos, Vectores & IA',
                description: 'Almacenamiento híbrido para series de tiempo y embeddings semánticos.',
                techs: [
                    { name: 'pgvector', role: 'Embeddings vectoriales sobre PostgreSQL', badge: 'Vector DB' },
                    { name: 'LangChain', role: 'Orquestación de agentes y RAG', badge: 'IA' },
                    { name: 'TimescaleDB', role: 'Series de tiempo para telemetría', badge: 'Time-Series' },
                ],
            },
            {
                icon: 'Cloud',
                title: 'Infraestructura & Despliegue',
                description: 'Contenerización portable para nube privada, On-Premise o borde.',
                techs: [
                    { name: 'Docker', role: 'Contenedores inmutables', badge: 'DevOps' },
                    { name: 'Kubernetes', role: 'Orquestación y alta disponibilidad', badge: 'Cloud Native' },
                    { name: 'Linux / Arm64', role: 'Gateways embebidos de planta', badge: 'Hardware Edge' },
                ],
            },
        ],
        techstack_security_heading: 'Seguridad y Cumplimiento',
        techstack_security_intro: 'Diseñamos arquitecturas para la confianza de CTOs y auditores de TI en infraestructura crítica.',
        techstack_badge_ley: 'LEY 1581 COLOMBIA',
        techstack_panel_tag: 'Control de arquitectura verificado',
        techstack_controls: [
            {
                id: 'encryption',
                icon: 'Lock',
                title: 'Cifrado de datos en tránsito y reposo',
                badge: 'AES-256 & TLS 1.3',
                summary: 'Protección criptográfica de telemetría y conocimiento confidencial.',
                details: [
                    'TLS 1.3 con Perfect Forward Secrecy en HTTPS / WSS / MQTTS',
                    'Cifrado AES-256 en bases relacionales, vectoriales y de series',
                    'Gestión de claves con Vault / KMS corporativos',
                ],
            },
            {
                id: 'habeasdata',
                icon: 'FileCheck2',
                title: 'Cumplimiento de la Ley 1581 (Habeas Data)',
                badge: 'Ley 1581 de 2012 (Colombia)',
                summary: 'Garantía legal y técnica para el tratamiento de datos personales.',
                details: [
                    'Alineación con la Ley Estatutaria 1581 de 2012 y el Decreto 1377 de 2013',
                    'Anonimización de registros y ejercicio de derechos ARCO',
                    'Trazabilidad forense de cada operación',
                ],
            },
            {
                id: 'airgap',
                icon: 'Server',
                title: 'Aislamiento On-Premise y Redes Air-Gapped',
                badge: 'Air-Gap / Private VPC',
                summary: 'Operación autónoma sin dependencia de servicios públicos de terceros.',
                details: [
                    'Despliegue íntegro en la red local del cliente o VPC privada',
                    'Inferencia de IA y RAG sin APIs públicas externas',
                    'Integración segura con DMZ y firewalls industriales (Purdue)',
                ],
            },
        ],
        techstack_sovereignty: 'Soberanía total de datos: despliegue On-Premise o VPC privada.',
        techstack_cta: 'Solicitar checklist de ciberseguridad',

        // Founder Leadership Section
        founder_subtitle: 'Liderazgo Técnico & Founder-Market Fit',
        founder_title: 'Sobre el Fundador',
        founder_intro: 'Xlerion es liderada por Miguel E. Rodríguez, Ingeniero Full-Stack Senior con más de 10 años de experiencia construyendo arquitecturas escalables donde los datos en tiempo real cobran vida en visualización 3D interactiva (Three.js) e integración de IA (RAG/LangChain). Mi trabajo se define por resultados medibles en optimización de pipelines y resiliencia de datos.',
        founder_name: 'Miguel E. Rodriguez Martinez',
        founder_role: 'Senior Full-Stack Engineer & Fundador de Xlerion',
        founder_meta: 'Bogotá, Colombia',
        founder_portrait_alt: 'Retrato de Miguel E. Rodriguez Martinez, Fundador y Arquitecto Principal de Sistemas en Xlerion',
        founder_portrait_caption: 'Bogotá, Colombia • Liderazgo Full-Stack',
        founder_certs_label: 'Certificaciones',
        founder_certs: [
            {
                id: 'pmp',
                icon: 'Award',
                title: 'PMP® Project Management Professional',
                issuer: 'PMI',
                year: '2020',
                description: 'Project Management Professional certificado por PMI.',
                tone: 'border-amber-500/30 bg-amber-500/[0.05] text-amber-300',
            },
            {
                id: 'uci',
                icon: 'GraduationCap',
                title: 'AI/GenAI Specialization (with Honors)',
                issuer: 'UC Irvine',
                year: '2024',
                description: 'Especialización en IA/GenAI con honores por UC Irvine.',
                tone: 'border-[#00e9fa]/30 bg-[#00e9fa]/[0.05] text-[#00e9fa]',
            },
            {
                id: 'ibm',
                icon: 'Shield',
                title: 'AI Developer Professional',
                issuer: 'IBM Watson',
                year: '2018',
                description: 'Desarrollador Profesional de IA certificado por IBM Watson.',
                tone: 'border-blue-500/30 bg-blue-500/[0.05] text-blue-300',
            },
        ],
        founder_cta: 'Agendar llamada de arquitectura',

        // Contact / PoC Section
        contact_subtitle: 'Contacto & Prueba de Concepto',
        contact_title: 'Inicie su Prueba de Concepto Técnica',
        contact_commitment_title: 'Compromiso de respuesta técnica',
        contact_commitment_desc: 'Cada solicitud es analizada directamente por nuestro equipo de arquitectura. Recibirá una respuesta técnica estructurada en menos de 24 horas hábiles.',
        contact_channel_label: 'Canal corporativo',
        contact_channel_value: 'xlerionultimate@gmail.com',
        contact_hq_label: 'Sede principal',
        contact_hq_value: 'Bogotá / Nocaima, Cundinamarca, Colombia',
        contact_sla_label: 'SLA de respuesta',
        contact_sla_value: '< 24 horas hábiles',
        contact_nda_label: 'NDA opcional',
        contact_nda_value: 'Firmamos Acuerdo de Confidencialidad mutuo antes de compartir planos, redes o telemetría de planta.',
        contact_brief_title: 'Ficha Técnica Ejecutiva',
        contact_brief_desc: 'Documento de arquitectura B2B v4.2',
        contact_brief_cta: 'Descargar ficha técnica ejecutiva (PDF)',
        contact_legal_notice: 'Política de Tratamiento de Datos (Ley 1581 de 2012) | © 2026 Xlerion',
        contact_form_title: 'Formulario de evaluación de proyecto',
        contact_form_subtitle: 'Campos requeridos para preparar la sesión técnica',
        contact_form_name: 'Nombre',
        contact_form_company: 'Empresa',
        contact_form_email: 'Correo corporativo',
        contact_form_role: 'Cargo',
        contact_form_sector: 'Sector',
        contact_form_interest: 'Línea de interés',
        contact_form_challenge: '¿Cuál es su mayor desafío con los datos?',
        contact_form_name_ph: 'Ej. Ing. Carlos Mendoza',
        contact_form_company_ph: 'Ej. Minera Andina S.A.',
        contact_form_email_ph: 'nombre@empresa.com',
        contact_form_role_ph: 'Ej. CTO / Gerente de Planta / Director TI',
        contact_form_challenge_ph: 'Ej. Reportes entre plantas con alta latencia o dificultad para consultar 40.000 manuales técnicos sin alucinaciones...',
        contact_form_consent: 'Autorizo el tratamiento de mis datos personales conforme a la Ley 1581 de 2012.',
        contact_form_submit: 'Solicitar Prueba de Concepto (PoC)',
        contact_form_submitting: 'Procesando solicitud técnica...',
        contact_success_ticket: 'Ticket generado',
        contact_success_title: 'Solicitud de PoC registrada exitosamente',
        contact_success_thanks: 'Gracias,',
        contact_success_architect: 'Hemos asignado su desafío técnico al equipo de arquitectura de Xlerion y le contactaremos en menos de 24 horas hábiles.',
        contact_summary_title: 'Resumen del requerimiento',
        contact_sum_sector: 'Sector',
        contact_sum_line: 'Línea',
        contact_sum_sla: 'SLA de contacto',
        contact_sum_sla_value: '< 24h hábiles',
        contact_success_brief: 'Descargar ficha técnica',
        contact_success_new: 'Nueva consulta',

        // Form options
        contact_sectors: [
            { value: 'manufactura', label: 'Manufactura' },
            { value: 'mineria', label: 'Minería' },
            { value: 'smart-cities', label: 'Smart Cities' },
            { value: 'energia', label: 'Energía' },
            { value: 'logistica', label: 'Logística' },
            { value: 'otro', label: 'Otro' },
        ],
        contact_interests: [
            { value: 'digital-twins', label: 'Gemelos Digitales & 3D' },
            { value: 'rag', label: 'Plataformas RAG/IA' },
            { value: 'iot', label: 'Telemetría IoT' },
            { value: 'consulting', label: 'Consultoría' },
        ],

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
        nav_metrics: 'METRICS',
        nav_projects: 'PROJECTS',
        nav_toolkit: 'TOOLKIT',
        nav_architecture: 'ARCHITECTURE',
        nav_leadership: 'LEADERSHIP',
        nav_contact: 'CONTACT',
        lang_es: 'ES',
        lang_en: 'EN',

        // Footer
        footer_tagline: 'Data engineering, 3D visualization & AI for industrial environments.',
        footer_contact: 'Direct contact',
        footer_access: 'Access',
        footer_networks: 'Networks',
        footer_rights: 'Data Processing Policy (Law 1581 of 2012) | © 2026 Xlerion',
        footer_claim: 'Transforming data into visual intelligence.',
        footer_access_home: 'Home',
        footer_access_metrics: 'Metrics',
        footer_access_projects: 'Projects',
        footer_access_toolkit: 'Toolkit',
        footer_access_architecture: 'Architecture',
        footer_access_leadership: 'Leadership',
        footer_access_contact: 'Contact',

        // Hero Section
        hero_badge: 'INDUSTRIAL DEEPTECH: MINING • MANUFACTURING • SMART CITIES',
        hero_title: 'Transform Your Data into 3D Visual Intelligence and Real-Time AI Platforms',
        hero_subtitle: 'Senior Full-Stack Engineer with 10+ years of experience building scalable architectures where real-time data comes alive through interactive 3D visualization (Three.js) and AI integration (RAG/LangChain).',
        hero_cta_primary: 'Request Proof of Concept (PoC)',
        hero_cta_secondary: 'View Projects on GitHub',
        hero_scroll: 'Explore Projects',
        hero_corner_top: '+ XLERION_VIEWPORT // WEBGL_ACTIVE',
        hero_corner_bottom: "COORD_LATAM [04°42'N 74°04'W]",

        // Metrics Section
        metrics_subtitle: 'Impact Metrics',
        metrics_title: 'Trust Bar: Audited Results',
        metrics_intro: 'Four key metrics from my track record, audited and verified in real DeepTech industrial projects.',
        metrics_kpis_title: 'Audited KPIs',
        metrics_expand: 'Details',
        metrics_collapse: 'Hide',
        metrics_case_label: 'Case',
        metrics_items: [
            {
                id: 'decision-time',
                icon: 'Clock',
                value: '-60%',
                label: 'Decision-making time',
                caseStudy: 'For 12+ municipal administrators, FOVIS Platform',
            },
            {
                id: 'analysis-time',
                icon: 'Brain',
                value: '-40%',
                label: 'Complex data analysis time',
                caseStudy: '3D visualization for neuroscientific strategies, AONC',
            },
            {
                id: 'pipeline-export',
                icon: 'Server',
                value: '-80%',
                label: '3D pipeline export time',
                caseStudy: 'Via custom MaxScript automation suite',
            },
            {
                id: 'telemetry-uptime',
                icon: 'Activity',
                value: '99%',
                label: 'Telemetry ingestion uptime',
                caseStudy: 'Fault-tolerant architecture with local persistence',
            },
        ],

        // Case Studies / Projects Section
        projects_subtitle: 'Field Validation & Verified ROI',
        projects_title: 'Featured Projects',
        projects_intro: 'Three industrial DeepTech architectures with measured and audited results in production.',
        projects_filter_label: 'Filter by industry',
        projects_filters: [
            { id: 'all', label: 'All' },
            { id: 'manufactura', label: 'Manufacturing' },
            { id: 'mineria', label: 'Mining' },
            { id: 'smart-cities', label: 'Smart Cities' },
        ],
        projects_challenge_label: 'The Challenge',
        projects_solution_label: 'The Solution',
        projects_impact_label: 'The Impact',
        projects_cta: 'View full technical brief',
        projects_empty: 'No case studies registered for this industry.',
        projects_cases: [
            {
                id: 'smartfactory-3d',
                industry: 'manufactura',
                industryLabel: 'Manufacturing',
                title: 'SmartFactory 3D — Industrial Digital Twin',
                tagline: 'Real-time industrial telemetry monitoring and predictive maintenance.',
                clientCategory: 'Heavy Industrial Sector & Mining',
                image: '/images/deeptech/u2-smartfactory-twin.jpg',
                roiTimeline: 'ROI in 4.2 months',
                challenge: 'Real-time industrial telemetry monitoring and predictive maintenance.',
                solution: 'Full-Stack platform sustaining >100 messages/second via WebSockets maintaining 60 FPS. Includes Z-score anomaly detection (NumPy) and JWT RBAC authentication.',
                impact: 'Full-Stack platform sustaining >100 messages/second via WebSockets maintaining 60 FPS. Includes Z-score anomaly detection (NumPy) and JWT RBAC authentication.',
                metrics: [
                    { value: '>100 msg/s', label: 'WebSocket Throughput' },
                    { value: '60 FPS', label: '3D Rendering' },
                    { value: 'Z-score', label: 'Anomaly Detection' },
                    { value: 'JWT RBAC', label: 'Authentication' },
                ],
                techStack: ['React 18', 'Three.js', 'FastAPI', 'Python 3.11', 'WebSockets', 'Docker Compose'],
            },
            {
                id: 'enterprise-rag',
                industry: 'mineria',
                industryLabel: 'Mining',
                title: 'Enterprise RAG Assistant',
                tagline: 'Reduce search time in corporate knowledge bases with non-uniform data structures (legal, operations).',
                clientCategory: 'Multinational Energy & Operations Company',
                image: '/images/deeptech/u1-enterprise-rag.jpg',
                roiTimeline: 'Saves 1,200 man-hours/month',
                challenge: 'Reduce search time in corporate knowledge bases with non-uniform data structures (legal, operations).',
                solution: 'Async PDF processing, semantic chunking, hybrid search (vector + lexical) with re-ranking to prevent AI hallucinations.',
                impact: 'Async PDF processing, semantic chunking, hybrid search (vector + lexical) with re-ranking to prevent AI hallucinations.',
                metrics: [
                    { value: 'Async', label: 'PDF Processing' },
                    { value: 'Semantic', label: 'Chunking' },
                    { value: 'Hybrid', label: 'Vector+Lexical Search' },
                    { value: 'Re-ranking', label: 'Anti-Hallucination' },
                ],
                techStack: ['Python', 'Django/DRF', 'LangChain', 'PostgreSQL (pgvector)', 'Celery + Redis', 'Docker'],
            },
            {
                id: 'iot-telemetry-resilient',
                industry: 'smart-cities',
                industryLabel: 'Smart Cities',
                title: 'IoT Telemetry Resilient Backend',
                tagline: 'Industrial sensor data ingestion in environments with intermittent connectivity.',
                clientCategory: 'Government Entity & Territorial Management',
                image: '/images/deeptech/u2-fovis-telemetry.jpg',
                roiTimeline: 'Live in 8 weeks',
                challenge: 'Industrial sensor data ingestion in environments with intermittent connectivity.',
                solution: 'Fault-tolerant design with local persistence (buffering), guaranteeing 99% uptime under simulated concurrent traffic.',
                impact: 'Fault-tolerant design with local persistence (buffering), guaranteeing 99% uptime under simulated concurrent traffic.',
                metrics: [
                    { value: '99%', label: 'Telemetry Uptime' },
                    { value: 'Buffering', label: 'Local Persistence' },
                    { value: 'Atomic', label: 'Transactional Reconciliation' },
                    { value: 'Simulated', label: 'Concurrent Traffic' },
                ],
                techStack: ['Python (Asyncio)', 'Node.js', 'WebSockets/MQTT', 'PostgreSQL', 'Linux SysAdmin', 'Docker'],
            },
        ],

        // Toolkit Section
        toolkit_subtitle: 'Proprietary Modular Environment',
        toolkit_title: 'Xlerion Core Toolkit',
        toolkit_description: 'Proprietary modular environment for technical system diagnosis and validation. Includes structured JSON logging, performance comparators, pre-task critical diagnostics, and convention preservation to ensure documentary and operational scalability in enterprise pipelines.',
        toolkit_modules: [
            {
                icon: 'Code2',
                title: 'Structured JSON Logging',
                description: 'Structured JSON logging for full traceability and automated debugging in distributed pipelines.',
            },
            {
                icon: 'BarChart2',
                title: 'Performance Comparators',
                description: 'Automated benchmarks with latency, throughput, and resource usage metrics for performance validation.',
            },
            {
                icon: 'Zap',
                title: 'Pre-task Diagnostics',
                description: 'Automated pre-condition validation before executing critical tasks in production pipelines.',
            },
            {
                icon: 'FileText',
                title: 'Convention Preservation',
                description: 'Automated enforcement of code, naming, and architecture conventions for documentary scalability.',
            },
            {
                icon: 'Cpu',
                title: 'Performance Diagnostics',
                description: 'Continuous profiling and real-time bottleneck detection for critical pipelines.',
            },
            {
                icon: 'Shield',
                title: 'Scalability Validation',
                description: 'Automated load and stress testing to ensure documentary and operational scalability.',
            },
        ],
        toolkit_cta: 'Request Toolkit Access',

        // Tech Stack & Security Section
        techstack_subtitle: 'Enterprise-Grade Engineering',
        techstack_title: 'Technology Stack and Security Standards',
        techstack_intro: 'We do not rely on experimental libraries or fragile dependencies. Every stack component was selected for fault tolerance, long-term support and industrial-scale performance.',
        techstack_stack_heading: 'Layered Technology Stack',
        techstack_stack_intro: 'Modular architectures covering visualization, data ingestion, intelligence and deployment on critical infrastructure.',
        techstack_stack_note: 'CI/CD auditing, strict typing and long-term support (LTS) versions.',
        techstack_categories: [
            {
                icon: 'Box',
                title: '3D Visualization & Frontend',
                description: 'GPU-accelerated web rendering with no local executables to install.',
                techs: [
                    { name: 'React', role: 'Reactive UI / SPA architecture', badge: 'Frontend' },
                    { name: 'Three.js', role: 'WebGL 2.0 engine and shaders', badge: 'Core 3D' },
                    { name: 'Draco', role: 'glTF geometry compression', badge: 'Performance' },
                ],
            },
            {
                icon: 'Server',
                title: 'Backend, Ingestion & IoT',
                description: 'Low-latency asynchronous services and industrial protocols.',
                techs: [
                    { name: 'FastAPI', role: 'Asynchronous Python APIs', badge: 'Backend' },
                    { name: 'Python', role: 'Data pipelines and numeric logic', badge: 'Language' },
                    { name: 'WebSockets', role: 'Full-duplex bidirectional streaming', badge: 'Streaming' },
                    { name: 'MQTT', role: 'Lightweight industrial IoT telemetry', badge: 'IoT Protocol' },
                ],
            },
            {
                icon: 'Database',
                title: 'Data, Vectors & AI',
                description: 'Hybrid storage for time series and semantic embeddings.',
                techs: [
                    { name: 'pgvector', role: 'Vector embeddings on PostgreSQL', badge: 'Vector DB' },
                    { name: 'LangChain', role: 'Agent and RAG orchestration', badge: 'AI' },
                    { name: 'TimescaleDB', role: 'Time series for telemetry', badge: 'Time-Series' },
                ],
            },
            {
                icon: 'Cloud',
                title: 'Infrastructure & Deployment',
                description: 'Portable containerization for private cloud, on-premise or edge.',
                techs: [
                    { name: 'Docker', role: 'Immutable containers', badge: 'DevOps' },
                    { name: 'Kubernetes', role: 'Orchestration and high availability', badge: 'Cloud Native' },
                    { name: 'Linux / Arm64', role: 'Embedded plant gateways', badge: 'Edge Hardware' },
                ],
            },
        ],
        techstack_security_heading: 'Security and Compliance',
        techstack_security_intro: 'We design architectures for the trust of CTOs and IT auditors on critical infrastructure.',
        techstack_badge_ley: 'LAW 1581 COLOMBIA',
        techstack_panel_tag: 'Verified architecture control',
        techstack_controls: [
            {
                id: 'encryption',
                icon: 'Lock',
                title: 'Data encryption in transit and at rest',
                badge: 'AES-256 & TLS 1.3',
                summary: 'Cryptographic protection of telemetry and confidential knowledge.',
                details: [
                    'TLS 1.3 with Perfect Forward Secrecy on HTTPS / WSS / MQTTS',
                    'AES-256 encryption across relational, vector and time-series stores',
                    'Key management with corporate Vault / KMS',
                ],
            },
            {
                id: 'habeasdata',
                icon: 'FileCheck2',
                title: 'Compliance with Law 1581 (Habeas Data)',
                badge: 'Colombian Law 1581 of 2012',
                summary: 'Legal and technical assurance for personal data processing.',
                details: [
                    'Alignment with Statutory Law 1581 of 2012 and Decree 1377 of 2013',
                    'Record anonymization and ARCO data-subject rights',
                    'Forensic traceability of every operation',
                ],
            },
            {
                id: 'airgap',
                icon: 'Server',
                title: 'On-Premise isolation and Air-Gapped networks',
                badge: 'Air-Gap / Private VPC',
                summary: 'Autonomous operation with no dependency on third-party public services.',
                details: [
                    'Full deployment inside the client network or a private VPC',
                    'AI and RAG inference without external public APIs',
                    'Secure integration with DMZ and industrial firewalls (Purdue)',
                ],
            },
        ],
        techstack_sovereignty: 'Full data sovereignty: on-premise or private VPC deployment.',
        techstack_cta: 'Request the cybersecurity checklist',

        // Founder Leadership Section
        founder_subtitle: 'Technical Leadership & Founder-Market Fit',
        founder_title: 'About the Founder',
        founder_intro: 'Xlerion is led by Miguel E. Rodriguez Martinez, Senior Full-Stack Engineer with 10+ years of experience building scalable architectures where real-time data comes alive through interactive 3D visualization (Three.js) and AI integration (RAG/LangChain). My work is defined by measurable results in pipeline optimization and data resilience.',
        founder_name: 'Miguel E. Rodriguez Martinez',
        founder_role: 'Senior Full-Stack Engineer & Founder of Xlerion',
        founder_meta: 'Bogotá, Colombia',
        founder_portrait_alt: 'Portrait of Miguel E. Rodriguez Martinez, Founder and Principal Systems Architect at Xlerion',
        founder_portrait_caption: 'Bogotá, Colombia • Full-Stack Leadership',
        founder_certs_label: 'Credentials & Certifications',
        founder_certs: [
            {
                id: 'pmp',
                icon: 'Award',
                title: 'PMP® Project Management Professional',
                issuer: 'PMI',
                year: '2020',
                description: 'Project Management Professional certified by PMI.',
                tone: 'border-amber-500/30 bg-amber-500/[0.05] text-amber-300',
            },
            {
                id: 'uci',
                icon: 'GraduationCap',
                title: 'AI/GenAI Specialization (with Honors)',
                issuer: 'UC Irvine',
                year: '2024',
                description: 'AI/GenAI Specialization with Honors from UC Irvine.',
                tone: 'border-[#00e9fa]/30 bg-[#00e9fa]/[0.05] text-[#00e9fa]',
            },
            {
                id: 'ibm',
                icon: 'Shield',
                title: 'AI Developer Professional',
                issuer: 'IBM Watson',
                year: '2018',
                description: 'AI Developer Professional certified by IBM Watson.',
                tone: 'border-blue-500/30 bg-blue-500/[0.05] text-blue-300',
            },
        ],
        founder_cta: 'Schedule an architecture call',

        // Contact / PoC Section
        contact_subtitle: 'Contact & Proof of Concept',
        contact_title: 'Start Your Technical Proof of Concept',
        contact_commitment_title: 'Technical response commitment',
        contact_commitment_desc: 'Every request is reviewed directly by our architecture team. You will receive a structured technical response in under 24 business hours.',
        contact_channel_label: 'Corporate channel',
        contact_channel_value: 'xlerionultimate@gmail.com',
        contact_hq_label: 'Headquarters',
        contact_hq_value: 'Bogotá / Nocaima, Cundinamarca, Colombia',
        contact_sla_label: 'Response SLA',
        contact_sla_value: '< 24 business hours',
        contact_nda_label: 'Optional NDA',
        contact_nda_value: 'We sign a mutual Confidentiality Agreement before sharing blueprints, network diagrams or plant telemetry.',
        contact_brief_title: 'Executive Technical Brief',
        contact_brief_desc: 'B2B architecture document v4.2',
        contact_brief_cta: 'Download executive technical brief (PDF)',
        contact_legal_notice: 'Política de Tratamiento de Datos (Ley 1581 de 2012) | © 2026 Xlerion',
        contact_form_title: 'Project evaluation form',
        contact_form_subtitle: 'Required fields to prepare the technical session',
        contact_form_name: 'Name',
        contact_form_company: 'Company',
        contact_form_email: 'Corporate email',
        contact_form_role: 'Role',
        contact_form_sector: 'Industry',
        contact_form_interest: 'Area of interest',
        contact_form_challenge: 'What is your biggest data challenge today?',
        contact_form_name_ph: 'E.g. Eng. Carlos Mendoza',
        contact_form_company_ph: 'E.g. Andean Mining Corp.',
        contact_form_email_ph: 'name@company.com',
        contact_form_role_ph: 'E.g. CTO / Plant Manager / IT Director',
        contact_form_challenge_ph: 'E.g. High-latency reports across plants, or querying 40,000 technical manuals without hallucinations...',
        contact_form_consent: 'I authorize the processing of my personal data under Colombian Law 1581 of 2012.',
        contact_form_submit: 'Request Proof of Concept (PoC)',
        contact_form_submitting: 'Processing technical request...',
        contact_success_ticket: 'Ticket generated',
        contact_success_title: 'PoC request successfully registered',
        contact_success_thanks: 'Thank you,',
        contact_success_architect: 'We have assigned your technical challenge to the Xlerion architecture team and will contact you within 24 business hours.',
        contact_summary_title: 'Request summary',
        contact_sum_sector: 'Industry',
        contact_sum_line: 'Area',
        contact_sum_sla: 'Contact SLA',
        contact_sum_sla_value: '< 24 business hours',
        contact_success_brief: 'Download technical brief',
        contact_success_new: 'New inquiry',

        // Form options
        contact_sectors: [
            { value: 'manufactura', label: 'Manufacturing' },
            { value: 'mineria', label: 'Mining' },
            { value: 'smart-cities', label: 'Smart Cities' },
            { value: 'energia', label: 'Energy' },
            { value: 'logistica', label: 'Logistics' },
            { value: 'otro', label: 'Other' },
        ],
        contact_interests: [
            { value: 'digital-twins', label: 'Digital Twins & 3D' },
            { value: 'rag', label: 'RAG/AI Platforms' },
            { value: 'iot', label: 'IoT Telemetry' },
            { value: 'consulting', label: 'Consulting' },
        ],

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