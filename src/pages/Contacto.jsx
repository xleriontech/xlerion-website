import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAnalytics } from '../hooks/useAnalytics';

const projectTypeOptions = [
    'Landing page',
    'Sitio web',
    'Aplicación web',
    'Automatización',
    '3D / Interactivo',
    'Otro',
];

const budgetOptions = [
    'Menos de $1M COP',
    '$1M - $3M COP',
    '$3M - $7M COP',
    'Más de $7M COP',
    'No sé aún',
];

export default function Contacto() {
    useAnalytics('Contacto Cotización', 'page');
    const [searchParams] = useSearchParams();

    const initialMessage = useMemo(() => {
        const plan = searchParams.get('plan');
        const servicio = searchParams.get('servicio');

        if (plan) return `Hola, quiero cotizar el ${plan}.`;
        if (servicio) return `Hola, quiero cotizar el servicio: ${servicio}.`;
        return '';
    }, [searchParams]);

    const [form, setForm] = useState({
        name: '',
        email: '',
        projectType: searchParams.get('servicio') || '',
        budget: searchParams.get('plan') || '',
        description: initialMessage,
    });
    const [status, setStatus] = useState('idle');

    const onChange = event => {
        const { name, value } = event.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const onSubmit = async event => {
        event.preventDefault();

        if (!form.name || !form.email || !form.description) {
            setStatus('error_fields');
            return;
        }

        setStatus('sending');

        const message = [
            `Tipo de proyecto: ${form.projectType || 'No especificado'}`,
            `Presupuesto estimado: ${form.budget || 'No especificado'}`,
            '',
            form.description,
        ].join('\n');

        try {
            const response = await fetch('/api/send-email.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    message,
                }),
            });

            if (!response.ok) {
                throw new Error('No se pudo enviar la cotización');
            }

            setStatus('success');
            setForm({
                name: '',
                email: '',
                projectType: '',
                budget: '',
                description: '',
            });
        } catch {
            setStatus('error_send');
        }
    };

    return (
        <Layout>
            <div className="bg-black text-white pt-24">
                <section className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-10">
                    <aside className="order-1 lg:order-none">
                        <p className="text-[#00e9fa] uppercase tracking-[0.2em] text-xs mb-3">Cotización</p>
                        <h1 className="text-4xl md:text-5xl font-semibold mb-4">Cuéntanos tu proyecto y te enviamos propuesta</h1>
                        <p className="text-gray-300 mb-6">
                            Te ayudamos a aterrizar alcance, tiempos y presupuesto de forma clara desde el primer contacto.
                        </p>

                        <div className="space-y-3 text-gray-200">
                            <p>
                                <span className="text-[#00e9fa]">Email:</span> contacto@xlerion.tech
                            </p>
                            <p>Respuesta en menos de 24 horas hábiles</p>
                            <p>Lunes a viernes, 8am - 6pm (COT)</p>
                        </div>
                    </aside>

                    <form onSubmit={onSubmit} className="border border-white/10 rounded-2xl p-6 bg-black/60 space-y-4">
                        <div>
                            <label className="block text-sm mb-2">Nombre completo *</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={onChange}
                                required
                                className="w-full rounded-lg bg-black border border-white/20 px-4 py-3 focus:border-[#00e9fa] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2">Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={onChange}
                                required
                                className="w-full rounded-lg bg-black border border-white/20 px-4 py-3 focus:border-[#00e9fa] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2">Tipo de proyecto</label>
                            <select
                                name="projectType"
                                value={form.projectType}
                                onChange={onChange}
                                className="w-full rounded-lg bg-black border border-white/20 px-4 py-3 focus:border-[#00e9fa] outline-none"
                            >
                                <option value="">Selecciona una opción</option>
                                {projectTypeOptions.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm mb-2">Presupuesto estimado</label>
                            <select
                                name="budget"
                                value={form.budget}
                                onChange={onChange}
                                className="w-full rounded-lg bg-black border border-white/20 px-4 py-3 focus:border-[#00e9fa] outline-none"
                            >
                                <option value="">Selecciona un rango</option>
                                {budgetOptions.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm mb-2">Descripción del proyecto *</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={onChange}
                                rows={6}
                                required
                                placeholder="Cuéntame brevemente qué necesitas..."
                                className="w-full rounded-lg bg-black border border-white/20 px-4 py-3 focus:border-[#00e9fa] outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-[#00e9fa] text-black font-medium px-4 py-3 hover:opacity-90 transition-opacity"
                        >
                            Enviar cotización →
                        </button>

                        <p className="text-sm text-gray-300 min-h-6">
                            {status === 'sending' && 'Enviando cotización...'}
                            {status === 'success' && '¡Listo! Recibimos tu solicitud.'}
                            {status === 'error_fields' && 'Completa los campos obligatorios.'}
                            {status === 'error_send' && 'No se pudo enviar. Intenta de nuevo.'}
                        </p>
                    </form>
                </section>
            </div>
        </Layout>
    );
}
