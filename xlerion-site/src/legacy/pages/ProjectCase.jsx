import React from 'react';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ProjectCase() {
    return (
        <Layout>
            <section className="pt-28 pb-20 px-6 max-w-6xl mx-auto">
                <Breadcrumbs items={[{ label: 'Proyectos', href: '/proyectos' }, { label: 'Caso', href: '#' }]} />
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Caso de estudio</h1>
                <p className="text-gray-300 mb-6">Breve resumen del proyecto, objetivos y resultados.</p>

                <div className="space-y-6">
                    <div className="bg-gray-900 p-6 rounded-lg">
                        <h3 className="font-semibold">Contexto</h3>
                        <p className="text-gray-400">Descripción del cliente y desafío.</p>
                    </div>

                    <div className="bg-gray-900 p-6 rounded-lg">
                        <h3 className="font-semibold">Solución</h3>
                        <p className="text-gray-400">Qué se entregó y cómo se implementó.</p>
                    </div>

                    <div className="bg-gray-900 p-6 rounded-lg">
                        <h3 className="font-semibold">Resultados</h3>
                        <p className="text-gray-400">Métricas clave y aprendizajes.</p>
                        <a className="mt-4 xl-btn-primary inline-block" href="/contact">Contáctanos para replicarlo</a>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
