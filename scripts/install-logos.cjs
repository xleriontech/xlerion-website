/**
 * Instala los logos originales de Xlerion en public/.
 *
 * Fuentes (docs/logo_xlerion/) — archivos de Illustrator del cliente:
 *   LogoX_Web_clear-01.svg -> version para fondos oscuros (la principal)
 *   LogoX_Web_dark-02.svg  -> version para fondos claros
 *
 * Salida:
 *   public/LogoX.svg        -> principal (fondo oscuro)
 *   public/LogoX_Dark.svg   -> variante fondo claro
 *   public/LogoX.png        -> raster de alta resolucion (compatibilidad)
 *
 * IMPORTANTE: el SVG se reconstruye tal cual desde el original, INCLUIDOS
 * los paths vectoriales del wordmark "XLERION". Los PNGs que el SVG de
 * Illustrator referencia (capas raster del icono y la sombra del wordmark)
 * se embeben como data URI para que el archivo sea autocontenido, pero NO
 * se rasteriza el texto: sus letterforms son los del original.
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
 * Minificacion basica: quita comentarios, metadata de Illustrator y
 * espacios entre etiquetas. Los SVG originales de Illustrator vienen con
 * metadatos que no aportan nada al render.
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

/**
 * Optimiza un PNG de capa (colores planos + alfa) y lo devuelve en base64.
 * Las capas del logo son formas planas: la paleta comprime mucho sin
 * perdida visible (85 KB -> ~10 KB por capa).
 */
async function pngToBase64(file) {
  const src = path.join(SRC, file);
  const buf = await sharp(src)
    .png({ palette: true, compressionLevel: 9, effort: 10, quality: 100 })
    .toBuffer();
  return { b64: buf.toString('base64'), bytes: buf.length, original: fs.statSync(src).size };
}

/**
 * Embebe los PNGs referenciados por el SVG como data URI.
 *
 * El original de Illustrator usa xlink:href a archivos sueltos. Al publicar
 * en public/ esos archivos no existirian (el SVG se sirve solo), asi que se
 * sustituyen por data URI. Se usa `href` (no xlink:href) porque es lo que
 * soportan los navegadores actuales.
 */
async function inlineImages(svg, report) {
  const files = [...new Set([...svg.matchAll(/xlink:href="([^"]+\.png)"/g)].map((m) => m[1]))];
  let out = svg;
  for (const file of files) {
    const { b64, bytes, original } = await pngToBase64(file);
    out = out.split(`xlink:href="${file}"`).join(`href="data:image/png;base64,${b64}"`);
    report.push({ file, original, optimized: bytes });
  }
  return out;
}

(async () => {
  const report = [];

  // --- Variante para fondos oscuros (la que usa el sitio) ---
  const clearRaw = fs.readFileSync(path.join(SRC, 'LogoX_Web_clear-01.svg'), 'utf8');
  const clear = minifySvg(await inlineImages(clearRaw, report));
  fs.writeFileSync(path.join(OUT, 'LogoX.svg'), clear);

  // --- Variante para fondos claros ---
  const darkRaw = fs.readFileSync(path.join(SRC, 'LogoX_Web_dark-02.svg'), 'utf8');
  const dark = minifySvg(await inlineImages(darkRaw, report));
  fs.writeFileSync(path.join(OUT, 'LogoX_Dark.svg'), dark);

  // --- Raster de alta resolucion para <img> con PNG ---
  await sharp(Buffer.from(clear), { density: 600 })
    .resize({ width: 640, fit: 'inside' })
    .png({ compressionLevel: 9, palette: true, quality: 100 })
    .toFile(path.join(OUT, 'LogoX.png'));

  console.log('  capas embebidas:');
  for (const r of report) {
    console.log(
      `    ${r.file.padEnd(30)} ${String(r.original).padStart(7)} -> ${String(r.optimized).padStart(7)} bytes`
    );
  }

  console.log('  salida:');
  for (const f of ['LogoX.svg', 'LogoX_Dark.svg', 'LogoX.png']) {
    console.log(`    ${f.padEnd(16)} ${String(fs.statSync(path.join(OUT, f)).size).padStart(7)} bytes`);
  }

  // Verificacion: el wordmark debe conservar sus letterforms vectoriales.
  const paths = (clear.match(/<path/g) || []).length;
  if (paths < 12) {
    console.error(
      `\n  ERROR: el SVG solo tiene ${paths} paths. El wordmark XLERION deberia ser vectorial.`
    );
    process.exit(1);
  }
  console.log(`  ${paths} paths vectoriales (wordmark XLERION incluido)`);
})().catch((err) => {
  console.error('ERROR:', err);
  process.exit(1);
});
