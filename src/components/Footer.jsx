import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Linkedin, Github } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ navTo }) {
  const { lang, t } = useLanguage();
  const go = (id) => {
    if (navTo) navTo(id);
  };

  const navItems = [
    { key: 'footer_access_home', id: 'home' },
    { key: 'footer_access_soluciones', id: 'soluciones' },
    { key: 'footer_access_tecnologia', id: 'arquitectura' },
    { key: 'footer_access_impacto', id: 'impacto' },
    { key: 'footer_access_fundador', id: 'liderazgo' },
    { key: 'footer_access_contacto', id: 'contacto' },
  ];

  return (
    <footer className="bg-[#050508] pt-20 pb-10 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <img src="/LogoX.png" alt="XLERION Logo" className="h-8 object-contain" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#00e9fa]">
                XLERION
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-mono uppercase leading-relaxed tracking-wider">
              {t('footer_tagline')}
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h4 className="text-[#00e9fa] font-mono text-xs uppercase tracking-[0.2em] font-semibold">
              {t('footer_contact')}
            </h4>
            <div className="space-y-3 text-sm font-sans">
              <a
                href={`mailto:${t('contact_email') || 'contacto@xlerion.co'}`}
                className="flex items-center gap-3 text-white font-mono uppercase tracking-widest hover:text-[#00e9fa] transition-colors"
              >
                <Mail size={16} className="text-[#00e9fa]" /> contacto@xlerion.co
              </a>
              <div className="flex items-center gap-3 text-gray-400 font-mono text-[11px] uppercase tracking-widest">
                <MapPin size={14} className="text-[#00e9fa]/50" />
                <span>Bogotá / Nocaima, Cundinamarca, Colombia</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-5">
            <h4 className="text-[#00e9fa] font-mono text-xs uppercase tracking-[0.2em] font-semibold">
              {t('footer_access')}
            </h4>
            <ul className="space-y-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest list-none p-0 m-0">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => go(item.id)}
                    className="hover:text-[#00e9fa] transition-colors text-left p-0 bg-transparent border-none cursor-pointer"
                  >
                    {t(item.key)}
                  </button>
                </li>
              ))}
              <li>
                <a
                  href="/legal/privacidad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00e9fa] transition-colors text-left p-0 bg-transparent border-none cursor-pointer"
                >
                  {t('footer_legal_privacy')}
                </a>
              </li>
              <li>
                <a
                  href="/legal/terminos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00e9fa] transition-colors text-left p-0 bg-transparent border-none cursor-pointer"
                >
                  {t('footer_legal_terms')}
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-5">
            <h4 className="text-[#00e9fa] font-mono text-xs uppercase tracking-[0.2em] font-semibold">
              {t('footer_networks')}
            </h4>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://linkedin.com/in/miguelrodriguez-dataviz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:border-[#00e9fa]/40 hover:bg-[#00e9fa]/5 transition-all duration-300 text-[11px] font-mono uppercase tracking-widest text-gray-400"
              >
                <Linkedin size={14} className="text-[#00e9fa]" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/miguelxlerion"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:border-[#00e9fa]/40 hover:bg-[#00e9fa]/5 transition-all duration-300 text-[11px] font-mono uppercase tracking-widest text-gray-400"
              >
                <Github size={14} className="text-[#00e9fa]" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-mono text-gray-600 tracking-[0.3em] uppercase text-center md:text-left">
          <div>
            {t('footer_rights')}
          </div>
        </div>
      </div>
    </footer>
  );
}