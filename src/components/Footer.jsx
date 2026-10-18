import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import FooterVisitorCounter from './FooterVisitorCounter';

export default function Footer({ navTo }) {
  const { lang, t } = useLanguage();
  const go = (id) => {
    if (navTo) navTo(id);
  };

  return (
    <footer className="bg-[#050508] pt-20 pb-10 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-5">
            <img src="/LogoX.png" alt="Xlerion Logo" className="h-10 object-contain" />
            <p className="text-[11px] text-gray-500 font-mono uppercase leading-relaxed tracking-wider">
              {t('footer_tagline')}
            </p>
            <div className="pt-4 border-t border-white/[0.05]">
              <FooterVisitorCounter />
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h4 className="text-[#00e9fa] font-mono text-xs uppercase tracking-[0.2em] font-semibold">
              {t('footer_contact')}
            </h4>
            <a
              href="https://wa.me/573208605600"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-[12px] text-white font-mono uppercase tracking-widest hover:text-[#00e9fa] transition-colors"
            >
              <MessageCircle size={16} className="text-[#00e9fa]" /> +57 3208605600
            </a>
            <div className="flex flex-col gap-2 text-[10px] text-gray-500 font-mono uppercase tracking-widest">
              {[
                'contactus@xlerion.com',
                'support@xlerion.com',
                'sales@xlerion.com',
                'admin@xlerion.com',
                'branding@xlerion.com',
                'toolkit@xlerion.com',
                'neuro@xlerion.com',
                'mike@xlerion.com',
                'totaldarkness@xlerion.com'
              ].map((mail) => (
                <a
                  key={mail}
                  href={`mailto:${mail}`}
                  className="text-gray-400 no-underline hover:text-[#00e9fa] transition-colors flex items-center gap-2"
                >
                  <Mail size={10} className="text-[#00e9fa]/50" />
                  {mail}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-5">
            <h4 className="text-[#00e9fa] font-mono text-xs uppercase tracking-[0.2em] font-semibold">
              {t('footer_access')}
            </h4>
            <ul className="space-y-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest list-none p-0 m-0">
              <li><button onClick={() => go('soluciones')} className="hover:text-[#00e9fa] transition-colors text-left p-0 bg-transparent border-none cursor-pointer">{t('footer_access_services')}</button></li>
              <li><Link to="/toolkit" className="hover:text-[#00e9fa] transition-colors">{t('footer_access_toolkit')}</Link></li>
              <li><Link to="/proyectos" className="hover:text-[#00e9fa] transition-colors">{t('footer_access_projects')}</Link></li>
              <li><Link to="/identidad" className="hover:text-[#00e9fa] transition-colors">{t('footer_access_identity')}</Link></li>
              <li><button onClick={() => go('casos')} className="hover:text-[#00e9fa] transition-colors text-left p-0 bg-transparent border-none cursor-pointer">{t('nav_case_studies')}</button></li>
              <li><Link to="/fundador" className="hover:text-[#00e9fa] transition-colors">{lang === 'en' ? 'Founder' : 'Fundador'}</Link></li>
              <li><Link to="/documentacion" className="hover:text-[#00e9fa] transition-colors">{t('nav_docs')}</Link></li>
              <li><Link to="/cotizacion" className="hover:text-[#00e9fa] transition-colors">{t('nav_pricing')}</Link></li>
              <li><Link to="/legal/privacidad" className="hover:text-[#00e9fa] transition-colors">{t('nav_legal')}</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-5">
            <h4 className="text-[#00e9fa] font-mono text-xs uppercase tracking-[0.2em] font-semibold">
              {t('footer_networks')}
            </h4>
            <div className="grid grid-cols-2 gap-3 text-[10px] font-mono uppercase tracking-widest text-gray-500">
              <a href="https://www.linkedin.com/company/xlerion" className="hover:text-[#00e9fa] transition-colors">LinkedIn</a>
              <a href="https://www.instagram.com/ultimatexlerion/" className="hover:text-[#00e9fa] transition-colors">Instagram</a>
              <a href="https://www.facebook.com/xlerionultimate" className="hover:text-[#00e9fa] transition-colors">Facebook</a>
              <a href="https://www.behance.net/xlerionultimate" className="hover:text-[#00e9fa] transition-colors">Behance</a>
              <a href="https://www.indiegogo.com/es/profile/miguel_rodriguez-martinez_edb9?redirect_reason#/overview" className="hover:text-[#00e9fa] transition-colors">Indiegogo</a>
              <a href="https://www.kickstarter.com/profile/xlerionstudios" className="hover:text-[#00e9fa] transition-colors">Kickstarter</a>
              <a href="https://www.patreon.com/xlerion" className="hover:text-[#00e9fa] transition-colors">Patreon</a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-mono text-gray-600 tracking-[0.3em] uppercase text-center md:text-left">
          <div>
            {t('footer_rights')}<br />
            <span className="text-[#00e9fa]/40">{t('footer_claim')}</span>
          </div>
          <div className="flex gap-8 opacity-40">
            <div className="flex items-center gap-2">
              <MapPin size={10} />
              <span>LAT: 05°04′00″N</span>
            </div>
            <div>
              <span>LONG: 74°23′00″W</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
