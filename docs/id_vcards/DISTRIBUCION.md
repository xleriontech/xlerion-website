# Sistema de Distribución — Tarjetas Digitales Xlerion

Implementación del sistema de distribución de las tarjetas digitales de
**Miguel E. Rodríguez** y **Juliette González**: NFC físico, QR dinámico con
tracking, Apple/Google Wallet, PWA instalable y vCard.

---

## 1. Arquitectura real vs. el prompt

El prompt original proponía Next.js 14 + FastAPI + PostgreSQL + Vercel/Railway.
Este proyecto ya estaba construido con otra pila, yadaptarlo habría meant
reescribir el sitio. La implementación **respeta la pila existente**:

| Prompt original | Implementación real | Motivo |
|---|---|---|
| Next.js 14 App Router | Vite 7 + React 19 (SPA ya existente) | El sitio ya es Vite; reescribirlo era inviable |
| FastAPI (Python) | PHP 8 sobre Apache/cPanel | El hosting ya es Apache y `public/api/contact.php` ya es PHP |
| PostgreSQL + TimescaleDB | JSONL en `api/logs/scans.jsonl` + adaptador PDO/Postgres **opcional** | El hosting compartido no garantiza BD; el adaptador PG está listo si la hay |
| Vercel + Railway | Apache/cPanel (`.htaccess`) | Mismo hosting actual, cero migración |
| `src/pages/mike.tsx` | `public/cards/tarjeta-*.html` | Las tarjetas ya eran HTML autónomo con Three.js y Tilt 3D |
| `/mike`, `/juliette` | Rutas reales servidas por `.htaccess` | Ver §3 |
| `qrcode` de Python | `qrcode` de Python ✔ (usado) | Igual que el prompt |
| `qrcodejs` en cliente | `qrcodejs` (ya presente) | El QR en pantalla se genera en cliente |

---

## 2. Mapa de archivos

```
public/
├── cards/
│   ├── tarjeta-miguel.html        ← tarjeta (documento principal)
│   ├── tarjeta-juliette.html      ← tarjeta (documento principal)
│   ├── founders-data.js           ← foundersData: ÚNICA fuente de verdad
│   ├── card.css                   ← sistema de diseño
│   ├── card.js                    ← render, vCard, tilt, Three.js, QR
│   ├── distribution.js            ← canales: install, share, wallet, NFC, contador
│   ├── manifest-miguel.webmanifest
│   ├── manifest-juliette.webmanifest
│   ├── icons/                     ← iconos PWA + assets de Wallet
│   ├── qr-miguel.png / .svg       ← QR con tracking (300×300)
│   ├── qr-juliette.png / .svg
│   ├── nfc-miguel.txt             ← payload para la NTAG215
│   ├── nfc-juliette.txt
│   ├── _qa.html                   ← QA de 9 viewports con auditoría
│   ├── _test.html                 ← 49/51 checks funcionales
│   └── index.html                 ← vitrina
├── api/
│   ├── scan.php                   ← tracking + 302 + stats
│   ├── vcard.php                  ← .vcf generado al vuelo
│   └── wallet.php                 ← pase Apple (.pkpass) / Google (JWT)
├── .htaccess                      ← rewrites de /api/*, /mike, /juliette
└── service-worker.js              ← precache de los assets de las tarjetas

scripts/
├── generate_qr.py                 ← QR + payload NFC (Python, qrcode)
├── generate-card-assets.cjs       ← iconos PWA + manifests + assets Wallet
└── generate-one-pager.cjs         ← PDF corporativo
```

---

## 3. Rutas públicas

| URL | Qué sirve |
|---|---|
| `https://xlerion.com.co/mike` | Tarjeta de Miguel (**documento principal**, no iframe) |
| `https://xlerion.com.co/juliette` | Tarjeta de Juliette |
| `https://xlerion.com.co/cards/` | Vitrina con las dos tarjetas |
| `https://xlerion.com.co/api/scan.php?founder=miguel` | Tracking → **302** a `/mike` |
| `https://xlerion.com.co/api/scan/juliette` | Tracking → **302** a `/juliette` |
| `https://xlerion.com.co/api/vcard.php?founder=miguel` | `.vcf` generado al vuelo |
| `https://xlerion.com.co/api/wallet.php?founder=miguel&platform=apple` | Pase `.pkpass` |
| `https://xlerion.com.co/api/wallet.php?founder=miguel&platform=google` | JWT de Google Wallet |

