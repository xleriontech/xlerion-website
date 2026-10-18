import React from 'react';

export default function ServiceBlock({ title, description, icon, reverse = false }) {
    return (
        <div className={`flex flex-col md:flex-row items-center gap-6 py-8 ${reverse ? 'md:flex-row-reverse' : ''}`}>
            <div className="w-full md:w-1/3 flex justify-center">
                <div className="w-36 h-36 rounded-lg bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center shadow-lg">
                    {icon}
                </div>
            </div>
            <div className="w-full md:w-2/3">
                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                <p className="text-gray-300">{description}</p>
            </div>
        </div>
    );
}
