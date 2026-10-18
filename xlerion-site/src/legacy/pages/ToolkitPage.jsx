import React from 'react';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ToolkitPage() {
    return (
        <Layout>
            <section className="pt-28 pb-20 px-6 max-w-6xl mx-auto">
                <Breadcrumbs items={[{ label: 'Recursos', href: '/recursos' }, { label: 'Toolkit', href: '/toolkit' }]} />
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Toolkit</h1>
                <p className="text-gray-300 mb-6">Colección de herramientas, demos y utilidades para integraciones y pruebas.</p>

                <div className="grid gap-6">
                    <article className="p-6 bg-gray-900 rounded-lg">
                        <h2 className="text-xl font-semibold">Demo interactiva</h2>
                        <p className="text-gray-400">Pequeña demo embebida o enlace a sandbox.</p>
                        <a className="mt-4 xl-btn-primary inline-block" href="/toolkit/demo">Abrir demo</a>
                    </article>

                    <article className="p-6 bg-gray-900 rounded-lg">
                        <h2 className="text-xl font-semibold">Recursos técnicos</h2>
                        <p className="text-gray-400">Enlaces a documentación, snippets y APIs.</p>
                    </article>
                </div>
            </section>
        </Layout>
    );
}