Las rutas `/mike` y `/juliette` se sirven como **documento principal** (no un
iframe dentro de la SPA) por tres razones:

1. La PWA es instalable: el manifest y los iconos los ve el documento real.
2. El service worker los controla (funcionan sin conexión).
3. El `start_url` es limpio: `/mike` no rebota a `/cards/tarjeta-miguel.html`.

**En desarrollo**, `vite.config.js` replica exactamente el comportamiento de
producción con dos middlewares:

- `serve-public-in-dev` → alias `/mike` y `/juliette`
- `serve-cards-tracking-in-dev` → replica `/api/scan/*` (registra en
  `public/api/logs/scans.dev.jsonl` y responde 302) para poder probar el
  circuito completo sin subir nada

---

## 4. Canal por canal

### 4.1 PWA instalable — ✅ operativo

Manifest por fundador (`public/cards/manifest-<id>.webmanifest`):

```json
{
  "name": "Xlerion | Miguel E. Rodriguez Martinez",
  "short_name": "Xlerion Card",
  "start_url": "/mike",
  "display": "standalone",
  "background_color": "#0a0a0f",
  "theme_color": "#00d4ff",
  "icons": [ "192/512 any + maskable" ]
}
```

Iconos generados con `sharp` desde las fotos reales, en B&W con marco cian.

El botón **📲 Instalar app** aparece cuando Chrome dispara
`beforeinstallprompt`. En iOS (que no dispara ese evento) el botón siempre
visible y muestra las instrucciones: *Compartir → Añadir a pantalla de inicio*.

### 4.2 QR dinámico con tracking — ✅ operativo

```
GET /api/scan/{founder_id}
```

Registra y responde **302** a `https://xlerion.com.co/{slug}`.

**El destino del QR.** El dominio vive en una constante, no escondido en el
código:

```js
// public/cards/founders-data.js
const XLERION_PUBLIC_BASE = 'https://xlerion.com.co';
```

- En **producción** el QR escaneado apunta a
  `https://xlerion.com.co/api/scan.php?founder={id}` → registra → 302 → `/mike` o `/juliette`
- Se usa el **parámetro** y no una ruta reescrita (`/api/scan/{id}`): asi no
  depende de las reglas de reescritura del `.htaccess`, que en LiteSpeed
  exigen sustituciones absolutas. Las rutas reescritas (`/api/scan/{id}`,
  `/api/vcard/{id}`, `/api/wallet/{id}`) tambien funcionan, pero no hacen
  falta para que el QR funcione.
- En **local** (`localhost:5173`) se usa el origen actual para poder probar el
  circuito completo de tracking sin subir nada

Los QR **impresos** (`qr-*.png` / `qr-*.svg`) y los payloads **NFC** ya se
generan siempre con el dominio de producción:

```bash
python scripts/generate_qr.py                          # base por defecto
python scripts/generate_qr.py --base https://otro.dominio
```

Campos registrados (JSONL, una línea por escaneo):

| Campo | Notas |
|---|---|
| `founder_id` | `miguel` \| `juliette` |
| `timestamp` | ISO 8601 UTC |
| `ip_address` | **enmascarada a /24** por defecto (Ley 1581) |
| `ip_hash` | SHA-256 con sal, para contar visitantes únicos |
| `user_agent` | truncado a 400 chars |
| `referer` | truncado a 500 chars |
| `device_type` | `mobile` \| `tablet` \| `desktop` \| `bot` |
| `source` | `qr` (por defecto), `nfc`, etc. vía `?src=` |

**PostgreSQL opcional.** Si defines `pg` en `config.local.php`, los registros
van también a la tabla `card_scans` (con `TIMESTAMPTZ`, compatible con
TimescaleDB si la tabla se crea como hypertable):

