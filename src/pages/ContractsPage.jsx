import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import usePageSEO from '../hooks/usePageSEO';

const ACCESS_KEY = 'xlerion-2026-contratos';
const SESSION_KEY = 'xlerion_contracts_access';

const TEMPLATES = {
  ip_clause: {
    id: 'ip_clause',
    label: { es: 'Cláusula PI (Freelancer)', en: 'IP Clause (Freelancer)' },
    fileName: { es: 'clausula-propiedad-intelectual-freelancer', en: 'freelancer-ip-clause' },
    fields: [
      'CIUDAD',
      'FECHA',
      'NOMBRE_FREELANCER',
      'DOCUMENTO_FREELANCER',
      'CORREO_FREELANCER',
      'SERVICIO',
      'PROYECTO',
      'DURACION_MESES',
    ],
    content: {
      es: `CLÁUSULA DE PROPIEDAD INTELECTUAL Y OBRA POR ENCARGO
(Adaptada para contratación Freelancer)

Entre XLERION S.A.S., sociedad por acciones simplificada identificada con NIT 817.201.64, con domicilio en Cundinamarca, Colombia, representada legalmente por Miguel E. Rodríguez Martinez, en calidad de CEO & Lead Technical Architect (en adelante, "XLERION"), y [NOMBRE_FREELANCER], identificado(a) con [DOCUMENTO_FREELANCER], correo [CORREO_FREELANCER] (en adelante, el "CONTRATISTA"), se acuerda la presente cláusula, aplicable al servicio de [SERVICIO] dentro del proyecto [PROYECTO], en [CIUDAD], a [FECHA].

PRIMERA. OBJETO Y OBRA POR ENCARGO.
El CONTRATISTA desarrollará para XLERION los entregables, componentes, diseños, código, documentación, activos gráficos, audiovisuales, técnicos y/o digitales acordados. Las obras y resultados derivados del encargo se entienden realizados por encargo de XLERION, dentro del alcance contractual y con la finalidad de explotación por parte de XLERION.

SEGUNDA. TITULARIDAD Y CESIÓN DE DERECHOS PATRIMONIALES.
De conformidad con el Artículo 7 de la Ley 23 de 1982, la Decisión Andina 351 de 1993 y demás normas aplicables, el CONTRATISTA cede y transfiere a XLERION, a título de obra por encargo, los derechos patrimoniales sobre los entregables creados en ejecución del contrato, sin limitación territorial, por el plazo máximo permitido por la ley, y para todas las modalidades de explotación conocidas o por conocer, incluyendo reproducción, comunicación pública, distribución, transformación, adaptación, publicación, traducción, uso digital, incorporación en productos, licenciamiento a terceros y explotación comercial.

TERCERA. DERECHOS MORALES Y CRÉDITOS.
Los derechos morales del CONTRATISTA sobre las obras protegibles se respetarán conforme a la ley. XLERION reconocerá la autoría cuando sea razonable y aplicable según la naturaleza del entregable, sin que ello limite la explotación legítima de los derechos patrimoniales cedidos. El CONTRATISTA declara que no ha cedido ni cederá a terceros derechos incompatibles con la presente cláusula.

CUARTA. ORIGINALIDAD, PREEXISTENCIAS Y GARANTÍA.
El CONTRATISTA declara que los entregables serán originales o que cuenta con licencias suficientes para cualquier componente preexistente, de terceros, open source o stock incorporado. Toda preexistencia deberá informarse por escrito antes de su integración, indicando titular, licencia, alcance y restricciones. El CONTRATISTA mantendrá indemne a XLERION frente a reclamaciones por infracción de derechos de propiedad intelectual derivadas de los entregables.

QUINTA. CONFIDENCIALIDAD Y ENTREGA.
El CONTRATISTA mantendrá confidencial toda información técnica, comercial, estratégica o de negocio de XLERION a la que tenga acceso. Al finalizar el servicio o cuando XLERION lo solicite, entregará archivos fuente editables, exportaciones finales, documentación, accesos y materiales necesarios para el uso del entregable. La obligación de confidencialidad se mantendrá por [DURACION_MESES] meses después de la terminación del contrato, salvo información que deba permanecer reservada por ley o naturaleza.

NOTA DE IMPLEMENTACIÓN
- Empleado con contrato laboral: la titularidad patrimonial de obras creadas en ejercicio de funciones o por encargo del empleador se rige por el contrato laboral y la ley; se recomienda reforzar esta cláusula en el contrato laboral/anexo de funciones.
- Estudio externo / proveedor empresa: usar esta cláusula junto con contrato de prestación de servicios, anexos técnicos, aceptación de entregables y matriz de licencias/preexistencias.
- Validar con asesoría legal antes de firma en casos de alto valor, software crítico, cesión internacional o uso con terceros.

FIRMAS

XLERION S.A.S.                                CONTRATISTA
Nombre: Miguel E. Rodríguez Martinez          Nombre: [NOMBRE_FREELANCER]
Cargo: CEO & Lead Technical Architect          Documento: [DOCUMENTO_FREELANCER]
NIT: 817.201.64                                Correo: [CORREO_FREELANCER]
Fecha: [FECHA]                                 Fecha: [FECHA]`,
      en: `INTELLECTUAL PROPERTY AND WORK-FOR-HIRE CLAUSE
(Adapted for Freelancer Engagement)

Between XLERION S.A.S., simplified joint stock company, Tax ID (NIT) 817.201.64, domiciled in Cundinamarca, Colombia, legally represented by Miguel E. Rodríguez Martinez, CEO & Lead Technical Architect ("XLERION"), and [NOMBRE_FREELANCER], identified with [DOCUMENTO_FREELANCER], email [CORREO_FREELANCER] (the "CONTRACTOR"), this clause applies to [SERVICIO] services for project [PROYECTO], in [CIUDAD], on [FECHA].

FIRST. PURPOSE AND WORK FOR HIRE.
The CONTRACTOR will develop deliverables, components, designs, code, documentation, graphic, audiovisual, technical and/or digital assets agreed with XLERION. Works and results created under this engagement are understood as commissioned for XLERION.

SECOND. OWNERSHIP AND ASSIGNMENT OF ECONOMIC RIGHTS.
Pursuant to Article 7 of Colombian Law 23 of 1982, Andean Decision 351 of 1993, and applicable rules, the CONTRACTOR assigns and transfers to XLERION the economic rights over deliverables created under the contract, worldwide, for the maximum term allowed by law, for all known or future modes of exploitation.

THIRD. MORAL RIGHTS AND CREDIT.
The CONTRACTOR's moral rights shall be respected as required by law. XLERION will provide authorship credit where reasonable and applicable, without limiting lawful exploitation of assigned economic rights.

FOURTH. ORIGINALITY, PRE-EXISTING MATERIALS AND WARRANTY.
The CONTRACTOR warrants originality or sufficient licenses for any pre-existing, third-party, open-source or stock components. Pre-existing materials must be disclosed in writing before integration.

FIFTH. CONFIDENTIALITY AND DELIVERY.
The CONTRACTOR shall keep XLERION confidential information secret. Upon completion or request, the CONTRACTOR shall deliver editable source files, final exports, documentation, accesses and required materials. Confidentiality survives for [DURACION_MESES] months after termination.

IMPLEMENTATION NOTE
- Employee: reinforce under employment contract/labor law.
- External studio/vendor company: use with service agreement, technical annex, acceptance and license/pre-existing materials matrix.
- Seek legal review before signature for high-value, critical software, international assignment or third-party use.

SIGNATURES

XLERION S.A.S.                                CONTRACTOR
Name: Miguel E. Rodríguez Martinez          Name: [NOMBRE_FREELANCER]
Title: CEO & Lead Technical Architect         ID: [DOCUMENTO_FREELANCER]
NIT: 817.201.64                               Email: [CORREO_FREELANCER]
Date: [FECHA]                                 Date: [FECHA]`,
    },
  },
  technical_annex: {
    id: 'technical_annex',
    label: { es: 'Anexo Técnico No. 001', en: 'Technical Annex No. 001' },
    fileName: { es: 'anexo-tecnico-001', en: 'technical-annex-001' },
    fields: [
      'NUMERO_ANEXO',
      'FECHA',
      'NOMBRE_CLIENTE',
      'NOMBRE_CONTRATISTA',
      'PROYECTO',
      'ESPECIFICACIONES',
      'FECHA_HITO_1',
      'FECHA_HITO_2',
      'FECHA_HITO_3',
      'FECHA_HITO_4',
    ],
    content: {
      es: `ANEXO TÉCNICO No. [NUMERO_ANEXO]
CONTRATO DE PRESTACIÓN DE SERVICIOS / OBRA POR ENCARGO

Proyecto: [PROYECTO]
Fecha: [FECHA]
Cliente / Contratante: XLERION S.A.S. (NIT 817.201.64)
Contratista / Freelancer: [NOMBRE_CONTRATISTA]
Contacto cliente: [NOMBRE_CLIENTE]

1. ESPECIFICACIONES Y ALCANCE
[ESPECIFICACIONES]

El alcance incluye únicamente los entregables aprobados por escrito. Cualquier cambio de alcance, funcionalidad, formato o plazo debe formalizarse como ajuste al anexo.

2. INVENTARIO DE ACTIVOS ENTREGABLES
A-01: Archivos fuente editables (proyecto original / código / diseño).
A-02: Exportaciones finales en formatos acordados para uso operativo.
A-03: Documentación técnica breve (instalación, uso, dependencias o guía de entrega).
A-04: Recursos/preexistencias declaradas (fuentes, librerías, stock, plugins, plantillas) con licencia.
A-05: Evidencia de entrega y aceptación (acta, correo o registro de handoff).

3. CRÉDITOS Y HITOS DE PAGO (20 / 30 / 30 / 20)
Hito 1 - 20%: Inicio, levantamiento y especificación aprobada. Fecha estimada: [FECHA_HITO_1].
Hito 2 - 30%: Primera entrega funcional / avance validado. Fecha estimada: [FECHA_HITO_2].
Hito 3 - 30%: Ajustes, QA y versión candidata. Fecha estimada: [FECHA_HITO_3].
Hito 4 - 20%: Entrega final, documentación y aceptación. Fecha estimada: [FECHA_HITO_4].

Los pagos se realizan contra entrega del hito y aceptación escrita. La aceptación no exime garantía por errores atribuibles al CONTRATISTA dentro del periodo acordado.

4. CONFIDENCIALIDAD Y PROPIEDAD INTELECTUAL
Toda información, archivo, credencial, dato, diseño, código o material recibido o producido en el proyecto es confidencial. La propiedad intelectual se regirá por la cláusula de PI/obra por encargo y la ley aplicable (Ley 23 de 1982, Decisión Andina 351 de 1993).

5. CRITERIOS DE ACEPTACIÓN
- Cumplimiento de especificaciones aprobadas.
- Entrega de activos A-01 a A-05.
- Ausencia de infracciones conocidas de propiedad intelectual.
- Entrega de licencias/preexistencias declaradas.
- Aprobación escrita por XLERION.

NOTA DE IMPLEMENTACIÓN
- Empleado: anexar a contrato laboral/orden interna; verificar alcance de funciones y confidencialidad.
- Estudio externo: anexar a contrato de servicios; incluir responsable, canal de aprobación y control de cambios.
- Este documento es una plantilla operativa; debe revisarse con asesoría legal antes de su firma.

FIRMAS

Por XLERION S.A.S.                             Por CONTRATISTA
____________________________________           ____________________________________
Miguel E. Rodríguez Martinez                   [NOMBRE_CONTRATISTA]
CEO & Lead Technical Architect                 Contratista / Freelancer
NIT 817.201.64                                 Fecha: [FECHA]`,
      en: `TECHNICAL ANNEX No. [NUMERO_ANEXO]
SERVICE / WORK-FOR-HIRE AGREEMENT

Project: [PROYECTO]
Date: [FECHA]
Client: XLERION S.A.S. (NIT 817.201.64)
Contractor / Freelancer: [NOMBRE_CONTRATISTA]
Client contact: [NOMBRE_CLIENTE]

1. SPECIFICATIONS AND SCOPE
[ESPECIFICACIONES]

Only deliverables approved in writing are included. Any scope/feature/format/timeline change must be formalized as an annex update.

2. DELIVERABLE ASSET INVENTORY
A-01: Editable source files (original project/code/design).
A-02: Final exports in agreed formats for operational use.
A-03: Brief technical documentation (setup, use, dependencies or handoff guide).
A-04: Declared pre-existing resources (fonts, libraries, stock, plugins, templates) with licenses.
A-05: Delivery and acceptance evidence (record, email or handoff log).

3. CREDITS AND PAYMENT MILESTONES (20 / 30 / 30 / 20)
Milestone 1 - 20%: Kickoff and approved specification. Estimated date: [FECHA_HITO_1].
Milestone 2 - 30%: First functional/validated delivery. Estimated date: [FECHA_HITO_2].
Milestone 3 - 30%: Adjustments, QA and release candidate. Estimated date: [FECHA_HITO_3].
Milestone 4 - 20%: Final delivery, documentation and acceptance. Estimated date: [FECHA_HITO_4].

4. CONFIDENTIALITY AND IP
All information, files, credentials, data, designs, code or materials received/produced are confidential. IP is governed by the IP/work-for-hire clause and applicable law.

5. ACCEPTANCE CRITERIA
- Compliance with approved specifications.
- Delivery of assets A-01 to A-05.
- No known IP infringement.
- Declared licenses/pre-existing materials delivered.
- Written acceptance by XLERION.

IMPLEMENTATION NOTE
- Employee: attach to employment contract/internal order; verify duties and confidentiality.
- External studio: attach to service agreement; include owner, approval channel and change control.
- Operational template; seek legal review before signature.

SIGNATURES

For XLERION S.A.S.                             For CONTRACTOR
____________________________________           ____________________________________
Miguel E. Rodríguez Martinez                   [NOMBRE_CONTRATISTA]
CEO & Lead Technical Architect                 Contractor / Freelancer
NIT 817.201.64                                 Date: [FECHA]`,
    },
  },
  advisory_consulting: {
    id: 'advisory_consulting',
    label: { es: 'Consultoría Integral (Advisory)', en: 'Advisory Consulting' },
    fileName: { es: 'contrato-consultoria-integral-advisory', en: 'advisory-consulting-agreement' },
    fields: ['FECHA', 'CIUDAD', 'NOMBRE_CLIENTE', 'NIT_CLIENTE', 'REPRESENTANTE_CLIENTE', 'PROYECTO', 'VALOR', 'PLAZO_DIAS'],
    content: {
      es: `CONTRATO DE CONSULTORÍA INTEGRAL Y ESTRUCTURACIÓN EMPRESARIAL
XLERION ADVISORY — PLANTILLA (CONTENIDO PENDIENTE DE REDACCIÓN FINAL)

Entre XLERION S.A.S. (NIT 817.201.64), representada por Miguel E. Rodríguez Martinez, y [NOMBRE_CLIENTE] (NIT/CC [NIT_CLIENTE]), representada por [REPRESENTANTE_CLIENTE], en [CIUDAD], a [FECHA].

CUÁNDO USARLO
Para el servicio "Xlerion Advisory": constitución legal, marca, MVP inicial y habilitación corporativa.

NATURALEZA
Contrato de obra y labor por resultado, no por horas.

ALCANCE / PROYECTO
Proyecto: [PROYECTO]
Plazo estimado: [PLAZO_DIAS] días.
Valor: [VALOR].

CLÁUSULAS CRÍTICAS (A DESARROLLAR EN VERSIÓN FINAL)
1. Entregables taxativos: definir exactamente qué se entrega (ej. 3 propuestas de logo, estatutos S.A.S. listos para firmar, MVP con 3 pantallas).
2. Exclusión de gastos oficiales: costos de registro ante Cámara de Comercio, DIAN o SIC son pagados directamente por el cliente o reembolsados con factura.
3. Límite de responsabilidad: Xlerion no garantiza éxito comercial o rentabilidad del negocio del cliente; garantiza correcta ejecución técnica/legal de los entregables.

[CONTENIDO LEGAL COMPLETO PENDIENTE — insertar redacción final aquí]

FIRMAS
XLERION S.A.S. — Miguel E. Rodríguez Martinez (CEO & Lead Technical Architect)
CLIENTE — [REPRESENTANTE_CLIENTE] / [NOMBRE_CLIENTE]`,
    },
  },
  custom_software: {
    id: 'custom_software',
    label: { es: 'Desarrollo Software a Medida', en: 'Custom Software Development' },
    fileName: { es: 'contrato-desarrollo-software-a-medida', en: 'custom-software-development-agreement' },
    fields: ['FECHA', 'CIUDAD', 'NOMBRE_CLIENTE', 'NIT_CLIENTE', 'PROYECTO', 'VALOR', 'PLAZO_MESES'],
    content: {
      es: `CONTRATO DE DESARROLLO DE SOFTWARE A MEDIDA Y OBRA INTELECTUAL
PLANTILLA (CONTENIDO PENDIENTE DE REDACCIÓN FINAL)

Entre XLERION S.A.S. (NIT 817.201.64) y [NOMBRE_CLIENTE] (NIT/CC [NIT_CLIENTE]), en [CIUDAD], a [FECHA].

CUÁNDO USARLO
Proyectos DeepTech a medida (gemelos digitales, RAG, IoT) con integración a sistemas del cliente. Ciclos típicos de 6 a 18 meses.

NATURALEZA
Contrato civil/comercial de desarrollo tecnológico con transferencia de propiedad condicionada.

PROYECTO
[PROYECTO] — Plazo: [PLAZO_MESES] meses — Valor: [VALOR].

CLÁUSULAS CRÍTICAS (A DESARROLLAR EN VERSIÓN FINAL)
1. Retención de Tecnología Base: Xlerion conserva 100% de propiedad de frameworks, librerías, código base y metodologías preexistentes. Al cliente se otorga licencia de uso perpetua, no exclusiva e intransferible sobre tecnología base; el cliente es dueño del código específico desarrollado para su negocio.
2. Pruebas de Aceptación de Usuario (UAT): el cliente tiene plazo (ej. 15 días) para probar. Sin reporte escrito de errores en plazo, se considera Aceptado Tácitamente.
3. Gestión de Cambios (Scope Creep): requerimientos fuera del Anexo Técnico inicial se cobran como Orden de Cambio con costo y tiempo adicional.

[CONTENIDO LEGAL COMPLETO PENDIENTE — insertar redacción final aquí]

FIRMAS
XLERION S.A.S. — Miguel E. Rodríguez Martinez (CEO & Lead Technical Architect)
CLIENTE — [NOMBRE_CLIENTE]`,
    },
  },
  game_dev: {
    id: 'game_dev',
    label: { es: 'Videojuegos / Serious Games', en: 'Game / Serious Game Dev' },
    fileName: { es: 'contrato-desarrollo-videojuegos', en: 'game-development-agreement' },
    fields: ['FECHA', 'CIUDAD', 'NOMBRE_CLIENTE', 'NIT_CLIENTE', 'PROYECTO', 'VALOR', 'PLAZO'],
    content: {
      es: `CONTRATO DE DESARROLLO DE VIDEOJUEGOS Y CESIÓN DE DERECHOS DE AUTOR
XLERION GAME STUDIO — PLANTILLA (CONTENIDO PENDIENTE DE REDACCIÓN FINAL)

Entre XLERION S.A.S. (NIT 817.201.64) y [NOMBRE_CLIENTE] (NIT/CC [NIT_CLIENTE]), en [CIUDAD], a [FECHA].

CUÁNDO USARLO
Cuando se desarrolla un juego o simulador para un cliente (B2B) o socio. Línea B2B serious games/simuladores y proyectos B2C acordados.

NATURALEZA
Contrato de obra intelectual con cesión total de derechos patrimoniales (según negociación).

PROYECTO
[PROYECTO] — Plazo: [PLAZO] — Valor: [VALOR].

CLÁUSULAS CRÍTICAS (A DESARROLLAR EN VERSIÓN FINAL)
1. Cesión de Derechos (Ley 23 de 1982): el cliente recibe derechos de explotación del juego final; Xlerion retiene derechos sobre assets genéricos, motores y herramientas usados para crearlo (salvo pacto contrario).
2. Garantía de Originalidad: la parte que aporta assets garantiza que no se usó material con derechos de terceros sin licencia comercial (música con copyright, assets "Editorial Use Only", etc.).
3. Créditos: definir cómo y dónde se acreditará a Xlerion Game Studio como desarrollador (pantalla de créditos, sitio web, material promocional).

[CONTENIDO LEGAL COMPLETO PENDIENTE — insertar redacción final aquí]

FIRMAS
XLERION S.A.S. — Miguel E. Rodríguez Martinez (CEO & Lead Technical Architect)
CLIENTE — [NOMBRE_CLIENTE]`,
    },
  },
  poc_audit: {
    id: 'poc_audit',
    label: { es: 'PoC / Auditoría Técnica', en: 'PoC / Technical Audit' },
    fileName: { es: 'contrato-poc-auditoria-tecnica', en: 'poc-technical-audit-agreement' },
    fields: ['FECHA', 'CIUDAD', 'NOMBRE_CLIENTE', 'NIT_CLIENTE', 'PROYECTO', 'VALOR', 'FECHA_INICIO', 'FECHA_FIN'],
    content: {
      es: `CONTRATO DE PRESTACIÓN DE SERVICIOS TÉCNICOS POR PRODUCTO (PoC / AUDITORÍA)
PLANTILLA (CONTENIDO PENDIENTE DE REDACCIÓN FINAL)

Entre XLERION S.A.S. (NIT 817.201.64) y [NOMBRE_CLIENTE] (NIT/CC [NIT_CLIENTE]), en [CIUDAD], a [FECHA].

CUÁNDO USARLO
Validaciones rápidas y auditorías de 30 a 90 días: pruebas de concepto, auditorías de IA, configuradores 3D rápidos.

NATURALEZA
Contrato de prestación de servicios de plazo fijo y alcance limitado.

PROYECTO
[PROYECTO] — Valor: [VALOR] — Inicio: [FECHA_INICIO] — Fin: [FECHA_FIN].

CLÁUSULAS CRÍTICAS (A DESARROLLAR EN VERSIÓN FINAL)
1. Entrega "Tal Cual" (As-Is): el entregable es prueba de concepto o diagnóstico. No incluye garantía de mantenimiento a largo plazo, escalabilidad o soporte post-entrega, salvo contratación separada.
2. Timebox Estricto: el proyecto termina en la fecha pactada. Lo no entregado se puede cotizar en Fase 2.
3. Confidencialidad Mutua (NDA): esencial, ya que se accede a datos o procesos sensibles del cliente para ejecutar la PoC.

[CONTENIDO LEGAL COMPLETO PENDIENTE — insertar redacción final aquí]

FIRMAS
XLERION S.A.S. — Miguel E. Rodríguez Martinez (CEO & Lead Technical Architect)
CLIENTE — [NOMBRE_CLIENTE]`,
    },
  },
  saas_support: {
    id: 'saas_support',
    label: { es: 'SaaS / Soporte Técnico', en: 'SaaS / Technical Support' },
    fileName: { es: 'contrato-saas-soporte-tecnico', en: 'saas-support-agreement' },
    fields: ['FECHA', 'CIUDAD', 'NOMBRE_CLIENTE', 'NIT_CLIENTE', 'SERVICIO', 'VALOR_MENSUAL', 'SLA_UPTIME', 'DIAS_SUSPENSION'],
    content: {
      es: `CONTRATO DE LICENCIAMIENTO DE SOFTWARE (SaaS) Y SOPORTE TÉCNICO
PLANTILLA (CONTENIDO PENDIENTE DE REDACCIÓN FINAL)

Entre XLERION S.A.S. (NIT 817.201.64) y [NOMBRE_CLIENTE] (NIT/CC [NIT_CLIENTE]), en [CIUDAD], a [FECHA].

CUÁNDO USARLO
Ingresos recurrentes: mensualidad/anualidad por uso de plataforma Xlerion (ej. asistente RAG desplegado) o mantenimiento de un Gemelo Digital.

NATURALEZA
Contrato de licencia de uso y prestación de servicios continuos.

SERVICIO
[SERVICIO] — Valor mensual: [VALOR_MENSUAL].

CLÁUSULAS CRÍTICAS (A DESARROLLAR EN VERSIÓN FINAL)
1. Acuerdo de Nivel de Servicio (SLA): definir uptime garantizado (ej. [SLA_UPTIME]) y tiempos de respuesta a incidentes.
2. Propiedad de los Datos: el cliente es dueño de sus datos; Xlerion puede usar datos anonimizados y agregados para mejorar modelos de IA, cumpliendo Ley 1581 de 2012.
3. Suspensión por Impago: derecho de Xlerion a suspender acceso si el pago se retrasa más de [DIAS_SUSPENSION] días.

[CONTENIDO LEGAL COMPLETO PENDIENTE — insertar redacción final aquí]

FIRMAS
XLERION S.A.S. — Miguel E. Rodríguez Martinez (CEO & Lead Technical Architect)
CLIENTE — [NOMBRE_CLIENTE]`,
    },
  },
  freelancer_nda: {
    id: 'freelancer_nda',
    label: { es: 'Freelancer / Cesión Total', en: 'Freelancer / Full Assignment' },
    fileName: { es: 'contrato-freelancer-cesion-total', en: 'freelancer-full-assignment-agreement' },
    fields: ['FECHA', 'CIUDAD', 'NOMBRE_CONTRATISTA', 'DOCUMENTO_CONTRATISTA', 'CORREO_CONTRATISTA', 'SERVICIO', 'VALOR', 'PLAZO'],
    content: {
      es: `CONTRATO DE PRESTACIÓN DE SERVICIOS CON CESIÓN TOTAL DE DERECHOS PATRIMONIALES
PLANTILLA (CONTENIDO PENDIENTE DE REDACCIÓN FINAL)

Entre XLERION S.A.S. (NIT 817.201.64) y [NOMBRE_CONTRATISTA] (Doc. [DOCUMENTO_CONTRATISTA], correo [CORREO_CONTRATISTA]), en [CIUDAD], a [FECHA].

CUÁNDO USARLO
Cuando Xlerion subcontrata a artista 3D, desarrollador freelance o estudio externo para ayudar en un proyecto.

NATURALEZA
Contrato civil (NO laboral) con cláusulas de propiedad intelectual reforzadas.

SERVICIO
[SERVICIO] — Plazo: [PLAZO] — Valor: [VALOR].

CLÁUSULAS CRÍTICAS (A DESARROLLAR EN VERSIÓN FINAL)
1. Ausencia de Subordinación: no hay horario fijo ni órdenes directas continuas, para evitar recalificación como contrato laboral por DIAN o juez laboral.
2. Cesión Automática y Total: el freelancer cede 100% de derechos patrimoniales a Xlerion S.A.S. desde el momento de la creación, a cambio de los honorarios pactados.
3. Confidencialidad Estricta: prohibición total de mostrar el trabajo en portafolio personal (ArtStation, GitHub, etc.) sin autorización escrita de Xlerion.

[CONTENIDO LEGAL COMPLETO PENDIENTE — insertar redacción final aquí]

FIRMAS
XLERION S.A.S. — Miguel E. Rodríguez Martinez (CEO & Lead Technical Architect)
CONTRATISTA — [NOMBRE_CONTRATISTA]`,
    },
  },
};

