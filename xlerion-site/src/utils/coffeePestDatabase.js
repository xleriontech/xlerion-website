/**
 * Coffee Pest Database - Agronomic Information & Treatment Protocols
 * Source: Colombian Coffee Federation (FNC), CIMMYT, CENICAFÉ standards
 */

export const COFFEE_PESTS = {
    'Broca del café': {
        scientificName: 'Hypothenemus hampei',
        level: 1,
        altitudeRange: { min: 800, max: 2000 },
        temperatureRange: { min: 15, max: 30 },
        humidityOptimal: { min: 60, max: 90 },
        description: 'Pequeño insecto que perfora el fruto del café',
        damageIndicators: {
            leve: ['Pequeños agujeros en el fruto rojo/verde', 'Presencia de polvo café oscuro en orificios'],
            moderada: ['50-80% de frutos afectados por sector', 'Perforación visible en múltiples granos'],
            severa: ['> 80% de frutos con daño', 'Pudrición interna del grano']
        },
        phenologicalWindow: {
            highest: ['Julio-Octubre', 'Marzo-Mayo'],
            moderate: ['Noviembre-Febrero', 'Junio'],
            lowest: []
        },
        treatments: {
            biological: [
                {
                    name: 'Parasitoides (Phymastichus coffea)',
                    description: 'Liberación de avispitas parásitas que controlan población de broca',
                    effectiveness: '70-85%',
                    cost: 'Medio',
                    timing: 'Inicio de floración, 4-6 semanas antes de cosecha',
                    preparation: 'Consultar centro de investigación agrícola'
                },
                {
                    name: 'Hongo entomopatógeno (Beauveria bassiana)',
                    description: 'Aplicación de esporas que infectan adultos de broca',
                    effectiveness: '60-75%',
                    cost: 'Bajo',
                    timing: 'Cada 7-10 días durante periodo activo',
                    preparation: 'Comercialmente disponible, seguir dosis de etiqueta'
                }
            ],
            cultural: [
                {
                    name: 'Recolección oportuna',
                    description: 'Cosechar en rojo (no dejar frutos en árbol > 3 semanas)',
                    effectiveness: '40-60%',
                    cost: 'Bajo',
                    timing: 'Durante cosecha principal y mitaca',
                    preparation: 'Planificación de labor y personal'
                },
                {
                    name: 'Manejo de la sombra',
                    description: 'Mantener sombra 25-35% (fresco reduce actividad de broca)',
                    effectiveness: '30-40%',
                    cost: 'Bajo',
                    timing: 'Año redondo',
                    preparation: 'Poda y manejo de árboles de sombra'
                },
                {
                    name: 'Poda sanitaria',
                    description: 'Eliminar ramas enfermas, restos de cosecha',
                    effectiveness: '25-35%',
                    cost: 'Bajo',
                    timing: 'Post-cosecha',
                    preparation: 'Labor manual, disposición de material'
                }
            ],
            chemical: [
                {
                    name: 'Permetrina 38% EC',
                    description: 'Insecticida piretroide sintético (recomendado para control químico)',
                    effectiveness: '80-90%',
                    cost: 'Medio',
                    timing: 'Inicio de floración, máx 2 aplicaciones por ciclo',
                    preparation: 'Dosis: 1L/ha, aplicar con bomba de espalda',
                    restrictions: 'Esperar 15 días antes de cosecha, no aplicar en lluvia'
                },
                {
                    name: 'Imidacloprid 17.8% SL (sistémico)',
                    description: 'Insecticida neonicotinoide de absorción sistémica',
                    effectiveness: '85-95%',
                    cost: 'Medio-Alto',
                    timing: 'Inicio de floración',
                    preparation: 'Dosis: 250mL/ha, aplicar al suelo o foliar',
                    restrictions: 'Peligro para abejas, no aplicar en floración total'
                }
            ],
            organic: [
                {
                    name: 'Aceite de neem',
                    description: 'Bioinsecticida que afecta reproducción y feeding de broca',
                    effectiveness: '50-65%',
                    cost: 'Bajo',
                    timing: 'Semanal durante período activo',
                    preparation: 'Diluir 1-2% en agua, aplicar con bomba'
                },
                {
                    name: 'Trampa cromática (azul/amarillo)',
                    description: 'Atrae adultos en búsqueda de fruto',
                    effectiveness: '20-30% (como complemento)',
                    cost: 'Muy Bajo',
                    timing: 'Colocar 4-6 semanas antes de floración',
                    preparation: 'Instalar trampas pegajosas cada 50-100m²'
                }
            ]
        },
        preventiveMeasures: [
            'Monitoreo constante de frutos desde formación',
            'Mantener historial de infestación por parcela',
            'Usar variedades resistentes si disponibles',
            'Evitar estrés hídrico en plantas'
        ],
        economicThreshold: {
            description: 'Aplicar control cuando...',
            conditions: [
                'Infestación > 3-5% frutos en floración',
                'Adultos activos en trampas > 5/semana',
                'Temperatura promedio > 22°C sostenida'
            ]
        }
    },

    'Roya del café': {
        scientificName: 'Hemileia vastatrix',
        level: 2,
        altitudeRange: { min: 1000, max: 2100 },
        temperatureRange: { min: 15, max: 25 },
        humidityOptimal: { min: 80, max: 100 },
        description: 'Hongo que causa manchas amarillas en hojas inferiores',
        damageIndicators: {
            leve: ['Manchas amarillas pequeñas en envés de hojas', '< 5% área foliar afectada por sector'],
            moderada: ['Manchas polvosas en envés', '5-25% defoliación por rama', 'Presencia en hojas de diferentes alturas'],
            severa: ['> 50% defoliación', 'Manchas confluentes', 'Caída masiva de hojas']
        },
        phenologicalWindow: {
            highest: ['Noviembre-Febrero', 'Junio-Julio'],
            moderate: ['Marzo-Mayo', 'Agosto-Octubre'],
            lowest: []
        },
        treatments: {
            biological: [
                {
                    name: 'Trichoderma harzianum',
                    description: 'Hongo antagonista que compite con roya',
                    effectiveness: '40-55%',
                    cost: 'Bajo',
                    timing: 'Aplicaciones preventivas cada 15 días',
                    preparation: 'Aspersión foliar, comercialmente disponible'
                },
                {
                    name: 'Bacillus subtilis (bioestimulante)',
                    description: 'Estimula defensa natural de planta contra roya',
                    effectiveness: '35-50%',
                    cost: 'Bajo',
                    timing: 'Cada 10-15 días en épocas de alta humedad',
                    preparation: 'Aplicación foliar temprano (5-7 AM)'
                }
            ],
            cultural: [
                {
                    name: 'Poda de beneficiación',
                    description: 'Eliminar hojas inferiores (donde se concentra roya)',
                    effectiveness: '50-70%',
                    cost: 'Bajo',
                    timing: 'Antes de épocas lluviosas',
                    preparation: 'Labor manual selectiva, destruir material enfermo'
                },
                {
                    name: 'Manejo de sombra (aumentar aireación)',
                    description: 'Podas para mejorar circulación de aire',
                    effectiveness: '40-60%',
                    cost: 'Bajo',
                    timing: 'Post-cosecha y mediados de año',
                    preparation: 'Ajustar densidad de sombra a 30-40%'
                },
                {
                    name: 'Riego por goteo (no mojado aéreo)',
                    description: 'Evita crear microclima húmedo en follaje',
                    effectiveness: '30-50%',
                    cost: 'Medio-Alto',
                    timing: 'Año redondo',
                    preparation: 'Instalación de sistema, mantenimiento continuo'
                }
            ],
            chemical: [
                {
                    name: 'Oxicloruro de cobre 50%',
                    description: 'Fungicida cúprico de contacto, primera línea',
                    effectiveness: '75-85%',
                    cost: 'Bajo',
                    timing: 'Cada 10-14 días en épocas de lluvia',
                    preparation: 'Dosis: 2-3 kg/ha, mezclar bien antes de aplicar',
                    restrictions: 'No mezclar con aceites, esperar 48h antes de cosecha'
                },
                {
                    name: 'Sulfato de cobre pentahidratado',
                    description: 'Fungicida preventivo de larga residualidad',
                    effectiveness: '70-80%',
                    cost: 'Bajo',
                    timing: 'Inicio de lluvias, cada 15-21 días',
                    preparation: 'Dosis: 5-8 kg/ha en alta humedad',
                    restrictions: 'Aplicar en horas frescas, cuidado con fitotoxia'
                },
                {
                    name: 'Flutriafol 25% SC (triazol)',
                    description: 'Fungicida sistémico de amplio espectro',
                    effectiveness: '85-92%',
                    cost: 'Medio-Alto',
                    timing: '2-3 aplicaciones por ciclo lluvia',
                    preparation: 'Dosis: 400mL/ha, aspersión foliar',
                    restrictions: 'Uso limitado a 2 ciclos/año, esperar 21 días cosecha'
                }
            ],
            organic: [
                {
                    name: 'Sulfato de potasio + Azufre mojable',
                    description: 'Mezcla de contacto con acción preventiva',
                    effectiveness: '60-70%',
                    cost: 'Bajo',
                    timing: 'Cada 7-10 días en lluvias',
                    preparation: 'Dosis: 3-4 kg/ha azufre, aplicación temprano'
                },
                {
                    name: 'Propóleo y extractos vegetales',
                    description: 'Activadores de defensa y fungicidas naturales',
                    effectiveness: '45-60%',
                    cost: 'Bajo',
                    timing: 'Semanal preventivo',
                    preparation: 'Extractos comerciales, seguir indicaciones'
                }
            ]
        },
        preventiveMeasures: [
            'Usar variedades resistentes (ej. Castillo, Cenicafé, Geisha)',
            'Mantener registros de humedad relativa diaria',
            'Establecer riego por goteo en zonas propensas',
            'Evitar exceso de sombra',
            'Monitoreo semanal en épocas de lluvia'
        ],
        economicThreshold: {
            description: 'Aplicar control cuando...',
            conditions: [
                'Presencia de síntomas en > 10% de hojas',
                'HR > 85% sostenida + temperatura 18-25°C',
                'Historial de roya severa en años anteriores'
            ]
        }
    },

    'Minador de hojas': {
        scientificName: 'Leucoptera coffeella',
        level: 2,
        altitudeRange: { min: 600, max: 1800 },
        temperatureRange: { min: 18, max: 28 },
        humidityOptimal: { min: 60, max: 85 },
        description: 'Mariposa pequeña que forma galerías dentro de la hoja',
        damageIndicators: {
            leve: ['Líneas sinuosas en hojas jóvenes', 'Galerías translúcidas sin afectar funcionalidad'],
            moderada: ['Múltiples galerías en 20-50% de hojas jóvenes', 'Reducción leve de fotosíntesis'],
            severa: ['> 50% de hojas con daño severo', 'Caída prematura de hojas', 'Debilitamiento general']
        },
        phenologicalWindow: {
            highest: ['Agosto-Octubre', 'Marzo-Abril'],
            moderate: ['Mayo-Julio', 'Noviembre-Febrero'],
            lowest: []
        },
        treatments: {
            biological: [
                {
                    name: 'Parasitoides (Chrysocharis spp.)',
                    description: 'Micro-avispitas que parasitan larvas dentro de hoja',
                    effectiveness: '50-70%',
                    cost: 'Medio',
                    timing: 'Liberación en campo 3-4 veces en ciclo',
                    preparation: 'Consultar investigación agrícola local'
                },
                {
                    name: 'Spinosad (bacteria)',
                    description: 'Bioinsecticida que afecta SNC de larva',
                    effectiveness: '65-80%',
                    cost: 'Medio',
                    timing: 'Cada 7-10 días durante período activo',
                    preparation: 'Dosis: 1-1.5 L/ha, aplicación en tarde'
                }
            ],
            cultural: [
                {
                    name: 'Poda de plantas infestadas',
                    description: 'Remover brotes con alta concentración de minador',
                    effectiveness: '40-60%',
                    cost: 'Bajo',
                    timing: 'Cuando presencia > 50% en brote',
                    preparation: 'Labor manual, destruir material'
                },
                {
                    name: 'Sombrío (reducir estrés hídrico)',
                    description: 'Aumentar sombra 35-45% para reducir estrés',
                    effectiveness: '30-45%',
                    cost: 'Bajo',
                    timing: 'Año redondo',
                    preparation: 'Ajuste de árboles de sombra'
                }
            ],
            chemical: [
                {
                    name: 'Abamectina 18% EC',
                    description: 'Insecticida acaricida de amplio espectro',
                    effectiveness: '75-85%',
                    cost: 'Medio',
                    timing: 'Cada 10-14 días durante brotes',
                    preparation: 'Dosis: 0.5-1 L/ha, máx 2 aplicaciones ciclo',
                    restrictions: 'Tóxico para artrópodos benéficos, esperar 14 días cosecha'
                },
                {
                    name: 'Deltametrina 2.5% EC',
                    description: 'Piretroide sintético para control de adultos',
                    effectiveness: '70-80%',
                    cost: 'Bajo',
                    timing: 'Cada 7-10 días en período pico',
                    preparation: 'Dosis: 1.5 L/ha, aplicación tarde',
                    restrictions: 'Afecta fauna beneficiosa, usar con precaución'
                }
            ],
            organic: [
                {
                    name: 'Aceite mineral + jabón potásico',
                    description: 'Asfixia de huevos y larvas recién nacidas',
                    effectiveness: '50-65%',
                    cost: 'Bajo',
                    timing: 'Cada 5-7 días preventivo',
                    preparation: 'Dosis: 1-2% aceite + jabón, aplicar tarde'
                }
            ]
        },
        preventiveMeasures: [
            'Monitoreo de hojas nuevas semanalmente',
            'Mantener humedad relativa óptima (65-75%)',
            'Evitar deficiencias nutricionales',
            'Sanidad de semillero (inspeccionar antes plantación)',
            'Destruir material enfermo completamente'
        ],
        economicThreshold: {
            description: 'Aplicar control cuando...',
            conditions: [
                'Presencia en > 30% de brotes nuevos',
                'Poblaciones aumentando en 2+ generaciones',
                'Estrés hídrico evidente en plantas'
            ]
        }
    },

    'Arañita roja': {
        scientificName: 'Oligonychus ilicis',
        level: 2,
        altitudeRange: { min: 900, max: 1900 },
        temperatureRange: { min: 20, max: 28 },
        humidityOptimal: { min: 50, max: 70 },
        description: 'Ácaro que forma telas y succiona contenido celular',
        damageIndicators: {
            leve: ['Punteado amarillento en hojas', 'Presencia de telas finas en envés'],
            moderada: ['25-50% hojas con bronceado', 'Telas visibles, colonias multiples'],
            severa: ['Defoliación > 50%', 'Plantas severamente debilitadas']
        },
        phenologicalWindow: {
            highest: ['Julio-Septiembre', 'Febrero-Abril'],
            moderate: ['Octubre-Enero', 'Mayo-Junio'],
            lowest: []
        },
        treatments: {
            biological: [
                {
                    name: 'Ácaro depredador (Phytoseiulus persimilis)',
                    description: 'Ácaro benéfico que consume 5-20 ácaros roja/día',
                    effectiveness: '70-85%',
                    cost: 'Medio',
                    timing: 'Liberación 4-6 semanas detección',
                    preparation: 'Introducción de cultivo comercial'
                },
                {
                    name: 'Hongos entomopatógenos (Beauveria, Isaria)',
                    description: 'Infección directa de ácaros',
                    effectiveness: '55-70%',
                    cost: 'Bajo',
                    timing: 'Aplicaciones cada 10 días',
                    preparation: 'Productos comerciales, mantener HR > 70%'
                }
            ],
            cultural: [
                {
                    name: 'Riego frecuente (aumentar humedad)',
                    description: 'Ácaros prefieren ambiente seco (< 60% HR)',
                    effectiveness: '40-60%',
                    cost: 'Bajo',
                    timing: 'Diario en épocas secas',
                    preparation: 'Sistema goteo o aspersión diaria'
                },
                {
                    name: 'Poda sanitaria de focos',
                    description: 'Remover ramas con alta concentración',
                    effectiveness: '30-50%',
                    cost: 'Bajo',
                    timing: 'Conforme se detecta',
                    preparation: 'Labor manual, destruir completamente'
                }
            ],
            chemical: [
                {
                    name: 'Azufre mojable 80%',
                    description: 'Acaricida tradicional de bajo costo',
                    effectiveness: '70-80%',
                    cost: 'Muy Bajo',
                    timing: 'Cada 10-14 días',
                    preparation: 'Dosis: 2-3 kg/ha, no mezclar con otros productos',
                    restrictions: 'No aplicar si T > 28°C (fitotoxia), esperar lluvia'
                },
                {
                    name: 'Dicofol 18.5% EC',
                    description: 'Acaricida específico para arañita roja',
                    effectiveness: '80-90%',
                    cost: 'Medio',
                    timing: 'Máx 2 aplicaciones por ciclo',
                    preparation: 'Dosis: 1.5-2 L/ha, esperar 21 días cosecha',
                    restrictions: 'Tóxico para peces, evitar escurrimiento'
                },
                {
                    name: 'Propargita 57% EC',
                    description: 'Acaricida organoestaño de residualidad media',
                    effectiveness: '85-92%',
                    cost: 'Medio-Alto',
                    timing: 'Máx 1 aplicación por ciclo',
                    preparation: 'Dosis: 1-1.5 L/ha',
                    restrictions: 'Esperar 30 días antes cosecha, uso limitado'
                }
            ],
            organic: [
                {
                    name: 'Extracto de ajo + aceite de neem',
                    description: 'Repelente natural y disruptor reproductivo',
                    effectiveness: '45-60%',
                    cost: 'Bajo',
                    timing: 'Aplicación cada 5-7 días',
                    preparation: 'Mezcla casera o comercial'
                }
            ]
        },
        preventiveMeasures: [
            'Mantener riego regular (HR 65-75%)',
            'Monitoreo semanal de envés de hojas',
            'Evitar fertilización excesiva con N',
            'Mantener árboles de sombra en densidad óptima',
            'Inspeccionar plantas nuevas antes plantación'
        ],
        economicThreshold: {
            description: 'Aplicar control cuando...',
            conditions: [
                'Presencia de ácaros en > 20% de hojas',
                'Ambiente seco (< 60% HR) sostenido',
                'Acaros en 3+ plantas de parcela monitoreo'
            ]
        }
    },

    'Cochinilla harinosa': {
        scientificName: 'Planococcus spp.',
        level: 2,
        altitudeRange: { min: 900, max: 1800 },
        temperatureRange: { min: 20, max: 26 },
        humidityOptimal: { min: 70, max: 85 },
        description: 'Insecto pequeño cubierto de cera que succiona savia',
        damageIndicators: {
            leve: ['Colonias pequeñas en axilas de hojas', 'Presencia de secreción algodonosa'],
            moderada: ['Colonias en múltiples localizaciones', 'Hojas amarillentas, sombreamiento bajo'],
            severa: ['Infestación generalizada en toda rama', 'Necrosis de brotes, fumagina']
        },
        phenologicalWindow: {
            highest: ['Noviembre-Marzo'],
            moderate: ['Abril-Octubre'],
            lowest: []
        },
        treatments: {
            biological: [
                {
                    name: 'Depredadores (Cryptolaemus montrouzieri)',
                    description: 'Mariquita depredadora consume huevos y adultos',
                    effectiveness: '60-75%',
                    cost: 'Medio',
                    timing: 'Liberación 3-4 semanas detección',
                    preparation: 'Cultivo comercial de insectos benéficos'
                },
                {
                    name: 'Parasitoides (Leptomastix spp.)',
                    description: 'Micro-avispas que parasitan hembras gravadas',
                    effectiveness: '65-80%',
                    cost: 'Medio',
                    timing: 'Liberación en focos de población',
                    preparation: 'Centro investigación agrícola'
                }
            ],
            cultural: [
                {
                    name: 'Poda de material infestado',
                    description: 'Remover completamente ramas con cochinilla',
                    effectiveness: '50-70%',
                    cost: 'Bajo',
                    timing: 'Conforme detecta',
                    preparation: 'Labor manual cuidadosa, destruir completamente'
                },
                {
                    name: 'Control de hormigas (evitan depredadores)',
                    description: 'Colocar trampas/barreras contra hormigas',
                    effectiveness: '30-50%',
                    cost: 'Bajo',
                    timing: 'Año redondo',
                    preparation: 'Bandas pegajosas alrededor troncos'
                }
            ],
            chemical: [
                {
                    name: 'Aceite mineral blanco 80%',
                    description: 'Asfixia por oclusión de espiráculos',
                    effectiveness: '75-85%',
                    cost: 'Bajo',
                    timing: 'Cada 7-10 días hasta control',
                    preparation: 'Dosis: 2-3% en agua, aplicación completa',
                    restrictions: 'No mezclar con azufre, no aplicar T > 28°C'
                },
                {
                    name: 'Imidacloprid 70% WS',
                    description: 'Insecticida sistémico de larga residualidad',
                    effectiveness: '85-92%',
                    cost: 'Medio',
                    timing: 'Máx 2 aplicaciones por ciclo',
                    preparation: 'Dosis: 250mL/ha, riego o aspersión',
                    restrictions: 'Peligro para abejas, esperar 21 días cosecha'
                }
            ],
            organic: [
                {
                    name: 'Jabón potásico + aceite de neem',
                    description: 'Combinación para efectividad mejorada',
                    effectiveness: '60-75%',
                    cost: 'Bajo',
                    timing: 'Semanal durante control',
                    preparation: 'Mezcla 1% jabón + 1% neem, aplicar tarde'
                }
            ]
        },
        preventiveMeasures: [
            'Inspección regular de plantas en vivero',
            'Evitar introducción de plantas infestadas',
            'Mantener control de hormigas que protejen cochinilla',
            'Monitoreo semanal en época alta (nov-mar)',
            'Eliminación inmediata de focos detectados'
        ],
        economicThreshold: {
            description: 'Aplicar control cuando...',
            conditions: [
                'Presencia en 2 o más ramas de árbol',
                'Colonias mayores de 2cm diámetro',
                'Presencia de fumagina indicando daño severo'
            ]
        }
    }
};

