import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, Compass, ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';
import { useAnalytics } from '../hooks/useAnalytics';

export default function NotFoundPage() {
  const { lang } = useLanguage();
  useAnalytics('404_NotFound', 'error');

  const isEn = lang === 'en';

  return (
    <Layout>
      <div className="min-h-[75vh] flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00e9fa]/30 bg-[#00e9fa]/10 text-[#00e9fa] font-mono text-xs uppercase tracking-[0.25em] mb-6">
            <AlertTriangle size={14} />
            <span>Error 404 // {isEn ? 'Resource Missing' : 'Recurso No Encontrado'}</span>
          </div>

          {/* Glitch / Big 404 */}
          <h1 className="text-8xl md:text-9xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00e9fa] to-white/40 drop-shadow-[0_0_35px_rgba(0,233,250,0.3)] mb-4">
            404
          </h1>

          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white mb-4">
            {isEn ? 'Page Not Found' : 'Página No Encontrada'}
          </h2>

          <p className="text-gray-400 text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed font-light">
            {isEn
              ? 'The requested endpoint does not exist or has been restructured under the new modular architecture.'
              : 'La ruta solicitada no existe o fue reestructurada dentro de la nueva arquitectura modular.'}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#00e9fa] text-black font-bold uppercase tracking-wider text-xs hover:bg-[#00c8d8] transition-all duration-300 shadow-[0_0_20px_rgba(0,233,250,0.4)]"
            >
              <Home size={16} />
              <span>{isEn ? 'Back to Home' : 'Volver al Inicio'}</span>
            </Link>

            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-white/20 bg-white/5 text-white font-mono uppercase tracking-wider text-xs hover:border-[#00e9fa] hover:text-[#00e9fa] transition-all duration-300"
            >
              <Compass size={16} />
              <span>{isEn ? 'Contact Us' : 'Contáctanos'}</span>
            </Link>
          </div>

          {/* Direct module links */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-4">
              // {isEn ? 'Direct Access' : 'Accesos Directos'}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-xs font-mono text-gray-400">
              <Link to="/#soluciones" className="hover:text-[#00e9fa] transition-colors">
                &gt; {isEn ? 'Services' : 'Servicios'}
              </Link>
              <Link to="/toolkit" className="hover:text-[#00e9fa] transition-colors">
                &gt; Toolkit
              </Link>
              <Link to="/proyectos" className="hover:text-[#00e9fa] transition-colors">
                &gt; {isEn ? 'Projects' : 'Proyectos'}
              </Link>
              <Link to="/documentacion" className="hover:text-[#00e9fa] transition-colors">
                &gt; {isEn ? 'Docs' : 'Documentación'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
