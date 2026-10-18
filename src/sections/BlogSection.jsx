import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SectionHeader } from '../components/ui';

export default function BlogSection() {
  const { t } = useLanguage();

  const posts = [
    { key: 'origin', titleKey: 'blog_origin_title', descKey: 'blog_origin_desc' },
    { key: 'modular', titleKey: 'blog_modular_title', descKey: 'blog_modular_desc' },
    { key: 'documentation', titleKey: 'blog_documentation_title', descKey: 'blog_documentation_desc' },
    { key: 'diagnostic', titleKey: 'blog_diagnostic_title', descKey: 'blog_diagnostic_desc' },
  ]

  return (
    <section id="blog" className="py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto">
      <SectionHeader title={t('blog_title')} subtitle={t('blog_subtitle')} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {posts.map((post) => (
          <div key={post.key} className="bg-[#0a0a12]/80 border border-white/[0.08] p-5 md:p-6 rounded-lg backdrop-blur-sm hover:border-[#00e9fa]/20 transition-colors">
            <h3 className="font-semibold text-white text-sm mb-3">
              {t(post.titleKey)}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">{t(post.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
