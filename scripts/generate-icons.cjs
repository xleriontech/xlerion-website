/**
 * Genera el set de iconos PWA a partir de la fuente vectorial /public/LogoX.svg
 *
 * Problema que resuelve: los iconos anteriores declaraban tamaños que NO
 * coincidian con sus píxeles reales (logo-512.png medía 520x470 pero declaraba
 * "512x512"), por lo que Chrome los descartaba del manifiesto y la PWA se
 * instalaba sin icono. Además no existía ningún icono "maskable" válido ni
 * separados los propósitos "any" y "maskable".
 *
 * Variantes:
 *   - "lockup"  -> circuito + texto XLERION / ULTIMATE TECH
 *   - "mark"    -> solo el circuito (texto eliminado del SVG); legible a 192px
 *                  y seguro dentro del recorte circular del SO (maskable).
 *
 * Salidas (public/icons/): ver MANIFEST al final del archivo.
 *
 * Uso: node scripts/generate-icons.cjs
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SRC_SVG = path.join(ROOT, 'public', 'LogoX.svg');
const SRC_PNG = path.join(ROOT, 'public', 'LogoX.png');
const OUT = path.join(ROOT, 'public', 'icons');

const BG = '#070710'; // = manifest.background_color
const BG_RGB = { r: 7, g: 7, b: 16, alpha: 1 };
const RENDER_W = 2000; // raster de origen, alto para que el recorte sea nítido

const svgRaw = fs.existsSync(SRC_SVG) ? fs.readFileSync(SRC_SVG, 'utf8') : null;
// "mark": se eliminan los <text> para dejar solo el trazado de circuito.
const svgMark = svgRaw ? svgRaw.replace(/<text[\s\S]*?<\/text>\s*/g, '') : null;

async function renderSource(variant) {
  if (variant === 'mark' && svgMark) {
    return sharp(Buffer.from(svgMark), { density: 300 }).png().toBuffer();
  }
  if (svgRaw) {
    return sharp(Buffer.from(svgRaw), { density: 300 }).png().toBuffer();
  }
  return sharp(SRC_PNG).png().toBuffer();
}

/**
 * @param size        lado del lienzo cuadrado (px)
 * @param variant     'lockup' | 'mark'
 * @param mode        'any' (encuadre en cuadrado) | 'maskable' (círculo seguro)
 * @param pad         fracción de holgura para mode 'any' (0..1 del lado)
 */
async function makeIcon({ size, variant, mode, pad, out }) {
  const rendered = await renderSource(variant);

  // Encuadre: recortar al contenido real para centrarlo con honestidad.
  const trimmed = await sharp(rendered)
    .trim({ background: BG, threshold: 8 })
    .png()
    .toBuffer();
  const t = await sharp(trimmed).metadata();
  const aspect = t.width / t.height; // w/h

  let boxW, boxH;
  if (mode === 'maskable') {
    // Safe zone = círculo de diámetro 80% del lienzo. El rectángulo de
    // contenido debe caber inscrito: diag = h * sqrt(1 + aspect^2) <= 0.8 * size
    const hMax = (0.8 * size) / Math.sqrt(1 + aspect * aspect);
    boxH = Math.floor(hMax);
    boxW = Math.floor(hMax * aspect);
  } else {
    // Encuadre simple dentro de (size * pad), conservando proporción.
    const limit = size * pad;
    if (limit / aspect <= limit) {
      boxW = Math.floor(limit);
      boxH = Math.floor(limit / aspect);
    } else {
      boxH = Math.floor(limit);
      boxW = Math.floor(limit * aspect);
    }
  }

  const logo = await sharp(trimmed)
    .resize(boxW, boxH, { fit: 'fill' })
    .png()
    .toBuffer();

  await sharp({ create: { width: size, height: size, channels: 4, background: BG_RGB } })
    .composite([{ input: logo, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toFile(out);

  const meta = await sharp(out).metadata();
  const st = fs.statSync(out);
  if (meta.width !== size || meta.height !== size) {
    throw new Error(`${path.basename(out)}: tamaño declarado ${size} != real ${meta.width}x${meta.height}`);
  }
  console.log(
    `  ${path.basename(out).padEnd(24)} ${meta.width}x${meta.height}  ` +
      `${variant}/${mode}  contenido ${boxW}x${boxH}  ${st.size} B`
  );
}

(async () => {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  console.log('Generando iconos PWA\n');

  // purpose "any" — se muestran tal cual (diálogo de instalación, escritorio).
  await makeIcon({ size: 192, variant: 'lockup', mode: 'any', pad: 0.88, out: path.join(OUT, 'icon-192.png') });
  await makeIcon({ size: 512, variant: 'lockup', mode: 'any', pad: 0.9, out: path.join(OUT, 'icon-512.png') });

  // purpose "maskable" — el SO recorta con máscara circular: solo el mark.
  await makeIcon({ size: 192, variant: 'mark', mode: 'maskable', out: path.join(OUT, 'icon-maskable-192.png') });
  await makeIcon({ size: 512, variant: 'mark', mode: 'maskable', out: path.join(OUT, 'icon-maskable-512.png') });

  // iOS: apple-touch-icon debe ser cuadrado y opaco (no compone transparencias).
  await makeIcon({ size: 180, variant: 'lockup', mode: 'any', pad: 0.86, out: path.join(OUT, 'apple-touch-icon.png') });

  console.log('\nOK: public/icons/');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
