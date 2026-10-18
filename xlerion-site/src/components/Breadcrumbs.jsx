import React from 'react';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items = [] }) {
    return (
        <nav className="text-sm text-gray-400 mb-4" aria-label="breadcrumb">
            <ol className="flex items-center gap-2">
                <li>
                    <Link to="/" className="hover:underline text-gray-300">Inicio</Link>
                </li>
                {items.map((it, idx) => (
                    <li key={idx} className="flex items-center">
                        <span className="mx-2">/</span>
                        {it.href ? (
                            <Link to={it.href} className="hover:underline text-gray-300">{it.label}</Link>
                        ) : (
                            <span className="text-gray-500">{it.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
