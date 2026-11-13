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

/**
 * Construye la version "mark" del logo: SOLO el circuito, sin el wordmark
 * "XLERION" ni el simbolo (R).
 *
 * Es la version que usan el favicon y los iconos PWA: a 32 o 192 px el
 * wordmark es ilegible y el sistema operativo recorta el icono en circulo.
 *
 * El SVG de Illustrator esta ordenado por capas:
 *   [simbolo (R)] [sombra del circuito] [trazados] [trazo aqua] [chips]
 *   [raster del wordmark] [letterforms del wordmark]
 * Todo desde el bloque "st3" (raster del wordmark) en adelante se descarta,
 * y la primera capa (simbolo (R)) tambien.
 */
function buildMarkSvg(svg) {
  const cut = svg.indexOf('<g class="st3"');
  if (cut === -1) throw new Error('No se encontro el bloque del wordmark (st3)');

  // "head" ya contiene la cabecera, los <defs> y las capas hasta el wordmark.
  let head = svg.slice(0, cut);
  // Fuera el simbolo (R) (primera capa).
  head = head.replace(/<g class="st4">[\s\S]*?<\/g>\s*/, '');

  return `${head}</svg>`;
}

/**
 * Calcula el viewBox ajustado al contenido real (bounding box de los
 * pixeles con alfa) para que el mark quede encuadrado sin aire extra.
 */
async function tightenViewBox(svg) {
  const box = svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  const [, , vbW, vbH] = box;

  // Se renderiza con un ancho conocido para poder convertir pixxeles -> unidades.
  const RENDER = 1200;
  const probe = svg.replace(/<svg([^>]*)>/, `<svg$1 width="${RENDER}" height="${Math.round((RENDER * vbH) / vbW)}">`);
  const { data, info } = await sharp(Buffer.from(probe), { density: 72 })
    .png()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let minX = info.width;
  let minY = info.height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX <= minX || maxY <= minY) throw new Error('El mark quedo vacio');

  const sx = vbW / info.width;
  const sy = vbH / info.height;
  const x = minX * sx;
  const y = minY * sy;
  const w = (maxX - minX + 1) * sx;
  const h = (maxY - minY + 1) * sy;

  return svg.replace(
    /viewBox="[^"]+"/,
    `viewBox="${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}"`
  );
}

(async () => {
  const report = [];

  // --- Variante para fondos oscuros (la que usa el sitio) ---
  const clearRaw = fs.readFileSync(path.join(SRC, 'LogoX_Web_clear-01.svg'), 'utf8');
  const clear = minifySvg(await inlineImages(clearRaw, report));
  fs.writeFileSync(path.join(OUT, 'LogoX.svg'), clear);

  // --- Variante "mark": solo el circuito (favicon + iconos PWA) ---
  const mark = await tightenViewBox(
    minifySvg(await inlineImages(buildMarkSvg(clearRaw), report))
  );
  fs.writeFileSync(path.join(OUT, 'LogoX_mark.svg'), mark);

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
  for (const f of ['LogoX.svg', 'LogoX_mark.svg', 'LogoX_Dark.svg', 'LogoX.png']) {
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
