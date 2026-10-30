import React from 'react';
import { Link } from 'react-router-dom';

export default function PortfolioItem({ title, excerpt, href, image }) {
    return (
        <article className="bg-black/50 border border-white/10 rounded-md overflow-hidden shadow-md">
            <Link to={href} className="block">
                {image && <img src={image} alt={title} className="w-full h-48 object-cover" />}
                <div className="p-4">
                    <h4 className="text-xl font-semibold mb-2">{title}</h4>
                    <p className="text-gray-300 text-sm">{excerpt}</p>
                </div>
            </Link>
        </article>
    );
}
