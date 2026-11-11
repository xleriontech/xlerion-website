/**
 * Instala los logos originales de Xlerion en public/ y los optimiza.
 *
 * Fuentes (docs/logo_xlerion/):
 *   LogoX_Web_clear-01.svg -> version para fondos oscuros (la principal)
 *   LogoX_Web_dark.svg     -> version para fondos claros
 *
 * Salida:
 *   public/LogoX.svg        -> principal (fondo oscuro)
 *   public/LogoX_Dark.svg   -> variante fondo claro
 *   public/LogoX.png        -> raster de alta resolucion (compatibilidad)
 *
 * Uso: node scripts/install-logos.cjs
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'docs', 'logo_xlerion');
const OUT = path.join(ROOT, 'public');

/**
 * Minificacion basica de SVG: quita comentarios, metadata de Illustrator y
 * espacios entre etiquetas. Los SVG originales de Illustrator vienen con
 * ~480KB de paths y metadatos que no aportan nada al render.
 */
function minifySvg(svg) {
  return svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<metadata>[\s\S]*?<\/metadata>/g, '')
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<\?xml[^>]*\?>/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\s+>/g, '>')
    .replace(/\s+\//g, '/')
    .trim();
}

(async () => {
  const clear = fs.readFileSync(path.join(SRC, 'LogoX_Web_clear-01.svg'), 'utf8');
  const dark = fs.readFileSync(path.join(SRC, 'LogoX_Web_dark.svg'), 'utf8');

  const minClear = minifySvg(clear);
  const minDark = minifySvg(dark);

  fs.writeFileSync(path.join(OUT, 'LogoX.svg'), minClear);
  fs.writeFileSync(path.join(OUT, 'LogoX_Dark.svg'), minDark);

  // Raster de alta resolucion para donde se use <img> con PNG.
  // Se recorta el alto sobrante: el viewBox incluye el bloque "ULTIMATE TECH"
  // del wordmark original, que la version nueva ya no trae.
  await sharp(Buffer.from(minClear), { density: 600 })
    .resize({ width: 640, fit: 'inside' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, 'LogoX.png'));

  for (const f of ['LogoX.svg', 'LogoX_Dark.svg', 'LogoX.png']) {
    const p = path.join(OUT, f);
    const before = f.endsWith('.svg')
      ? (f === 'LogoX.svg' ? clear.length : dark.length)
      : 110422;
    console.log(
      `  ${f.padEnd(16)} ${String(fs.statSync(p).size).padStart(7)} bytes  (antes ${before})`
    );
  }
})();
