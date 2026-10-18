import React from 'react';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ServiceDetail() {
    return (
        <Layout>
            <section className="pt-28 pb-20 px-6 max-w-4xl mx-auto">
                <Breadcrumbs items={[{ label: 'Servicios', href: '/servicios' }, { label: 'Detalle', href: '#' }]} />
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Título del servicio</h1>
                <p className="text-gray-300 mb-6">Resumen breve (qué problema resuelve).</p>

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Problema</h3>
                        <p className="text-gray-400 leading-relaxed">Descripción clara del problema que enfrentan los clientes.</p>

                        <h3 className="text-xl font-semibold mt-6 mb-2">Solución</h3>
                        <p className="text-gray-400 leading-relaxed">Qué ofrece Xlerion para resolverlo.</p>
                    </div>

                    <aside>
                        <h3 className="text-xl font-semibold mb-2">Beneficios</h3>
                        <ul className="list-disc list-inside text-gray-400">
                            <li>Beneficio 1 (impacto medible)</li>
                            <li>Beneficio 2 (resultado tangible)</li>
                            <li>Beneficio 3 (plazo / ROI estimado)</li>
                        </ul>

                        <div className="mt-6">
                            <a href="/cotizacion" className="xl-btn-primary inline-block">Solicitar propuesta</a>
                        </div>
                    </aside>
                </div>
            </section>
        </Layout>
    );
}
