#!/usr/bin/env node
/**
 * Comprobador de deriva del sitemap.
 *
 * Contrasta las rutas declaradas en el router (src/main.jsx) contra
 * public/sitemap.xml y sale con código 1 si divergen. Se ejecuta como primer
 * paso de `npm run build`, así que un sitemap oxidado bloquea el deploy.
 *
 * Deriva que detecta:
 *  - ruta en el router ausente del sitemap        -> hay que añadirla (o excluirla con motivo)
 *  - URL del sitemap ausente del router           -> URL muerta (el problema de las 42 URLs)
 *  - origen del sitemap distinto del canonical    -> dominio desalineado tras un cambio de host
 *  - robots.txt apuntando a otro origen           -> Google recibe una dirección muerta
 *  - <urlset> duplicado / XML podrido             -> Google no puede parsear el archivo
 *  - <loc> repetidos, <lastmod> futuro o mal formado
 *  - exclusión declarada cuya ruta ya no existe   -> exclusión huérfana
 *  - exclusión declarada sin `noindex` en la página -> omisión injustificada del sitemap
 *
 * Motivo: el sitemap convivía 42 URLs de las cuales solo 4 existían, tenía dos
 * raíces <urlset> (XML inválido, Google no lo leía) y apuntaba al dominio
 * antiguo. Nada avisaba: el archivo se oxidaba en silencio.
 *
 * Uso: node scripts/check-sitemap-drift.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ROUTER = path.join(ROOT, 'src', 'main.jsx');
const SITEMAP = path.join(ROOT, 'public', 'sitemap.xml');
const INDEX_HTML = path.join(ROOT, 'index.html');
const ROBOTS = path.join(ROOT, 'public', 'robots.txt');

/**
 * Rutas que viven en el router pero NO deben aparecer en el sitemap.
 * Cada entrada exige un motivo y la página debe declarar `noindex`; si no lo
 * declara, el comprobador falla: la única razón legítima para omitir una ruta
 * real es que esté marcada como no-indexable.
 */
const EXCLUIDAS = {
  '/panelaia': 'Microsite de demostración; marcado noindex en PanelaIAPage.tsx.',
};

const errors = [];
const warns = [];

function normalizarRuta(p) {
  let r = p.trim();
  if (!r.startsWith('/')) r = '/' + r;
  r = r.replace(/\/{2,}/g, '/');
  if (r.length > 1) r = r.replace(/\/+$/, '');
  return r === '' ? '/' : r;
}

function esRutaNoEstatica(r) {
  return r.includes('*') || /:[A-Za-z0-9_$]/.test(r);
}

