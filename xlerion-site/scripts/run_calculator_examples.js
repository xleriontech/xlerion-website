// Replica simplified del calculador para ejecutar ejemplos locales
// Ejecutar con: node run_calculator_examples.js

const IVA = 0.19;
const COP_TO_USD = 4200; // tasa usada en el proyecto

const basePrices = {
    'desarrollo-web-movil': 35
};

const timeMultipliers = {
    'horas': { value: 1, label: 'Por Hora' },
    'dias': { value: 8, label: 'Por Día (8h)' },
    'semanas': { value: 40, label: 'Por Semana (40h)' },
    'meses': { value: 160, label: 'Por Mes (~160h)' }
};

const questionnaires = {
    'desarrollo-web-movil': [
        {
            id: 'tipo',
            type: 'choice',
            options: [
                { value: 101, label: 'Página institucional / Corporativa (sitio informativo)', projectMinCOP: 800000, projectMaxCOP: 2500000, factor: 1.0 },
                { value: 102, label: 'Landing page (captación de leads)', projectMinCOP: 400000, projectMaxCOP: 1200000, factor: 1.0 },
                { value: 103, label: 'Portafolio digital / Personal', projectMinCOP: 500000, projectMaxCOP: 1800000, factor: 1.0 },
                { value: 107, label: 'E-commerce / Tienda online (pequeña)', projectMinCOP: 2500000, projectMaxCOP: 7000000, factor: 1.25 }
            ]
        },
        { id: 'pages', type: 'number', factor: 1.12 },
        { id: 'backend', type: 'boolean', factor: 1.4 },
        { id: 'ecommerce', type: 'boolean', factor: 1.5 },
        { id: 'autenticacion', type: 'boolean', factor: 1.35 },
        { id: 'performance', type: 'boolean', factor: 1.2 },
        {
            id: 'integraciones', type: 'multiple', options: [
                { value: 'pagos', factor: 1.3 },
                { value: 'email', factor: 1.15 },
                { value: 'analytics', factor: 1.1 },
                { value: 'crm', factor: 1.25 }
            ]
        },
        { id: 'testing', type: 'boolean', factor: 1.25 }
    ]
};

function computeEstimate(selectedService, answers, timeUnit = 'horas') {
    const questionnaire = questionnaires[selectedService] || [];
    let totalFactor = 1;

    questionnaire.forEach(q => {
        const answer = answers[q.id];
        if (answer === undefined || answer === null || answer === '') return;

        if (q.type === 'number' && typeof answer === 'number' && answer > 0) {
            totalFactor *= (1 + (Math.min(answer, 10) / 10) * (q.factor - 1));
        } else if (q.type === 'boolean' && answer === true) {
            totalFactor *= q.factor;
        } else if (q.type === 'choice' && typeof answer === 'number') {
            const option = q.options?.find(opt => opt.value === answer);
            if (option?.factor) totalFactor *= option.factor;
        } else if (q.type === 'multiple' && Array.isArray(answer) && answer.length > 0) {
            answer.forEach(sel => {
                const option = q.options?.find(opt => opt.value === sel);
                if (option?.factor) totalFactor *= option.factor;
            });
        }
    });

    // Lógica de proyecto para desarrollo-web-movil
    if (selectedService === 'desarrollo-web-movil') {
        const tipoAnswer = answers['tipo'];
        const tipoQuestion = questionnaire.find(q => q.id === 'tipo');
        const selectedOption = tipoQuestion.options.find(o => o.value === tipoAnswer);
        if (selectedOption && selectedOption.projectMinCOP && selectedOption.projectMaxCOP) {
            const avgCOP = (selectedOption.projectMinCOP + selectedOption.projectMaxCOP) / 2;
            const subtotalUSDFromProject = avgCOP / COP_TO_USD;
            const tipoFactor = selectedOption.factor || 1;
            const effectiveFactor = totalFactor / tipoFactor; // evitar doble conteo
            const subtotal = subtotalUSDFromProject * effectiveFactor;
            const totalWithTax = subtotal * (1 + IVA);
            return {
                model: 'project-range',
                description: selectedOption.label,
                subtotalUSD: Math.round(subtotal),
                totalUSD: Math.round(totalWithTax),
                subtotalCOP: Math.round(subtotal * COP_TO_USD),
                totalCOP: Math.round(totalWithTax * COP_TO_USD),
                totalFactor: Number(effectiveFactor.toFixed(3))
            };
        }
    }

    // Fallback: cálculo por tarifa horaria
    const basePrice = basePrices[selectedService] || 35;
    const timeMultiplier = timeMultipliers[timeUnit].value || 1;
    const subtotal = basePrice * timeMultiplier * totalFactor;
    const totalWithTax = subtotal * (1 + IVA);
    return {
        model: 'hourly-fallback',
        subtotalUSD: Math.round(subtotal),
        totalUSD: Math.round(totalWithTax),
        subtotalCOP: Math.round(subtotal * COP_TO_USD),
        totalCOP: Math.round(totalWithTax * COP_TO_USD),
        totalFactor: Number(totalFactor.toFixed(3))
    };
}

const scenarios = [
    {
        name: 'Landing page (captación de leads)',
        answers: {
            tipo: 102,
            pages: 1,
            backend: false,
            ecommerce: false,
            autenticacion: false,
            performance: true,
            integraciones: ['analytics', 'email'],
            testing: false
        }
    },
    {
        name: 'Página Corporativa (institucional)',
        answers: {
            tipo: 101,
            pages: 6,
            backend: false,
            ecommerce: false,
            autenticacion: false,
            performance: true,
            integraciones: ['analytics'],
            testing: false
        }
    },
    {
        name: 'E-commerce pequeño (Tiendanet)',
        answers: {
            tipo: 107,
            pages: 12,
            backend: true,
            ecommerce: true,
            autenticacion: true,
            performance: true,
            integraciones: ['pagos', 'crm', 'analytics'],
            testing: true
        }
    }
];

console.log('\nEjemplos de estimados (usando midpoint del rango COP, tasa 4200 COP/USD):\n');
scenarios.forEach(s => {
    const res = computeEstimate('desarrollo-web-movil', s.answers, 'horas');
    console.log(`- ${s.name}`);
    console.log(`  Modelo: ${res.model}`);
    if (res.description) console.log(`  Tipo: ${res.description}`);
    console.log(`  Subtotal: USD $${res.subtotalUSD.toLocaleString('en-US')}  —  COP $${res.subtotalCOP.toLocaleString('es-CO')}`);
    console.log(`  Total (IVA ${IVA * 100}%): USD $${res.totalUSD.toLocaleString('en-US')}  —  COP $${res.totalCOP.toLocaleString('es-CO')}`);
    console.log(`  Factor aplicado: ${res.totalFactor}\n`);
});

// Exit with success
process.exit(0);