```php
'pg' => [
    'dsn'  => 'pgsql:host=localhost;dbname=xlerion',
    'user' => 'xlerion',
    'pass' => '***',
],
```

Sin esa configuración, el registro va a `public/api/logs/scans.jsonl` (mismo
mecanismo de logging que ya usa `contact.php`). Si el servidor no permite
escribir ahí, ajusta `scan_log_path` en `config.local.php`.

Agregado: `GET /api/scan/{id}?stats=1` →

```json
{ "ok": true, "stats": { "total": 47, "unique": 23, "by_device": {}, "by_source": {}, "by_day": {} } }
```

### 4.3 NFC físico — ✅ payload listo

`public/cards/nfc-miguel.txt` contiene la URL a programar en la NTAG215:

```
https://xlerion.com.co/api/scan/miguel
```

**Misma ruta que el QR**, para que ambos canales compartan métricas.

El botón **📡 NFC** solo aparece en dispositivos con Web NFC API
(Chrome Android). Al pulsarlo llama `ndef.scan()` y muestra el contenido
leído. En iOS no existe Web NFC → el botón se oculta.

### 4.4 Apple Wallet / Google Wallet — ⚠️ plumbing listo, faltan credenciales

El pase se genera **completo** con los datos reales, pero firmarlo exige
credenciales del emisor que ningún prompt puede aportar.

**Apple** (`?platform=apple`):

1. Crear el Pass Type ID en Apple Developer (tipo `storeCard` o `generic`).
2. Descargar el certificado de firma `.p12` y la clave WWDR.
3. Subir las imágenes del pase a `public/cards/icons/`:
   `wallet-logo-<id>.png` (160×160), `wallet-strip-<id>.png` (840×308),
   `wallet-thumb-<id>.png` (300×300), `wallet-icon-<id>.png` (58×58).
4. Configurar en `config.local.php`:

```php
'wallet' => [
    'apple' => [
        'pass_type_id' => 'pass.com.xlerion.mike',
        'team_id'      => 'ABCDE12345',
        'cert_path'    => '/ruta/certificado.p12',
        'cert_pass'    => 'clave-del-p12',
        'pass_type'    => 'storeCard',
    ],
],
```

Con eso, `wallet.php` arma `pass.json`, calcula `manifest.json` (SHA-1 de cada
recurso), lo firma con `openssl_pkcs7_sign` y devuelve el `.pkpass` con el
`Content-Type: application/vnd.apple.pkpass` correcto.

**Google** (`?platform=google`):

1. Crear un proyecto en Google Cloud y habilitar la **Wallet API**.
2. Crear una cuenta de servicio con permiso sobre la API.
3. Configurar:

```php
'wallet' => [
    'google' => [
        'service_account_path' => '/ruta/service-account.json',
        'issuer_id'            => '111111111111',
    ],
],
```

`wallet.php` construye el `GenericPass` (class + object) y firma el JWT
RS256 con la clave de la cuenta de servicio.

**Sin credenciales** ambos responden **501** con el detalle exacto de lo que
falta y una vista previa del pase generado — nunca un archivo corrupto.

### 4.5 vCard dinámica — ✅ operativo

`GET /api/vcard/{founder_id}` devuelve `text/vcard` con `Content-Disposition`
y el `.vcf` exacto que pide el prompt:

```
BEGIN:VCARD
VERSION:3.0
N:Rodriguez Martinez;Miguel E.;;;
FN:Miguel E. Rodriguez Martinez
ORG:Xlerion
TITLE:Founder & Lead Technical Architect
TEL;TYPE=CELL:+573132263265
EMAIL:miguelxlerion@gmail.com
URL:https://xlerion.com.co
URL:https://www.linkedin.com/in/mikerodriguez84
X-SOCIALPROFILE;TYPE=linkedin:https://www.linkedin.com/in/mikerodriguez84
ADR;TYPE=WORK:;;Bogotá;;;Colombia
NOTE:DeepTech Industrial - Gemelos Digitales 3D\, IA RAG\, IoT Industrial
REV:20261111T211858Z
END:VCARD
```

