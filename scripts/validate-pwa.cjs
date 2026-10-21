/**
 * Valida que el manifiesto PWA sea instalable:
 *  - cada icono existe en dist/
 *  - el tamaño declarado en `sizes` coincide EXACTAMENTE con los píxeles reales
 *  - hay al menos un icono >= 192x192 con purpose "any" y uno con "maskable"
 *  - las screenshots declaran dimensiones reales
 *
 * Motivo: el bug "la PWA se instala sin icono" fue causado por declarar
 * "512x512" sobre un archivo que medía 520x470 — Chrome descarta esos iconos.
 *
 * Uso: node scripts/validate-pwa.cjs   (sale con código 1 si algo falla)
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const manifestPath = path.join(DIST, 'manifest.json');

const errors = [];
const warns = [];

function declaredSizes(sizes) {
  // "192x192" | "192x192 512x512" | "any" | "maskable"
  if (!sizes || sizes === 'any' || sizes === 'maskable') return null;
  const m = sizes.match(/^(\d+)x(\d+)$/i);
  return m ? { w: +m[1], h: +m[2] } : null;
}

(async () => {
  if (!fs.existsSync(manifestPath)) {
    console.error('FALLO: no existe dist/manifest.json');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const icons = Array.isArray(manifest.icons) ? manifest.icons : [];

  if (icons.length === 0) errors.push('manifest.icons está vacío');

  let has192any = false;
  let has512any = false;
  let hasMaskable = false;

  for (const icon of icons) {
    const rel = String(icon.src || '').replace(/^\//, '');
    const file = path.join(DIST, rel);

    if (!fs.existsSync(file)) {
      errors.push(`icono ausente en dist/: ${icon.src}`);
      continue;
    }

    const meta = await sharp(file).metadata();
    const declared = declaredSizes(icon.sizes);

    if (icon.sizes && icon.sizes !== 'any' && declared) {
      if (meta.width !== declared.w || meta.height !== declared.h) {
        errors.push(
          `${icon.src}: declara ${icon.sizes} pero mide ${meta.width}x${meta.height}`
        );
      }
    } else if (icon.sizes === 'any' && meta.format !== 'png' && icon.type === 'image/png') {
      warns.push(`${icon.src}: type=${icon.type} pero el formato real es ${meta.format}`);
    }

    const purpose = String(icon.purpose || 'any');
    if (purpose.includes('maskable')) hasMaskable = true;
    if (purpose.includes('any')) {
      if (meta.width >= 192 && meta.height >= 192) has192any = true;
      if (meta.width >= 512 && meta.height >= 512) has512any = true;
    }

    if (meta.width !== meta.height) {
      warns.push(`${icon.src}: no es cuadrado (${meta.width}x${meta.height}) — puede recortarse raro`);
    }
    if (meta.hasAlpha && !purpose.includes('maskable')) {
      // solo informativo: transparencia es válida para purpose "any"
    }
  }

  if (!has192any) errors.push('falta un icono >= 192x192 con purpose "any" (requisito de instalación)');
  if (!has512any) errors.push('falta un icono >= 512x512 con purpose "any" (recomendado / splash)');
  if (!hasMaskable) warns.push('no hay icono con purpose "maskable" (Android lo usa como principal)');

  // Screenshots
  for (const shot of manifest.screenshots || []) {
    const rel = String(shot.src || '').replace(/^\//, '');
    const file = path.join(DIST, rel);
    if (!fs.existsSync(file)) {
      errors.push(`screenshot ausente en dist/: ${shot.src}`);
      continue;
    }
    const meta = await sharp(file).metadata();
    const declared = declaredSizes(shot.sizes);
    if (declared && (meta.width !== declared.w || meta.height !== declared.h)) {
      errors.push(`screenshot ${shot.src}: declara ${shot.sizes} pero mide ${meta.width}x${meta.height}`);
    }
  }

  // Campos mínimos de instalabilidad
  for (const key of ['name', 'short_name', 'start_url', 'display', 'icons']) {
    if (!manifest[key]) errors.push(`manifest falta el campo "${key}"`);
  }

  warns.forEach((w) => console.log('  ⚠  ' + w));

  if (errors.length) {
    console.error('\nManifest PWA INVÁLIDO:');
    errors.forEach((e) => console.error('  ✗ ' + e));
    process.exit(1);
  }

  console.log(
    `✓ Manifest PWA válido — ${icons.length} iconos, ` +
      `${(manifest.screenshots || []).length} screenshot(s)`
  );
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
