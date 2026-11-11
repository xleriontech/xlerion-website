/**
 * Genera un contact sheet con candidatos de encuadre para las fotos de las
 * tarjetas, replicando exactamente la matemática de
 * `background-size: zoom%` + `background-position: focus%` usada en card.css.
 *
 * visibleW = W / zoom
 * left     = focusX * W * (1 - 1/zoom)
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'docs', 'id_vcards');

const CANDIDATES = {
  mike: {
    file: path.join(ROOT, 'public', 'images', 'mike-vcard.png'),
    list: [
      [1.20, 50, 25],
      [1.20, 50, 40],
      [1.35, 50, 30],
      [1.35, 50, 45],
      [1.50, 50, 35],
      [1.50, 50, 50],
      [1.65, 50, 40],
      [1.65, 50, 55],
    ],
  },
  juliette: {
    file: path.join(ROOT, 'public', 'images', 'juliette-vcard.jpg'),
    list: [
      [1.10, 60, 20],
      [1.10, 68, 20],
      [1.25, 60, 25],
      [1.25, 68, 25],
      [1.40, 64, 30],
      [1.40, 72, 30],
      [1.55, 68, 35],
      [1.55, 76, 35],
    ],
  },
};

const TILE = 260;
const LABEL = 26;

async function build(name, cfg) {
  const img = sharp(cfg.file);
  const meta = await img.metadata();
  const W = meta.width;
  const H = meta.height;

  const tiles = [];
  for (const [zoom, fx, fy] of cfg.list) {
    const vw = W / zoom;
    const vh = H / zoom;
    const left = Math.round((fx / 100) * W * (1 - 1 / zoom));
    const top = Math.round((fy / 100) * H * (1 - 1 / zoom));

    const buf = await sharp(cfg.file)
      .extract({ left, top, width: Math.round(vw), height: Math.round(vh) })
      .resize(TILE, TILE, { fit: 'cover' })
      .grayscale()
      .linear(1.05, -4)
      .png()
      .toBuffer();

    const label = Buffer.from(
      `<svg width="${TILE}" height="${LABEL}"><rect width="${TILE}" height="${LABEL}" fill="#0f0f1a"/>` +
        `<text x="6" y="17" font-family="monospace" font-size="13" fill="#00e9fa">z${zoom} fx${fx} fy${fy}</text></svg>`
    );
    tiles.push({ buf, label });
  }

  const cols = 4;
  const rows = Math.ceil(tiles.length / cols);
  const composites = tiles.map((t, i) => ({
    input: t.label,
    left: (i % cols) * TILE,
    top: Math.floor(i / cols) * (TILE + LABEL),
  }));
  tiles.forEach((t, i) => {
    composites.push({
      input: t.buf,
      left: (i % cols) * TILE,
      top: Math.floor(i / cols) * (TILE + LABEL) + LABEL,
    });
  });

  const out = await sharp({
    create: {
      width: cols * TILE,
      height: rows * (TILE + LABEL),
      channels: 3,
      background: { r: 5, g: 5, b: 8 },
    },
  })
    .composite(composites)
    .png()
    .toBuffer();

  const dest = path.join(OUT, `_candidates-${name}.png`);
  fs.writeFileSync(dest, out);
  console.log('OK', path.relative(ROOT, dest), `${W}x${H}`);
}

(async () => {
  for (const [name, cfg] of Object.entries(CANDIDATES)) {
    await build(name, cfg);
  }
})();