/** Lee src/main.jsx y devuelve { rutas, componentes } . */
function parsearRouter() {
  const src = fs.readFileSync(ROUTER, 'utf8');
  const lineas = src.split(/\r?\n/);
  const rutas = [];
  let declaraciones = 0;

  for (const linea of lineas) {
    const ocurrencias = linea.match(/<Route\b/g);
    if (!ocurrencias) continue;
    declaraciones += ocurrencias.length;
    const m = linea.match(/\bpath\s*=\s*["']([^"']*)["']/);
    if (!m) {
      errors.push(`<Route> en la línea "${linea.trim().slice(0, 60)}" sin atributo path ` +
        '(el comprobador asume una ruta por línea; si la reescribes en varias líneas, actualízalo)');
      continue;
    }
    rutas.push({ path: normalizarRuta(m[1]), linea });
  }

  if (declaraciones === 0) {
    errors.push(`${ROUTER}: no se encontró ninguna declaración <Route> — ¿se movió el router?`);
  }

  // nombre del componente por ruta, para poder verificar el noindex
  const nombres = [];
  for (const r of rutas) {
    const m = r.linea.match(/element\s*=\s*\{\s*<([A-Za-z0-9_.$]+)/);
    nombres.push(m ? m[1] : null);
  }

  return { rutas, nombres };
}

/** Especificadores de un archivo que trajeron (o re-exportan) ese símbolo. */
function especificadoresRelacionados(texto, simbolo) {
  const specs = [];
  const re = /(?:import|export)\b[^;\n]*?\bfrom\s*['"]([^'"]+)['"]/g;
  for (const m of texto.matchAll(re)) {
    if (new RegExp(`\\b${simbolo}\\b`).test(m[0])) specs.push(m[1]);
  }
  return specs;
}

/** Resuelve un especificador relativo respecto al archivo que lo importa. */
function resolverModulo(espec, desdeArchivo) {
  if (!espec || !espec.startsWith('.')) return null;
  const base = path.resolve(path.dirname(desdeArchivo), espec);
  const candidatos = [
    base,
    `${base}.tsx`, `${base}.jsx`, `${base}.ts`, `${base}.js`,
    path.join(base, 'index.tsx'), path.join(base, 'index.jsx'),
    path.join(base, 'index.ts'), path.join(base, 'index.js'),
  ];
  return candidatos.find((c) => fs.existsSync(c) && fs.statSync(c).isFile()) || null;
}

/**
 * Archivo donde se DECLARA el componente, siguiendo la cadena de imports.
 * Necesario porque el router apunta a barriles (pages/PanelaIA/index.tsx hace
 * `export default PanelaIAPage`); si buscáramos el noindex solo ahí, una página
 * noindex pasaría por indexable.
 */
function archivoQueDeclara(espec, simbolo, desdeArchivo, vistos = new Set(), prof = 0) {
  const archivo = resolverModulo(espec, desdeArchivo);
  if (!archivo || prof > 5 || vistos.has(archivo)) return null;
  vistos.add(archivo);
  const texto = fs.readFileSync(archivo, 'utf8');
  const declara = new RegExp(`(?:export\\s+)?(?:const|let|var|function|class)\\s+${simbolo}\\b`);
  if (declara.test(texto)) return archivo;

  for (const s of especificadoresRelacionados(texto, simbolo)) {
    const encontrado = archivoQueDeclara(s, simbolo, archivo, vistos, prof + 1);
    if (encontrado) return encontrado;
  }
  return null;
}

/** Desde el router: archivo del componente que renderiza una ruta. */
function componenteDeRuta(nombre, srcRouter) {
  if (!nombre) return null;
  const simbolo = nombre.split('.')[0];
  const spec = especificadoresRelacionados(srcRouter, simbolo)[0];
  if (!spec) return null;
  return archivoQueDeclara(spec, simbolo, ROUTER);
}

function leeSitemap() {
  const xml = fs.readFileSync(SITEMAP, 'utf8');
  const urls = [];

  if ((xml.match(/<urlset\b/g) || []).length !== 1) {
    errors.push('sitemap.xml: debe tener exactamente un elemento <urlset> (dos raíces = XML inválido, Google lo descarta entero)');
  }
  if ((xml.match(/<\?xml/g) || []).length > 1) {
    errors.push('sitemap.xml: más de una declaración <?xml');
  }
  const abiertos = (xml.match(/<url>/g) || []).length;
  const cerrados = (xml.match(/<\/url>/g) || []).length;
  if (abiertos !== cerrados) {
    errors.push(`sitemap.xml: ${abiertos} <url> contra ${cerrados} </url> — hay una entrada sin cerrar`);
  }

  const bloques = xml.match(/<url>[\s\S]*?<\/url>/g) || [];
  for (const bloque of bloques) {
    const loc = (bloque.match(/<loc>\s*([^<\s]+)\s*<\/loc>/) || [])[1];
    const lastmod = (bloque.match(/<lastmod>\s*([^<\s]+)\s*<\/lastmod>/) || [])[1];
    if (!loc) {
      errors.push('sitemap.xml: un bloque <url> no tiene <loc>');
      continue;
    }
    urls.push({ loc, lastmod });
  }
  return urls;
}

function origenDe(loc, archivo) {
  try {
    const u = new URL(loc);
    return u.origin;
  } catch {
    errors.push(`${archivo}: <loc> no es una URL absoluta válida: "${loc}" (los sitemaps no aceptan rutas relativas)`);
    return null;
  }
}

(async () => {
  for (const f of [ROUTER, SITEMAP, INDEX_HTML, ROBOTS]) {
    if (!fs.existsSync(f)) {
      console.error(`FALLO: falta ${path.relative(ROOT, f)}`);
      process.exit(1);
    }
  }

  const srcRouter = fs.readFileSync(ROUTER, 'utf8');
  const { rutas, nombres } = parsearRouter();

  // El origen esperado se deriva del canonical de index.html: un cambio de
  // dominio actualiza el comprobador sin tocar este script.
  const canonical = (fs.readFileSync(INDEX_HTML, 'utf8').match(/rel=["']canonical["']\s+href=["']([^"']+)/) || [])[1];
  const origenEsperado = canonical ? origenDe(canonical, 'index.html (canonical)') : null;
  if (!origenEsperado) {
    warns.push('index.html: no hay <link rel="canonical> absoluto; el origen esperado se toma de la primera URL del sitemap');
  }

  const urls = leeSitemap();
  const hoy = new Date().toISOString().slice(0, 10);

  // ---- derivación del sitemap -------------------------------------------------
  const rutasSitemap = new Map();
  const vistos = new Set();
  for (const entrada of urls) {
    const origen = origenDe(entrada.loc, 'sitemap.xml');
    if (!origen) continue;

    if (origenEsperado && origen !== origenEsperado) {
      errors.push(`sitemap.xml: ${entrada.loc} usa el origen "${origen}" y el canonical dice "${origenEsperado}"`);
    }

    let p;
    try {
      p = new URL(entrada.loc).pathname;
    } catch {
      continue;
    }
    const ruta = normalizarRuta(p);
    if (vistos.has(ruta)) errors.push(`sitemap.xml: <loc> duplicado para ${p}`);
    vistos.add(ruta);
    rutasSitemap.set(ruta, entrada);

    if (entrada.lastmod) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(entrada.lastmod)) {
        errors.push(`sitemap.xml: <lastmod> "${entrada.lastmod}" en ${p} no es YYYY-MM-DD`);
      } else if (entrada.lastmod > hoy) {
        errors.push(`sitemap.xml: <lastmod> "${entrada.lastmod}" en ${p} está en el futuro (hoy es ${hoy})`);
      }
    } else {
      warns.push(`sitemap.xml: ${p} no declara <lastmod> (Google asume una fecha y la penaliza menos, pero es información perdida)`);
    }
  }

  // ---- robots.txt ------------------------------------------------------------
  const robots = fs.readFileSync(ROBOTS, 'utf8');
  for (const linea of robots.split(/\r?\n/)) {
    const m = linea.match(/^\s*Sitemap\s*:\s*(\S+)/i);
    if (!m) continue;
    const origen = origenDe(m[1], 'robots.txt');
    if (origen && origenEsperado && origen !== origenEsperado) {
      errors.push(`robots.txt: "Sitemap: ${m[1]}" apunta a ${origen}, el sitio sirve ${origenEsperado}`);
    }
  }

  // ---- router vs sitemap ------------------------------------------------------
  const estaticas = rutas.filter((r) => !esRutaNoEstatica(r.path));
  const omitidas = [];
  let verificadas = 0;

  for (const r of estaticas) {
    if (rutasSitemap.has(r.path)) {
      verificadas++;
      continue;
    }
    if (EXCLUIDAS[r.path]) {
      const i = rutas.indexOf(r);
      const comp = componenteDeRuta(nombres[i], srcRouter);
      if (!comp) {
        errors.push(`exclusión "${r.path}": no se resolvió el componente del import — no se puede verificar el noindex`);
      } else if (!/noindex/i.test(fs.readFileSync(comp, 'utf8'))) {
        errors.push(
          `exclusión "${r.path}": ${path.relative(ROOT, comp)} no declara "noindex". ` +
          'Una ruta real y indexable debe estar en el sitemap; si de verdad debe quedar fuera, márcala noindex en la página.'
        );
      }
      omitidas.push(r.path);
      continue;
    }
    errors.push(`ruta del router ausente del sitemap: ${r.path} — añádela a public/sitemap.xml o declárala en EXCLUIDAS`);
  }

  for (const ruta of rutasSitemap.keys()) {
    if (!estaticas.some((r) => r.path === ruta)) {
      errors.push(`URL del sitemap sin ruta en el router: ${rutasSitemap.get(ruta).loc} — es una URL muerta (soft-404)`);
    }
  }

  for (const [ruta, motivo] of Object.entries(EXCLUIDAS)) {
    if (!estaticas.some((r) => r.path === ruta)) {
      errors.push(`EXCLUIDAS declara "${ruta}" pero ya no existe en el router (motivo: ${motivo}) — borra la entrada`);
    }
    if (!motivo || !motivo.trim()) {
      errors.push(`EXCLUIDAS["${ruta}"] no tiene motivo; toda exclusión debe justificar por qué no está en el sitemap`);
    }
  }

  // ---- informe ----------------------------------------------------------------
  const resumen =
    `${estaticas.length} rutas estáticas en el router · ${urls.length} URLs en el sitemap · ` +
    `${verificadas} coincidentes` + (omitidas.length ? ` · ${omitidas.length} excluida(s): ${omitidas.join(', ')}` : '');

  warns.forEach((w) => console.log('  ⚠  ' + w));

  if (errors.length) {
    console.error('\nSitemap en DERIVA frente al router:');
    errors.forEach((e) => console.error('  ✗ ' + e));
    console.error(`\n  ${resumen}`);
    console.error('\n  Regenera public/sitemap.xml desde src/main.jsx en el mismo commit que la ruta.\n');
    process.exit(1);
  }

  console.log(`✓ Sitemap alineado con el router — ${resumen}`);
})();
