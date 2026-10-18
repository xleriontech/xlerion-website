import React from 'react';

export default function HeroClean({ title, subtitle, ctaText = 'Explora nuestros servicios', onCta }) {
    return (
        <section className="relative bg-transparent text-white py-20">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                    {title}
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                    {subtitle}
                </p>
                <button
                    onClick={onCta}
                    className="xl-btn-primary inline-flex items-center gap-3"
                >
                    {ctaText}
                </button>
            </div>
        </section>
    );
}
