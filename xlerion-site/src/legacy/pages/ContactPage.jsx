import React, { useState } from 'react';
// Supabase client placeholder - user must set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
import { createClient } from '@supabase/supabase-js';

// In Vite, use import.meta.env for environment variables exposed to the client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default function ContactPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('idle');

    const send = async (e) => {
        e.preventDefault();
        if (!name || !email || !message) return setStatus('error_fields');
        setStatus('sending');
        try {
            if (supabase) {
                const { error } = await supabase.from('contacts').insert([{ name, email, message }]);
                if (error) throw error;
                setStatus('success');
                setName(''); setEmail(''); setMessage('');
            } else {
                // Fallback: log to console and simulate success
                console.log('Contact (local):', { name, email, message });
                setTimeout(() => setStatus('success'), 500);
            }
        } catch (err) {
            console.error(err);
            setStatus('error_send');
        }
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-4">Contacto</h1>
            <p className="text-gray-400 mb-6">Escríbenos y te contactaremos pronto.</p>
            <form onSubmit={send} className="max-w-xl">
                <label className="block mb-2">Nombre</label>
                <input className="w-full p-2 mb-4 bg-gray-900 border border-white/10 rounded" value={name} onChange={e => setName(e.target.value)} />
                <label className="block mb-2">Correo</label>
                <input type="email" className="w-full p-2 mb-4 bg-gray-900 border border-white/10 rounded" value={email} onChange={e => setEmail(e.target.value)} />
                <label className="block mb-2">Mensaje</label>
                <textarea className="w-full p-2 mb-4 bg-gray-900 border border-white/10 rounded" rows={6} value={message} onChange={e => setMessage(e.target.value)} />
                <button className="xl-btn-primary" type="submit">Enviar</button>
                <div className="mt-4 text-sm text-gray-300">
                    {status === 'sending' && 'Enviando...'}
                    {status === 'success' && 'Mensaje enviado. Gracias!'}
                    {status === 'error_fields' && 'Por favor completa todos los campos.'}
                    {status === 'error_send' && 'Error al enviar. Intenta nuevamente.'}
                </div>
            </form>
        </div>
    );
}
