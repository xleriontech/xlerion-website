/**
 * Genera el set de iconos PWA + el favicon a partir de /public/LogoX_mark.svg
 *
 * El "mark" es la version del logo con SOLO el circuito (sin el wordmark
 * XLERION): a 16-32 px de favicon o en el recorte circular del SO, el texto
 * es ilegible y estorba. Se genera en scripts/install-logos.cjs a partir del
 * original de docs/logo_xlerion.
 *
 * Problema que resuelve: los iconos anteriores declaraban tamaños que NO
 * coincidían con sus píxeles reales (logo-512.png medía 520x470 pero declaraba
 * "512x512"), por lo que Chrome los descartaba del manifiesto y la PWA se
 * instalaba sin icono. Además no existía ningún icono "maskable" válido ni
 * separados los propósitos "any" y "maskable".
 *
 * Salidas:
 *   public/favicon.ico            (16 + 32 + 48)
 *   public/favicon.png            (32)
 *   public/icons/icon-192.png     (any)
 *   public/icons/icon-512.png     (any)
 *   public/icons/icon-maskable-192.png
 *   public/icons/icon-maskable-512.png
 *   public/icons/apple-touch-icon.png (180, opaco)
 *
 * Uso: node scripts/generate-icons.cjs
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SRC_MARK = path.join(ROOT, 'public', 'LogoX_mark.svg');
const OUT = path.join(ROOT, 'public', 'icons');
const OUT_ROOT = path.join(ROOT, 'public');

const BG = '#070710'; // = manifest.background_color
const BG_RGB = { r: 7, g: 7, b: 16, alpha: 1 };

const svgRaw = fs.existsSync(SRC_MARK) ? fs.readFileSync(SRC_MARK, 'utf8') : null;

if (!svgRaw) {
  console.error(
    `ERROR: no existe ${SRC_MARK}.\n` +
      '      Ejecuta primero: node scripts/install-logos.cjs'
  );
  process.exit(1);
}

async function renderMark() {
  return sharp(Buffer.from(svgRaw), { density: 300 }).png().toBuffer();
}

/**
 * Caja que encuadra un contenido de proporción `aspect` (w/h) dentro de un
 * lienzo `size`, con una holgura `pad` (fracción del lado).
 */
function fitBox(size, aspect, pad) {
  const limit = size * pad;
  if (limit / aspect <= limit) {
    return { boxW: Math.floor(limit), boxH: Math.floor(limit / aspect) };
  }
  return { boxH: Math.floor(limit), boxW: Math.floor(limit * aspect) };
}

/**
 * @param size  lado del lienzo cuadrado (px)
 * @param mode  'any' (encuadre en cuadrado) | 'maskable' (círculo seguro)
 * @param pad   fracción de holgura para mode 'any' (0..1 del lado)
 */
async function makeIcon({ size, mode, pad, out }) {
  const rendered = await renderMark();

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
    ({ boxW, boxH } = fitBox(size, aspect, pad));
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
    `  ${path.basename(out).padEnd(26)} ${meta.width}x${meta.height}  ` +
      `${mode.padEnd(9)} contenido ${boxW}x${boxH}  ${st.size} B`
  );
}

/**
 * Construye un .ico con entradas PNG (soportado por todos los navegadores
 * actuales y por el explorador de archivos de Windows).
 */
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reservado
  header.writeUInt16LE(1, 2); // tipo = icono
  header.writeUInt16LE(entries.length, 4);

  const dir = Buffer.alloc(16 * entries.length);
  let offset = 6 + 16 * entries.length;

  entries.forEach((e, i) => {
    const o = i * 16;
    dir.writeUInt8(e.size >= 256 ? 0 : e.size, o); // ancho
    dir.writeUInt8(e.size >= 256 ? 0 : e.size, o + 1); // alto
    dir.writeUInt8(0, o + 2); // paleta
    dir.writeUInt8(0, o + 3); // reservado
    dir.writeUInt16LE(1, o + 4); // planos
    dir.writeUInt16LE(32, o + 6); // bpp
    dir.writeUInt32LE(e.png.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += e.png.length;
  });

  return Buffer.concat([header, dir, ...entries.map((e) => e.png)]);
}

/** Renderiza el mark en un lienzo cuadrado opaco (para el .ico). */
async function squarePng(size) {
  const rendered = await renderMark();
  const trimmed = await sharp(rendered).trim({ background: BG, threshold: 8 }).png().toBuffer();
  const t = await sharp(trimmed).metadata();
  const aspect = t.width / t.height;
  const { boxW, boxH } = fitBox(size, aspect, 0.86);
  const logo = await sharp(trimmed).resize(boxW, boxH, { fit: 'fill' }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: BG_RGB } })
    .composite([{ input: logo, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

(async () => {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  console.log('Generando iconos PWA + favicon (mark: solo el circuito)\n');

  // purpose "any" — se muestran tal cual (diálogo de instalación, escritorio).
  await makeIcon({ size: 192, mode: 'any', pad: 0.86, out: path.join(OUT, 'icon-192.png') });
  await makeIcon({ size: 512, mode: 'any', pad: 0.88, out: path.join(OUT, 'icon-512.png') });

  // purpose "maskable" — el SO recorta con máscara circular.
  await makeIcon({ size: 192, mode: 'maskable', out: path.join(OUT, 'icon-maskable-192.png') });
  await makeIcon({ size: 512, mode: 'maskable', out: path.join(OUT, 'icon-maskable-512.png') });

  // iOS: apple-touch-icon debe ser cuadrado y opaco (no compone transparencias).
  await makeIcon({ size: 180, mode: 'any', pad: 0.84, out: path.join(OUT, 'apple-touch-icon.png') });

  // Favicon multi-resolucion.
  const icoSizes = [16, 32, 48];
  const icoEntries = [];
  for (const s of icoSizes) {
    icoEntries.push({ size: s, png: await squarePng(s) });
  }
  const ico = buildIco(icoEntries);
  fs.writeFileSync(path.join(OUT_ROOT, 'favicon.ico'), ico);
  console.log(`  favicon.ico              ${icoSizes.join('+')}       ${ico.length} B`);

  const fav = await squarePng(32);
  fs.writeFileSync(path.join(OUT_ROOT, 'favicon.png'), fav);
  console.log(`  favicon.png              32x32      ${fav.length} B`);

  console.log('\nOK: public/icons/ + favicon');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