El botón **📥 Agregar a Contactos** de la tarjeta genera el `.vcf` en cliente
(mismo contenido, sin depender del servidor) y muestra un check animado.

### 4.6 Compartir nativo — ✅ operativo

`navigator.share()` en móvil; en escritorio cae a
`navigator.clipboard.writeText()` con fallback a `execCommand('copy')`.

### 4.7 Contador de escaneos — ✅ operativo

`📊 N escaneos` en la barra de canales. Se alimenta de
`/api/scan/{id}?stats=1`. Si el endpoint falla, el contador se oculta en
silencio (nunca rompe la tarjeta).

---

## 5. Detección de plataforma

`distribution.js` detecta el sistema operativo y muestra solo lo relevante:

| | Instalar | Compartir | Wallet | NFC |
|---|---|---|---|---|
| **iOS** | siempre (instrucciones manuales) | ✅ | Apple Wallet | oculto |
| **Android** | con `beforeinstallprompt` | ✅ | Google Wallet | ✅ si hay Web NFC |
| **Escritorio** | con `beforeinstallprompt` | copiar enlace | **oculto** | oculto |

---

## 6. Comandos

```bash
# Regenerar los QR y los payloads NFC (requiere: pip install qrcode pillow)
python scripts/generate_qr.py
python scripts/generate_qr.py --base https://xlerion.com.co

# Regenerar iconos PWA, manifests y assets de Wallet
node scripts/generate-card-assets.cjs

# Regenerar el One-Pager PDF
node scripts/generate-one-pager.cjs

# QA: 9 viewports reales con auditoría automática
#   http://localhost:5173/cards/_qa.html?card=tarjeta-miguel.html
#   http://localhost:5173/cards/_qa.html?card=tarjeta-juliette.html

# Tests funcionales (49/51 checks)
#   http://localhost:5173/cards/_test.html
```

---

## 7. Antes de desplegar

1. **Permiso de escritura**: el hosting debe poder escribir en
   `public/api/logs/`. Si no, define `scan_log_path` en `config.local.php`
   apuntando a una ruta escribible.
2. **`config.local.php`**: créalo desde `config.local.php.example`, **fuera
   del webroot** si es posible. Nunca lo subas al repositorio.
3. **Credenciales de Wallet**: solo si vas a activar Apple/Google Wallet (§4.4).
4. **Cron de mantenimiento** (opcional): rotar `scans.jsonl` por mes con un
   script que lo comprima a `scans-YYYY-MM.jsonl.gz`.
5. **Programar las NTAG215** con `public/cards/nfc-<id>.txt`.
6. **Imprimir los QR**: `public/cards/qr-<id>.svg` (vectorial) o `.png` (300×300).

---

## 8. Ley 1581 de 2012

- Ambas tarjetas muestran el disclaimer completo en el pie:
  *"Tus datos de interacción son procesados bajo la Ley 1581 de 2012 (Habeas Data)
  y no son compartidos con terceros."*
- El registro de escaneos **no guarda la IP completa** por defecto: se guarda
  enmascarada a /24 más un hash con sal. Se puede desactivar con
  `'anonymize_ip' => false` si tienes una base jurídica para ello.
- `public/api/logs/` está bloqueado por `.htaccess` (403): los registros
  contienen datos personales y no se sirven nunca por HTTP.
- El contador de la tarjeta es un dato agregado, no una identificación.

---

## 9. Verificación actual

| | Miguel | Juliette |
|---|---|---|
| Viewports (QA) | **9/9 PASS** | **9/9 PASS** |
| Checks funcionales | **49/49** | **51/51** |
| Endpoints PHP | ✅ 302, 400, stats, .vcf, 501 wallet | ✅ |
| Build | ✅ `npm run build` | ✅ |

**Nota sobre el deployment**: `publicDir: false` en `vite.config.js` significa
que Vite **no** copia `public/` automáticamente. `scripts/copy-assets.cjs` se
encarga de copiar `public/cards/` a `dist/cards/` y
`public/Xlerion_OnePager.pdf` a `dist/`, excluyendo el tooling interno
(`_qa.html`, `_test.html`, `_diag.html`).
