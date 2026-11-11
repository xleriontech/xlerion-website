/**
 * Genera los assets de las tarjetas digitales:
 *  - Iconos PWA por fundador (192/512, any + maskable)
 *  - Manifests .webmanifest por fundador
 *  - Imagenes del pase de Wallet (logo/strip/thumbnail/icon)
 *
 * Uso: node scripts/generate-card-assets.cjs
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const CARDS = path.join(ROOT, 'public', 'cards');
const ICONS = path.join(CARDS, 'icons');

const BRAND = {
  cyan: { r: 0, g: 233, b: 250 },
  deep: { r: 0, g: 184, b: 201 },
  bg: { r: 5, g: 5, b: 8 },
  cardBg: { r: 15, g: 15, b: 26 },
  manifestBg: '#0a0a0f',
  manifestTheme: '#00d4ff',
};

const FOUNDERS = {
  miguel: {
    slug: 'mike',
    name: 'Miguel E. Rodríguez',
    fullName: 'Miguel E. Rodriguez Martinez',
    photo: path.join(ROOT, 'public', 'images', 'mike-vcard.png'),
    zoom: 1.55,
    focus: '48% 30%',
  },
  juliette: {
    slug: 'juliette',
    name: 'Juliette González',
    fullName: 'Juliette González',
    photo: path.join(ROOT, 'public', 'images', 'juliette-vcard.jpg'),
    zoom: 1.35,
    focus: '62% 26%',
  },
};

const hex = ({ r, g, b }) => `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;

/**
 * Recorta la foto con la misma logica de fondo-position que usa la tarjeta:
 * la imagen se amplia a `zoom` y se enfoca en `focus` (x% y%).
 */
async function photoLayer(photo, size, zoom, focus, { grayscale = true, radius = 0 } = {}) {
  const meta = await sharp(photo).metadata();
  const W = meta.width;
  const H = meta.height;
  const [fx, fy] = focus.split(' ').map((v) => parseFloat(v) / 100);

  const visibleW = W / zoom;
  const visibleH = H / zoom;
  const left = Math.round(fx * W * (1 - 1 / zoom));
  const top = Math.round(fy * H * (1 - 1 / zoom));

  let pipe = sharp(photo)
    .extract({
      left,
      top,
      width: Math.round(visibleW),
      height: Math.round(visibleH),
    })
    .resize(size, size, { fit: 'cover', position: 'centre' });

  if (grayscale) {
    pipe = pipe.grayscale().linear(1.12, -12);
  }

  const buf = await pipe.toBuffer();

  // Capa con los bordes redondeados se aplica encima con el compositor.
  return buf;
}

/**
 * Icono PWA.
 *  - purpose "any":     foto a sangre con marco cian fino.
 *  - purpose "maskable": el contenido (foto enmarcada) queda dentro de la
 *    zona segura del 80% central, que es lo que exigen los lanzadores.
 */
async function makeIcon(founder, size, { maskable = false } = {}) {
  const { photo, zoom, focus } = founder;
  const border = Math.max(2, Math.round(size * 0.022));

  if (!maskable) {
    // Capa 1: rectangulo cian. Capa 2: foto encima y mas pequena -> marco visible.
    const photoInner = await photoLayer(photo, size - border * 2, zoom, focus);
    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { ...BRAND.cyan, alpha: 1 },
      },
    })
      .composite([{ input: photoInner, top: border, left: border, blend: 'over' }])
      .png()
      .toBuffer();
  }

  const safe = Math.round(size * 0.78);
  const photoInner = await photoLayer(photo, safe - border * 2, zoom, focus);
  const framed = await sharp({
    create: {
      width: safe,
      height: safe,
      channels: 4,
      background: { ...BRAND.cyan, alpha: 1 },
    },
  })
    .composite([{ input: photoInner, top: border, left: border, blend: 'over' }])
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { ...BRAND.bg, alpha: 1 },
    },
  })
    .composite([
      {
        input: framed,
        top: Math.round((size - safe) / 2),
        left: Math.round((size - safe) / 2),
        blend: 'over',
      },
    ])
    .png()
    .toBuffer();
}

async function makeManifest(key, f) {
  const manifest = {
    id: `/${f.slug}`,
    name: `Xlerion | ${f.fullName}`,
    short_name: 'Xlerion Card',
    description: `Tarjeta digital de ${f.fullName} — ${f.role}. Xlerion // DEEPTECH_INDUSTRIAL.`,
    start_url: `/${f.slug}`,
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: BRAND.manifestBg,
    theme_color: BRAND.manifestTheme,
    lang: 'es',
    categories: ['business', 'productivity', 'social'],
    icons: [
      {
        src: `/cards/icons/icon-192-${key}.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `/cards/icons/icon-512-${key}.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `/cards/icons/icon-maskable-192-${key}.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: `/cards/icons/icon-maskable-512-${key}.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
  return Buffer.from(JSON.stringify(manifest, null, 2));
}

/** Imagenes del pase de Wallet (spec de PassKit). */
async function makeWalletAssets(key, f) {
  const logo = await makeIcon(f, 160, { maskable: false });
  const thumb = await makeIcon(f, 300, { maskable: false });
  const icon = await makeIcon(f, 58, { maskable: false });

  // strip.png 840x308: fondo de marca con el monograma X y la marca.
  const strip = await sharp({
    create: { width: 840, height: 308, channels: 4, background: { ...BRAND.cardBg, alpha: 1 } },
  })
    .composite([
      {
        input: Buffer.from(
          `<svg width="840" height="308" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#1a1a2e"/>
                <stop offset="100%" stop-color="#050508"/>
              </linearGradient>
            </defs>
            <rect width="840" height="308" fill="url(#g)"/>
            <rect x="0" y="0" width="6" height="308" fill="#00e9fa"/>
            <text x="42" y="130" font-family="Helvetica,Arial,sans-serif" font-size="58"
                  font-weight="700" fill="#00e9fa" letter-spacing="2">X</text>
            <text x="42" y="190" font-family="Helvetica,Arial,sans-serif" font-size="40"
                  font-weight="700" fill="#f2f4f8" letter-spacing="10">XLERION</text>
            <text x="44" y="232" font-family="Helvetica,Arial,sans-serif" font-size="20"
                  fill="#8a8a9a" letter-spacing="4">// DEEPTECH_INDUSTRIAL</text>
          </svg>`
        ),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer();

  return { logo, thumb, icon, strip };
}

(async () => {
  fs.mkdirSync(ICONS, { recursive: true });

  for (const [key, f] of Object.entries(FOUNDERS)) {
    for (const size of [192, 512]) {
      const any = await makeIcon(f, size, { maskable: false });
      fs.writeFileSync(path.join(ICONS, `icon-${size}-${key}.png`), any);
      const mask = await makeIcon(f, size, { maskable: true });
      fs.writeFileSync(path.join(ICONS, `icon-maskable-${size}-${key}.png`), mask);
    }

    const manifest = await makeManifest(key, f);
    fs.writeFileSync(path.join(CARDS, `manifest-${key}.webmanifest`), manifest);

    const w = await makeWalletAssets(key, f);
    fs.writeFileSync(path.join(ICONS, `wallet-logo-${key}.png`), w.logo);
    fs.writeFileSync(path.join(ICONS, `wallet-thumb-${key}.png`), w.thumb);
    fs.writeFileSync(path.join(ICONS, `wallet-icon-${key}.png`), w.icon);
    fs.writeFileSync(path.join(ICONS, `wallet-strip-${key}.png`), w.strip);

    console.log(`OK  ${key}: iconos 192/512 (any+maskable), manifest, wallet assets`);
  }
})();