/**
 * Get pest information by name
 */
export function getPestInfo(pestName) {
    return COFFEE_PESTS[pestName] || null;
}

/**
 * Get all pests
 */
export function getAllPests() {
    return Object.keys(COFFEE_PESTS);
}

/**
 * Get pests by altitude range
 */
export function getPestsByAltitude(altitude) {
    return Object.entries(COFFEE_PESTS)
        .filter(([, pest]) => {
            const { min, max } = pest.altitudeRange;
            return altitude >= min && altitude <= max;
        })
        .map(([name]) => name);
}

/**
 * Get pests by temperature range
 */
export function getPestsByTemperature(temp) {
    return Object.entries(COFFEE_PESTS)
        .filter(([, pest]) => {
            const { min, max } = pest.temperatureRange;
            return temp >= min && temp <= max;
        })
        .map(([name]) => name);
}

/**
 * Get treatment recommendations by severity
 */
export function getTreatmentsByPestAndSeverity(pestName, severity) {
    const pest = COFFEE_PESTS[pestName];
    if (!pest) return null;

    return {
        pestName,
        severity,
        biological: pest.treatments.biological,
        cultural: pest.treatments.cultural,
        chemical: pest.treatments.chemical,
        organic: pest.treatments.organic,
        economicThreshold: pest.economicThreshold,
        preventiveMeasures: pest.preventiveMeasures
    };
}
