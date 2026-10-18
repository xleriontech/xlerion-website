import React from 'react';
import { Link } from 'react-router-dom';

const plans = [
    {
        name: 'Plan Starter',
        price: 'desde $900.000 COP',
        items: [
            'Landing page de 1 página',
            'Diseño responsive moderno',
            'Formulario de contacto funcional',
            'SEO básico (meta tags, OG)',
            'Entrega en 5-7 días hábiles',
        ],
        cta: 'Empezar →',
        query: 'Starter',
        popular: false,
    },
    {
        name: 'Plan Web PYME',
        price: 'desde $2.500.000 COP',
        items: [
            'Sitio de hasta 5 páginas',
            'Panel de edición de contenido',
            'Integración Google Analytics',
            'Dominio + hosting 1er año incluido',
            '2 rondas de revisiones',
        ],
        cta: 'Cotizar →',
        query: 'Web+PYME',
        popular: true,
    },
    {
        name: 'Plan App / Sistema',
        price: 'desde $4.500.000 COP',
        items: [
            'Aplicación web React + Django',
            'Panel administrativo',
            'Base de datos + API REST',
            'Deploy en producción',
            'Soporte 30 días post-entrega',
        ],
        cta: 'Agendar llamada →',
        query: 'App+Sistema',
        popular: false,
    },
];

export default function PricingSection() {
    return (
        <section id="precios" className="py-20 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-10">
                    <p className="text-[#00e9fa] uppercase tracking-[0.2em] text-xs mb-3">Precios transparentes</p>
                    <h2 className="text-3xl md:text-4xl font-semibold">Planes para cada etapa de tu negocio</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {plans.map(plan => (
                        <article
                            key={plan.name}
                            className={`rounded-2xl border p-6 bg-black/60 ${plan.popular ? 'border-[#00e9fa] shadow-[0_0_30px_rgba(0,233,250,0.12)]' : 'border-white/10'
                                }`}
                        >
                            {plan.popular && (
                                <span className="inline-block mb-3 text-[10px] uppercase tracking-[0.2em] bg-[#00e9fa] text-black px-3 py-1 rounded-full">
                                    Más popular
                                </span>
                            )}
                            <h3 className="text-xl font-semibold">{plan.name}</h3>
                            <p className="text-[#00e9fa] text-lg mt-2 mb-4">{plan.price}</p>

                            <ul className="space-y-2 text-sm text-gray-300 mb-6">
                                {plan.items.map(item => (
                                    <li key={item}>• {item}</li>
                                ))}
                            </ul>

                            <Link
                                to={`/contacto?plan=${plan.query}`}
                                className="inline-flex w-full justify-center rounded-lg border border-[#00e9fa] px-4 py-3 text-sm font-medium text-[#00e9fa] hover:bg-[#00e9fa] hover:text-black transition-colors"
                            >
                                {plan.cta}
                            </Link>
                        </article>
                    ))}
                </div>

                <p className="text-center text-sm text-gray-400 mt-8">
                    ¿Necesitas algo diferente? Todos los proyectos son cotizados a medida. Escríbenos sin compromiso.
                </p>
            </div>
        </section>
    );
}
