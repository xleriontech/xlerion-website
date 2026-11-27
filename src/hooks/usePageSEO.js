import { useEffect } from 'react';

const SITE = 'https://xlerion.com.co';
const DEFAULT_IMAGE = `${SITE}/images/og-cover.jpg`;

function upsertMeta(selector, attr, key, value) {
  if (!value) return;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function upsertLink(rel, href, extra = {}) {
  if (!href) return;
  const extraSelector = Object.entries(extra).map(([k, v]) => `[${k}="${v}"]`).join('');
  let el = document.head.querySelector(`link[rel="${rel}"]${extraSelector}`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function usePageSEO({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  robots = 'index, follow',
  locale = 'es_CO',
}) {
  useEffect(() => {
    const fullTitle = title ? (title.includes('Xlerion') ? title : `${title} | Xlerion`) : 'Xlerion | Gemelos digitales e IoT en tiempo real, Colombia';
    const url = `${SITE}${path.startsWith('/') ? path : `/${path}`}`;
    const desc = description || 'Modelado 3D, IoT y visualización web para ver tu operación en tiempo real. PoC sobre tus datos. Cundinamarca, Colombia.';

    document.title = fullTitle;
    upsertMeta('meta[name="description"]', 'name', 'description', desc);
    upsertMeta('meta[name="robots"]', 'name', 'robots', robots);
    upsertLink('canonical', url);

    upsertMeta('meta[property="og:type"]', 'property', 'og:type', type);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', url);
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', desc);
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', image);
    upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'Xlerion');
    upsertMeta('meta[property="og:locale"]', 'property', 'og:locale', locale);
    upsertMeta('meta[property="og:locale:alternate"]', 'property', 'og:locale:alternate', locale === 'es_CO' ? 'en_US' : 'es_CO');

    upsertLink('alternate', url, { hreflang: 'es' });
    upsertLink('alternate', url, { hreflang: 'en' });
    upsertLink('alternate', url, { hreflang: 'x-default' });

    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    upsertMeta('meta[name="twitter:url"]', 'name', 'twitter:url', url);
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', desc);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);
  }, [title, description, path, image, type, robots, locale]);
}