function getDefaultValues(fields) {
  const today = new Date().toISOString().slice(0, 10);
  return Object.fromEntries(fields.map((f) => [f, f.includes('FECHA') ? today : '']));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fillTemplate(text, values) {
  return text.replace(/\[([A-Z0-9_]+)\]/g, (_, key) => values[key] || `[${key}]`);
}

function renderTemplate(text, values, onChange) {
  const parts = text.split(/(\[[A-Z0-9_]+\])/g);
  return parts.map((part, i) => {
    const m = part.match(/^\[([A-Z0-9_]+)\]$/);
    if (!m) return <React.Fragment key={i}>{part}</React.Fragment>;
    const key = m[1];
    const val = values[key] || '';
    return (
      <input
        key={`${key}-${i}`}
        value={val}
        onChange={(e) => onChange(key, e.target.value)}
        placeholder={key}
        aria-label={key}
        className="mx-1 inline-block min-w-[120px] max-w-full rounded border border-[#00e9fa]/35 bg-[#00e9fa]/10 px-2 py-0.5 text-[#00e9fa] placeholder:text-[#00e9fa]/45 focus:outline-none focus:ring-1 focus:ring-[#00e9fa]"
        style={{ width: `${Math.max(120, Math.min(360, (val.length || key.length) * 9))}px` }}
      />
    );
  });
}

export default function ContractsPage() {
  const { lang } = useLanguage();
  usePageSEO({
    title: 'Contratos y Plantillas',
    description: 'Plantillas contractuales internas de Xlerion.',
    path: '/legal/contratos',
    robots: 'noindex, nofollow',
  });
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  const [keyInput, setKeyInput] = useState('');
  const [keyError, setKeyError] = useState(false);
  const [templateId, setTemplateId] = useState('ip_clause');
  const template = TEMPLATES[templateId];
  const [values, setValues] = useState(() => getDefaultValues(TEMPLATES.ip_clause.fields));

  useEffect(() => {
    const meta = document.querySelector('meta[name="robots"]');
    if (!meta) return;
    const previous = meta.getAttribute('content');
    meta.setAttribute('content', 'noindex, nofollow');
    return () => { if (previous !== null) meta.setAttribute('content', previous); };
  }, []);



  useEffect(() => {
    setValues((prev) => ({ ...getDefaultValues(template.fields), ...prev }));
  }, [template.fields]);

  const content = template.content[lang] || template.content.es;
  const filled = useMemo(() => fillTemplate(content, values), [content, values]);

  const onChangeField = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));

  const tryAccess = () => {
    if (keyInput.trim() === ACCESS_KEY) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setAuthed(true);
      setKeyError(false);
    } else {
      setKeyError(true);
    }
  };

  const downloadHtml = () => {
    const doc = `<!doctype html><html lang="es"><head><meta charset="UTF-8"><title>${escapeHtml(template.label.es)}</title><style>body{font-family:Arial,sans-serif;max-width:900px;margin:40px auto;padding:0 20px;line-height:1.6;color:#111}pre{white-space:pre-wrap;font-family:inherit}</style></head><body><pre>${escapeHtml(filled)}</pre></body></html>`;
    const blob = new Blob([doc], { type: 'text/html;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${template.fileName[lang] || template.fileName.es}.html`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const downloadDoc = () => {
    const doc = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${escapeHtml(template.label.es)}</title></head><body><pre style="font-family:Arial,sans-serif;white-space:pre-wrap;line-height:1.5">${escapeHtml(filled)}</pre></body></html>`;
    const blob = new Blob([doc], { type: 'application/msword;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${template.fileName[lang] || template.fileName.es}.doc`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const printDoc = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!doctype html><html><head><meta charset="UTF-8"><title>${escapeHtml(template.label.es)}</title><style>body{font-family:Arial,sans-serif;margin:40px;line-height:1.6;color:#111}pre{white-space:pre-wrap;font-family:inherit}@media print{body{margin:20mm}}</style></head><body><pre>${escapeHtml(filled)}</pre><script>window.onload=()=>window.print()</script></body></html>`);
    win.document.close();
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#050508] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#00e9fa] mb-3">Xlerion / Legal</p>
          <h1 className="text-2xl font-semibold mb-2">{lang === 'es' ? 'Contratos y Plantillas' : 'Contracts & Templates'}</h1>
          <p className="text-sm text-gray-400 mb-6">{lang === 'es' ? 'Esta sección contiene plantillas internas. Ingresa la clave de acceso para continuar.' : 'This section contains internal templates. Enter the access key to continue.'}</p>
          <label className="block text-sm text-gray-300 mb-2" htmlFor="contract-key">{lang === 'es' ? 'Clave de acceso' : 'Access key'}</label>
          <input id="contract-key" type="password" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && tryAccess()} className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-white focus:border-[#00e9fa] focus:outline-none" />
          {keyError && <p className="mt-2 text-sm text-red-400">{lang === 'es' ? 'Clave incorrecta.' : 'Incorrect key.'}</p>}
          <button onClick={tryAccess} className="mt-5 w-full rounded-lg bg-[#00e9fa] px-4 py-3 font-semibold text-black hover:bg-[#00d4e3] transition-colors">{lang === 'es' ? 'Ingresar' : 'Enter'}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#00e9fa] mb-2">Xlerion / Legal / Contratos</p>
            <h1 className="text-3xl md:text-4xl font-semibold">{lang === 'es' ? 'Plantillas contractuales' : 'Contract templates'}</h1>
            <p className="text-gray-400 mt-2 max-w-3xl">{lang === 'es' ? 'Plantillas editables y descargables. Revisa con asesoría legal antes de firmar. Los campos entre corchetes son editables en vivo.' : 'Editable and downloadable templates. Review with legal counsel before signing. Bracketed fields are live-editable.'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={downloadDoc} className="rounded-lg border border-[#00e9fa]/40 bg-[#00e9fa]/10 px-4 py-2 text-sm hover:bg-[#00e9fa]/20">Descargar .doc</button>
            <button onClick={downloadHtml} className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/5">Descargar .html</button>
            <button onClick={printDoc} className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/5">Imprimir / PDF</button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {Object.values(TEMPLATES).map((t) => (
            <button key={t.id} onClick={() => setTemplateId(t.id)} className={`rounded-full px-4 py-2 text-sm border transition-colors ${templateId === t.id ? 'bg-[#00e9fa] text-black border-[#00e9fa]' : 'border-white/15 text-gray-300 hover:bg-white/5'}`}>
              {t.label[lang] || t.label.es}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:p-8 shadow-2xl">
          <div className="mb-4 text-xs text-gray-500 font-mono uppercase tracking-wider">Vista previa editable — campos [ ] son editables</div>
          <div className="whitespace-pre-wrap font-mono text-[13px] leading-7 text-gray-200 overflow-x-auto">
            {renderTemplate(content, values, onChangeField)}
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500 leading-relaxed">
          Nota: Estas plantillas son punto de partida operativo para XLERION S.A.S. No constituyen asesoría legal. Validar con abogado antes de firma, especialmente para cesión internacional, software crítico, datos sensibles o contratación con terceros.
        </div>
      </div>
    </div>
  );
}
