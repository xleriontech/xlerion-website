import React, { useEffect, useState, useRef } from 'react';
import { useChat } from './PanelaIAChatHook';

/* -------------------------------------------------
   PanelaIA - Microsite: Revitalización Cadena Panelera Nocaima
   ------------------------------------------------- */

export const PanelaIAPage = function PanelaIAPage() {
  const { messages, sendMessage, isLoading, clearMessages } = useChat();
  const [typing, setTyping] = useState(false);

  // El <meta name="robots"> vive en index.html y es compartido por toda la SPA:
  // sin la restauracion del cleanup, el noindex se quedaria en las demas rutas.
  useEffect(() => {
    const meta = document.querySelector('meta[name="robots"]');
    if (!meta) return;
    const previous = meta.getAttribute('content');
    meta.setAttribute('content', 'noindex, follow');
    return () => {
      if (previous !== null) meta.setAttribute('content', previous);
    };
  }, []);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;
    setTyping(true);
    await sendMessage(content);
    setTyping(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-black to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-wider indigo-400 mb-2">
            PanelaIA
          </h1>
          <p className="text-sm text-gray-400">
            Asistente técnico — Revitalización Cadena Panelera Nocaima
          </p>
        </header>

        {/* Chat Messages */}
        <div className="space-y-4 max-h-[80vh] overflow-y-auto p-4 bg-gray-900/50 rounded-lg mb-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`${
                msg.role === 'user'
                  ? 'bg-indigo-600/80 rounded-blg p-4 rounded-t'
                  : 'bg-gray-800/80 rounded-blg p-4 rounded-t'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))}

          {isLoading && (
            <div className="bg-gray-800/80 rounded-blg p-4 rounded-t">
              <p className="text-xs text-gray-400">PanelaIA está pensando...</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Escribe tu consulta técnica sobre 3D, IoT, trazabilidad, fondo de pensión..."
            className="flex-1 bg-gray-800/50 border rounded-l-lg border-white/[0.1] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value=""
            onChange={(e) => {}}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(e.target.value)}
          />
          <button
            onClick={() => handleSend('')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-r-lg font-medium transition-colors disabled:opacity-50"
            disabled={!typing}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}