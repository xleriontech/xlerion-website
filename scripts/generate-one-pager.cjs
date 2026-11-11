/**
 * Genera public/Xlerion_OnePager.pdf — One-Pager corporativo de XLERION.
 *
 * El copy proviene EXCLUSIVAMENTE de foundersData (public/cards/founders-data.js),
 * de modo que el PDF nunca puede divergir de las tarjetas digitales.
 *
 * Uso: node scripts/generate-one-pager.cjs
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'Xlerion_OnePager.pdf');

// jsPDF (UMD) — se carga desde node_modules sin instalar nada extra.
const { jsPDF } = require(path.join(ROOT, 'node_modules', 'jspdf', 'dist', 'jspdf.umd.min.js'));

// ---------------------------------------------------------------------------
// Datos: se leen del mismo objeto que alimenta las tarjetas
// ---------------------------------------------------------------------------
const dataSrc = fs.readFileSync(
  path.join(ROOT, 'public', 'cards', 'founders-data.js'),
  'utf8'
);
const foundersData = eval(dataSrc + '\n;foundersData;');

const J = foundersData.juliette;
const MIG = foundersData.miguel;

// ---------------------------------------------------------------------------
// Paleta Xlerion
// ---------------------------------------------------------------------------
const CYAN = [0, 233, 250];
const CYAN_DEEP = [0, 184, 201];
const INK = [5, 5, 8];
const PANEL = [15, 15, 26];
const PANEL2 = [26, 26, 46];
const WHITE = [242, 244, 248];
const MUTED = [150, 158, 175];
const GREEN = [46, 230, 168];

const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
const W = doc.internal.pageSize.getWidth();
const H = doc.internal.pageSize.getHeight();
const PAD = 46; // margen

// Fondo
doc.setFillColor(...INK);
doc.rect(0, 0, W, H, 'F');

// Grid técnico 48px
doc.setDrawColor(0, 233, 250);
doc.setLineWidth(0.3);
for (let x = 0; x < W; x += 48) {
  doc.setDrawColor(0, 233, 250);
  doc.setLineWidth(0.25);
  doc.line(x, 0, x, H);
}
for (let y = 0; y < H; y += 48) {
  doc.setLineWidth(0.25);
  doc.line(0, y, W, y);
}
// Re-dibujar el fondo encima del grid tenue no es posible; se usa un overlay oscuro
doc.setFillColor(5, 5, 8);
doc.setGState(new doc.GState({ opacity: 0.88 }));
doc.rect(0, 0, W, H, 'F');
doc.setGState(new doc.GState({ opacity: 1 }));

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------
doc.setFillColor(...CYAN);
doc.rect(PAD, 40, 4, 46, 'F');

doc.setTextColor(...CYAN);
doc.setFont('courier', 'bold');
doc.setFontSize(22);
doc.text('X', PAD + 14, 62);

doc.setTextColor(...WHITE);
doc.setFontSize(15);
doc.text('XLERION', PAD + 34, 62);

doc.setTextColor(...MUTED);
doc.setFontSize(9);
doc.text(J.brandSub, PAD + 108, 62);

doc.setDrawColor(0, 233, 250);
doc.setLineWidth(0.6);
doc.line(PAD, 100, W - PAD, 100);

// ---------------------------------------------------------------------------
// Título
// ---------------------------------------------------------------------------
doc.setTextColor(...CYAN);
doc.setFont('courier', 'bold');
doc.setFontSize(10);
doc.text('ONE-PAGER  //  DEEPTECH INDUSTRIAL', PAD, 132);

doc.setTextColor(...WHITE);
doc.setFont('helvetica', 'bold');
doc.setFontSize(30);
doc.text('Infraestructura DeepTech', PAD, 168);
doc.text('para LATAM.', PAD, 202);

// ---------------------------------------------------------------------------
// Hero + status
// ---------------------------------------------------------------------------
doc.setFillColor(...PANEL);
doc.roundedRect(PAD, 232, W - PAD * 2, 46, 4, 4, 'F');
doc.setFillColor(...GREEN);
doc.circle(PAD + 18, 255, 4, 'F');
doc.setTextColor(...GREEN);
doc.setFont('courier', 'normal');
doc.setFontSize(9);
doc.text(J.status, PAD + 30, 258);

// ---------------------------------------------------------------------------
// Perfil
// ---------------------------------------------------------------------------
const py = 320;
doc.setTextColor(...CYAN);
doc.setFont('courier', 'bold');
doc.setFontSize(8);
doc.text('FUNDADORA', PAD, py - 18);

doc.setTextColor(...WHITE);
doc.setFont('helvetica', 'bold');
doc.setFontSize(20);
doc.text(J.name, PAD, py + 4);

doc.setTextColor(...CYAN);
doc.setFont('courier', 'normal');
doc.setFontSize(10);
doc.text(J.role, PAD, py + 22);

doc.setTextColor(...MUTED);
doc.setFont('helvetica', 'normal');
doc.setFontSize(9.5);
const tagLines = doc.splitTextToSize(J.tagline, W - PAD * 2);
doc.text(tagLines, PAD, py + 42);

// ---------------------------------------------------------------------------
// Valor de negocio
// ---------------------------------------------------------------------------
const vy = py + 88;
doc.setTextColor(...CYAN);
doc.setFont('courier', 'bold');
doc.setFontSize(8);
doc.text('VALOR DE NEGOCIO', PAD, vy);

const colW = (W - PAD * 2 - 24) / 3;
J.section.items.forEach((item, i) => {
  const x = PAD + i * (colW + 12);
  const y = vy + 16;
  const boxH = 138;

  doc.setFillColor(...PANEL);
  doc.roundedRect(x, y, colW, boxH, 4, 4, 'F');
  doc.setFillColor(...CYAN_DEEP);
  doc.rect(x, y, 2, boxH, 'F');

  doc.setTextColor(...CYAN_DEEP);
  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.text(item.index, x + 14, y + 24);

  doc.setTextColor(...WHITE);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  const tLines = doc.splitTextToSize(item.title, colW - 26);
  doc.text(tLines, x + 14, y + 44);

  doc.setTextColor(...MUTED);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const dLines = doc.splitTextToSize(item.desc, colW - 26);
  doc.text(dLines, x + 14, y + 44 + tLines.length * 12 + 6);
});

// ---------------------------------------------------------------------------
// Contacto
// ---------------------------------------------------------------------------
const cy = vy + 186;
doc.setTextColor(...CYAN);
doc.setFont('courier', 'bold');
doc.setFontSize(8);
doc.text('CONTACTO', PAD, cy);

const contactRows = [
  ['LOCATION', J.contact.location],
  ['EMAIL', J.contact.email],
  ['PHONE', J.contact.phone],
  ['LINKEDIN', 'linkedin.com/in/juliette-gt'],
  ['CALENDLY', 'calendly.com/xlerion/15min'],
  ['WEB', 'xlerion.com.co'],
];
contactRows.forEach((r, i) => {
  const x = PAD + (i % 2) * ((W - PAD * 2) / 2);
  const y = cy + 20 + Math.floor(i / 2) * 20;
  doc.setTextColor(...MUTED);
  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.text(r[0], x, y);
  doc.setTextColor(...WHITE);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(r[1], x + 62, y);
});

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
const fy = H - 74;
doc.setDrawColor(30, 30, 44);
doc.setLineWidth(0.6);
doc.line(PAD, fy, W - PAD, fy);

doc.setTextColor(...MUTED);
doc.setFont('courier', 'normal');
doc.setFontSize(7);
const dis = doc.splitTextToSize(J.disclaimer, W - PAD * 2 - 120);
doc.text(dis, PAD, fy + 16);

doc.setTextColor(...CYAN_DEEP);
doc.setFontSize(7);
doc.text('xlerion.com.co', W - PAD, fy + 16, { align: 'right' });

// ---------------------------------------------------------------------------
fs.writeFileSync(OUT, Buffer.from(doc.output('arraybuffer')));
console.log('OK  ->', path.relative(ROOT, OUT), fs.statSync(OUT).size, 'bytes');
