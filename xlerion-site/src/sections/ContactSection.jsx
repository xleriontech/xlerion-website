import React from 'react';
import { AtSign, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';
import ContactForm from '../components/ContactForm';

export default function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contacto" className="py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
      <div data-reveal>
        <SectionHeader title={t('contact_title')} subtitle={t('contact_subtitle')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
        <div data-reveal className="stagger-1">
          <ContactForm />
        </div>

        <div className="space-y-6">
          <div data-reveal className="stagger-2 bg-[#0a0a12]/80 border border-[#00e9fa]/20 p-6 md:p-8 rounded-lg border-l-4 border-l-[#00e9fa] backdrop-blur-sm glow-on-hover">
            <h3 className="text-[#00e9fa] font-mono text-xs mb-6 uppercase tracking-[0.2em]">
              {'// '}{t('contact_channels_title')}
            </h3>
            <div className="space-y-4 text-sm font-sans">
              <a
                href="https://wa.me/573208605600"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 border border-[#00e9fa]/40 bg-black/40 hover:border-[#00e9fa] hover:bg-[#00e9fa]/5 transition-all duration-300 rounded-lg group"
              >
                <span className="flex items-center gap-3 text-white">
                  <MessageCircle size={18} className="text-[#00e9fa] group-hover:scale-110 transition-transform duration-300" />
                  {t('contact_whatsapp')}
                </span>
                <span className="font-mono text-xs text-gray-400 group-hover:text-[#00e9fa] transition-colors duration-300">+57 3208605600</span>
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-300 font-mono uppercase tracking-widest">
                {[
                  'contactus@xlerion.com',
                  'totaldarkness@xlerion.com',
                  'support@xlerion.com',
                  'sales@xlerion.com',
                  'admin@xlerion.com',
                  'branding@xlerion.com',
                  'toolkit@xlerion.com',
                  'neuro@xlerion.com',
                  'mike@xlerion.com',
                ].map((email) => (
                  <a key={email} href={`mailto:${email}`} className="flex items-center gap-2 hover:text-[#00e9fa] transition-colors duration-200">
                    <AtSign size={12} className="text-[#00e9fa]/50" />{email}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div data-reveal className="stagger-3 bg-[#0a0a12]/80 border border-white/[0.08] p-6 md:p-8 rounded-lg backdrop-blur-sm glow-on-hover">
            <h3 className="text-[#00e9fa] font-mono text-xs uppercase tracking-[0.2em] mb-4">
              {'// '}{t('contact_social_title')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px] font-mono uppercase tracking-widest text-gray-400">
              {[
                { name: 'LinkedIn', url: 'https://www.linkedin.com/company/xlerion' },
                { name: 'Indiegogo', url: 'https://www.indiegogo.com/es/profile/miguel_rodriguez-martinez_edb9?redirect_reason#/overview' },
                { name: 'Kickstarter', url: 'https://www.kickstarter.com/profile/xlerionstudios' },
                { name: 'Patreon', url: 'https://www.patreon.com/xlerion' },
                { name: 'Instagram', url: 'https://www.instagram.com/ultimatexlerion/' },
                { name: 'Facebook', url: 'https://www.facebook.com/xlerionultimate' },
                { name: 'Behance', url: 'https://www.behance.net/xlerionultimate' },
              ].map((social) => (
                <a key={social.name} href={social.url} className="hover:text-[#00e9fa] transition-colors duration-200">{social.name}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
