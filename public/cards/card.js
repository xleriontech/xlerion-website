/* =============================================================
 * XLERION — Digital Business Card · Runtime
 *  · Render dinámico desde foundersData
 *  · vCard (.vcf) generado al vuelo
 *  · Tilt 3D (puntero + giroscopio)
 *  · Fondo Three.js: red neuronal de partículas reactiva al giroscopio
 * ============================================================= */

(function () {
  'use strict';

  var D = foundersData[ACTIVE_FOUNDER];
  if (!D) {
    console.error('[XLERION] Fundador no encontrado:', ACTIVE_FOUNDER);
    return;
  }

  var $ = function (sel, root) {
    return (root || document).querySelector(sel);
  };

  /* ---------- Helpers ---------- */
  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function el(tag, className, html) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* =============================================================
   * 1. RENDER
   * ============================================================= */
  function render() {
    var grid = $('#card-grid');
    if (!grid) return;

    /* --- 1. Header / Status --- */
    var top = el('div', 'region region-top');
    top.innerHTML =
      '<div class="brandbar">' +
      '<span class="brand-mark">X</span>' +
      '<span class="brand-name">' + esc(D.brand) + '</span>' +
      '<span class="brand-sub">' + esc(D.brandSub) + '</span>' +
      '</div>' +
      '<span class="status"><span class="dot"></span>' + esc(D.status) + '</span>';

    /* --- 2. Foto + iniciales --- */
    var photo = el('div', 'region region-photo');
    photo.innerHTML =
      '<figure class="photo-frame">' +
      '<span class="photo-img" role="img" aria-label="' + esc(D.photoAlt) + '" style="--src:url(' +
      esc(D.photo) + ');--zoom:' + esc(D.photoZoom || '130%') +
      ';--focus:' + esc(D.photoFocus || '50% 30%') + '"></span>' +
      '<span class="initials-badge">' + esc(D.initials) + '</span>' +
      '<span class="hint">Inclina</span>' +
      '</figure>';

    /* --- 2b. Identidad --- */
    var hero = el('div', 'region region-hero');
    hero.innerHTML =
      '<h1 class="founder-name">' + esc(D.name) + '</h1>' +
      '<p class="founder-role">' + esc(D.role) + '</p>' +
      '<p class="founder-tagline">' + esc(D.tagline) + '</p>';

    /* --- 3. Sección: stack / valor --- */
    var body = el('div', 'region region-body');
    var label = '<h2 class="block-label">' + esc(D.section.label) + '</h2>';

    if (D.section.kind === 'metrics') {
      var ml = el('ul', 'metric-list');
      D.section.items.forEach(function (m) {
        var li = el('li', 'metric');
        li.innerHTML =
          '<span class="metric-ico"><i class="bi ' + esc(m.icon) + '"></i>' +
          '<span class="metric-idx">' + esc(m.index) + '</span></span>' +
          '<span class="metric-txt">' +
          '<p class="metric-title">' + esc(m.title) + '</p>' +
          '<p class="metric-desc">' + esc(m.desc) + '</p>' +
          '</span>';
        ml.appendChild(li);
      });
      body.innerHTML = label;
      body.appendChild(ml);
    } else {
      var cg = el('ul', 'chip-grid');
      D.section.items.forEach(function (c) {
        var li = el('li', 'chip');
        li.innerHTML = '<i class="bi ' + esc(c.icon) + '"></i><span>' + esc(c.text) + '</span>';
        cg.appendChild(li);
      });
      body.innerHTML = label;
      body.appendChild(cg);
    }

    /* --- 4. CTAs --- */
    var ctaWrap = el('div', 'region region-cta');
    var ctas = el('div', 'ctas');

    D.ctas.forEach(function (c) {
      var a = el('a', 'cta cta--' + c.kind);
      a.setAttribute('role', 'button');
      a.innerHTML =
        '<i class="bi ' + esc(c.icon) + '"></i>' +
        '<span class="cta-lbl"><b>' + esc(c.label) + '</b><small>' + esc(c.hint) + '</small></span>';

      if (c.action === 'vcard') {
        a.setAttribute('href', '#');
        a.addEventListener('click', function (e) {
          e.preventDefault();
          downloadVCard(D);
          flashSuccess(a);
        });
      } else if (c.action === 'whatsapp') {
        var msg = encodeURIComponent(D.links.whatsappMessage);
        a.setAttribute('href', 'https://wa.me/' + D.links.whatsapp + '?text=' + msg);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      } else {
        a.setAttribute('href', c.href);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
        if (c.download) a.setAttribute('download', '');
      }
      ctas.appendChild(a);
    });
    ctaWrap.appendChild(ctas);

    /* --- 5. Contacto + QR --- */
    // Acceso dual al telefono: el numero marca (tel:) y el icono abre WhatsApp.
    var waHref = D.links && D.links.whatsapp
      ? 'https://wa.me/' +
        D.links.whatsapp +
        (D.links.whatsappMessage
          ? '?text=' + encodeURIComponent(D.links.whatsappMessage)
          : '')
      : '';

    var contact = el('div', 'region region-contact');
    contact.innerHTML =
      '<ul class="contact-list">' +
      '<li><i class="bi bi-geo-alt-fill"></i><span>' + esc(D.contact.location) + '</span></li>' +
      '<li><i class="bi bi-envelope-fill"></i><a href="mailto:' + esc(D.contact.email) + '">' + esc(D.contact.email) + '</a></li>' +
      '<li class="contact-phone">' +
      '<i class="bi bi-phone-fill"></i>' +
      '<a href="tel:' + esc(D.contact.phoneTel) + '">' + esc(D.contact.phone) + '</a>' +
      (waHref
        ? '<a class="contact-wa" href="' + esc(waHref) + '" target="_blank" rel="noopener noreferrer" ' +
          'aria-label="Hablar por WhatsApp" title="Hablar por WhatsApp">' +
          '<i class="bi bi-whatsapp"></i></a>'
        : '') +
      '</li>' +
      '</ul>' +
      '<button class="qr-wrap qr-trigger" id="qr-trigger" type="button" ' +
      'aria-label="Ampliar el código QR para escanear">' +
      '<span class="qr-frame"><span id="qrcode"></span>' +
      '<span class="qr-expand"><i class="bi bi-arrows-fullscreen"></i></span></span>' +
      '<span class="qr-cap">ESCANEA</span></button>';

    /* --- 5. Barra de canales de distribucion --- */
    var utils = el('div', 'region region-utils');
    utils.id = 'utils';
    utils.innerHTML =
      '<div class="utils">' +
      '<button class="util" id="btn-install" type="button" hidden aria-label="Instalar app" title="Instalar app">' +
      '<i class="bi bi-phone"></i></button>' +
      '<button class="util" id="btn-share" type="button" aria-label="Compartir" title="Compartir">' +
      '<i class="bi bi-share"></i></button>' +
      '<button class="util" id="btn-wallet" type="button" hidden aria-label="Agregar a Wallet" title="Agregar a Wallet">' +
      '<i class="bi bi-wallet2"></i></button>' +
      '<button class="util" id="btn-nfc" type="button" hidden aria-label="Leer NFC" title="NFC disponible">' +
      '<i class="bi bi-broadcast-pin"></i></button>' +
      '<span class="counter" id="counter" hidden><i class="bi bi-bar-chart-line"></i>' +
      '<b data-count>0</b> escaneos</span>' +
      '</div>';

    /* --- 6. Footer: compliance --- */
    var foot = el('div', 'region region-foot');
    foot.innerHTML =
      '<p class="compliance"><i class="bi bi-shield-lock-fill"></i>' + esc(D.disclaimer) + '</p>';

    /* --- Paneles ---
     * En vertical los paneles se disuelven (display:contents) y cada bloque
     * ocupa su propia fila del grid. En horizontal cada panel se convierte en
     * una columna propia: identidad a la izquierda, contenido a la derecha.
     */
    var id = el('div', 'region region-id');
    id.appendChild(top);
    id.appendChild(photo);
    id.appendChild(contact);

    var main = el('div', 'region region-main');
    main.appendChild(hero);
    main.appendChild(body);
    main.appendChild(ctaWrap);
    main.appendChild(utils);

    grid.appendChild(id);
    grid.appendChild(main);
    grid.appendChild(foot);

    /* --- Marcas de esquina --- */
    ['tl', 'tr', 'bl', 'br'].forEach(function (p) {
      grid.parentElement.appendChild(el('span', 'corner corner--' + p));
    });

    /* --- Toast de confirmacion --- */
    grid.parentElement.appendChild(el('div', 'toast'));

    buildQR();
  }

  /* =============================================================
   * 2. vCard dinámico (.vcf)
   * ============================================================= */
  function buildVCard(d) {
    var c = d.contact;
    var lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:' + d.vcard.last + ';' + d.vcard.first + ';;;',
      'FN:' + (d.fullName || d.name),
      'ORG:Xlerion',
      'TITLE:' + d.role,
      'TEL;TYPE=CELL:' + c.phoneTel,
      'EMAIL:' + c.email,
      'URL:' + d.links.portfolio,
      'URL:' + d.links.linkedin,
      'X-SOCIALPROFILE;TYPE=linkedin:' + d.links.linkedin,
      'ADR;TYPE=WORK:;;' + c.location + ';;;Colombia',
      'NOTE:' + (d.vcardNote || d.tagline),
      'REV:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      'END:VCARD',
    ];
    return lines.join('\r\n');
  }

  /* Confirmación visual: el icono del botón pasa a check y vuelve. */
  function flashSuccess(node) {
    if (!node) return;
    var icon = node.querySelector('i');
    if (!icon) return;
    var original = icon.className;
    icon.className = 'bi bi-check-lg';
    node.classList.add('is-success');
    setTimeout(function () {
      icon.className = original;
      node.classList.remove('is-success');
    }, 1600);
  }

  function downloadVCard(d) {
    var vcf = buildVCard(d);
    var blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = d.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '_') + '.vcf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1500);
  }

  /* =============================================================
   * 3. QR
   *
   * qrcodejs deja dos hijos en el contenedor (un <canvas> oculto usado como
   * superficie de dibujo y un <img> con la imagen ya exportada), y cual de
   * los dos queda visible depende del navegador. Para no depender de eso se
   * dibuja la matriz de modulos directamente sobre un canvas propio: un solo
   * elemento, con el tamano en pixeles exactos (multiplo del numero de
   * modulos) para que los bordes caigan en pixeles enteros y el codigo se
   * escanee sin difuminado, a cualquier tamano.
   * ============================================================= */
  var QR_QUIET = 4; // zona de silencio en modulos (la misma que usa qrcodejs)

  /** Devuelve la matriz de modulos del simbolo, o null si no se pudo. */
  function qrMatrix(url) {
    var probe = document.createElement('div');
    var qr = new QRCode(probe, {
      text: url,
      width: 120,
      height: 120,
      correctLevel: QRCode.CorrectLevel.H,
    });
    var m = qr._oQRCode && qr._oQRCode.modules;
    return m && m.length ? m : null;
  }

  /** Pinta la matriz en un canvas y devuelve su medida en pixeles. */
  function drawQr(canvas, matrix, cssSize, dpr) {
    var cells = matrix.length + QR_QUIET * 2;
    var cell = Math.max(1, Math.floor((cssSize * dpr) / cells));
    var px = cell * cells; // multiplo exacto -> modulos nitidos

    canvas.width = px;
    canvas.height = px;
    canvas.style.width = px / dpr + 'px';
    canvas.style.height = px / dpr + 'px';
    // Nunca debe rebasar el marco: si el multiplo exacto no cabe, el
    // navegador lo reduce lo justo (imperceptible) en vez de recortarlo.
    canvas.style.maxWidth = cssSize + 'px';
    canvas.style.maxHeight = cssSize + 'px';
    // Metadatos del render: permiten verificar el codigo desde el QA.
    canvas.dataset.qrCell = String(cell);
    canvas.dataset.qrModules = String(matrix.length);
    canvas.dataset.qrCells = String(cells);
    canvas.dataset.qrPixels = String(px);

    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, px, px);
    ctx.fillStyle = '#050508';
    for (var r = 0; r < matrix.length; r++) {
      for (var c = 0; c < matrix.length; c++) {
        if (matrix[r][c]) {
          ctx.fillRect((c + QR_QUIET) * cell, (r + QR_QUIET) * cell, cell, cell);
        }
      }
    }
    return px;
  }

  /**
   * Destino del QR: el endpoint de TRACKING, no la tarjeta.
   *
   * Se usa el PARAMETRO y no una ruta reescrita (/api/scan.php?founder=x)
   * porque asi no depende de las reglas de reescritura del .htaccess, que en
   * LiteSpeed exigen sustituciones absolutas. Funciona en cualquier servidor.
   *
   * En produccion (xlerion.com.co) el QR escaneado apunta a
   * https://xlerion.com.co/api/scan.php?founder=juliette, que registra el
   * escaneo y responde 302 hacia /mike o /juliette.
   *
   * En local se usa el origen actual para poder probar el circuito completo
   * de tracking sin subir nada.
   */
  function qrTarget() {
    var origin = window.location.origin || '';
    var local = /^(https?:\/\/)?(localhost|127\.0\.0\.1|\[::1\])/i.test(origin);
    var base =
      typeof XLERION_PUBLIC_BASE !== 'undefined' && XLERION_PUBLIC_BASE
        ? XLERION_PUBLIC_BASE
        : 'https://xlerion.com.co';
    return (local ? origin.replace(/\/+$/, '') : base) + '/api/scan.php?founder=' + D.id;
  }

  function buildQR() {
    var box = $('#qrcode');
    if (!box || typeof QRCode === 'undefined') return;

    var matrix = qrMatrix(qrTarget());
    if (!matrix) return;

    box.innerHTML = '';
    var canvas = document.createElement('canvas');
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Código QR de ' + (D.fullName || D.name));
    box.appendChild(canvas);

    var dpr = Math.min(window.devicePixelRatio || 1, 3);
    var cs = window.getComputedStyle(box);
    var inner = box.clientWidth - parseFloat(cs.paddingLeft || 0) - parseFloat(cs.paddingRight || 0);
    var size = inner > 8 ? inner : 44;
    drawQr(canvas, matrix, size, dpr);
  }

  /** Render del QR ampliado para el lightbox. */
  function renderQr(container, url, cssSize) {
    if (typeof QRCode === 'undefined' || !container) return null;

    var matrix = qrMatrix(url);
    if (!matrix) return null;

    container.innerHTML = '';
    var canvas = document.createElement('canvas');
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Código QR de ' + (D.fullName || D.name));
    container.appendChild(canvas);

    var dpr = Math.min(window.devicePixelRatio || 1, 3);
    var px = drawQr(canvas, matrix, cssSize, dpr);
    container.style.setProperty('--qr-w', px / dpr + 'px');
    container.style.setProperty('--qr-h', px / dpr + 'px');
    return canvas;
  }

  /* =============================================================
   * 3b. QR ampliado (lightbox)
   * ============================================================= */
  function buildLightbox() {
    var box = document.createElement('div');
    box.className = 'qr-zoom';
    box.id = 'qr-zoom';
    box.hidden = true;
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Código QR ampliado de ' + (D.fullName || D.name));
    box.innerHTML =
      '<div class="qr-zoom-backdrop" data-qr-close></div>' +
      '<div class="qr-zoom-panel">' +
      '<span class="qr-zoom-corner qr-zoom-corner--tl"></span>' +
      '<span class="qr-zoom-corner qr-zoom-corner--tr"></span>' +
      '<span class="qr-zoom-corner qr-zoom-corner--bl"></span>' +
      '<span class="qr-zoom-corner qr-zoom-corner--br"></span>' +
      '<div class="qr-zoom-frame">' +
      '<div class="qr-zoom-img" id="qr-zoom-img"></div>' +
      '<span class="qr-zoom-scan"></span>' +
      '</div>' +
      '<div class="qr-zoom-meta">' +
      '<span class="qr-zoom-name">' + esc(D.fullName || D.name) + '</span>' +
      '<span class="qr-zoom-hint">ESCANEA PARA ABRIR LA TARJETA</span>' +
      '</div>' +
      '<button class="qr-zoom-close" type="button" data-qr-close aria-label="Cerrar">' +
      '<i class="bi bi-x-lg"></i></button>' +
      '</div>';
    document.body.appendChild(box);
    return box;
  }

  function openLightbox(trigger) {
    var box = document.getElementById('qr-zoom');
    if (!box) box = buildLightbox();

    var img = box.querySelector('#qr-zoom-img');
    // El QR se hace tan grande como quepa sin comerse los bordes ni el alto.
    // El panel añade 64px de cromado horizontal (40 de padding + 24 de la
    // placa) y 106px vertical, mas 32px de margen de seguridad.
    var size = Math.min(
      Math.max(window.innerWidth - 100, 180),
      Math.max(window.innerHeight - 190, 170),
      380
    );
    renderQr(img, qrTarget(), size);

    // El panel crece desde la posicion del QR pulsado. transform-origin es
    // relativo a la propia caja del panel, asi que hay que medirlo SIN
    // transform y con el lightbox ya visible (si esta oculto, el rect es 0).
    var panel = box.querySelector('.qr-zoom-panel');
    box.hidden = false;
    if (trigger && panel) {
      panel.classList.add('is-measuring');
      var pr = panel.getBoundingClientRect();
      panel.classList.remove('is-measuring');
      var r = trigger.getBoundingClientRect();
      panel.style.setProperty(
        '--qr-origin',
        (r.left + r.width / 2 - pr.left) + 'px ' + (r.top + r.height / 2 - pr.top) + 'px'
      );
    }

    // Forzar reflow: sin una lectura de layout el navegador fusiona el cambio
    // de estado y la transicion no se dispara (y dentro de un iframe
    // requestAnimationFrame puede no correr en headless).
    void box.offsetWidth;
    box.classList.add('is-open');
    // Red de seguridad por si algun frame se omite.
    setTimeout(function () {
      box.classList.add('is-open');
    }, 60);
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    var box = document.getElementById('qr-zoom');
    if (!box || box.hidden) return;
    box.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () {
      box.hidden = true;
    }, 340);
  }

  function initQrZoom() {
    var trigger = $('#qr-trigger');
    if (trigger) {
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        openLightbox(trigger);
      });
    }
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-qr-close]')) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* =============================================================
   * 4. Tilt 3D (puntero + giroscopio)
   * ============================================================= */
  function initTilt() {
    var card = $('#card');
    if (!card) return;
    var stage = $('.stage');
    var MAX = 7; // grados

    function apply(rx, ry) {
      card.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
    }

    function reset() {
      card.style.transform = '';
    }

    /* Puntero fino (desktop) */
    if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
      stage.addEventListener('mousemove', function (e) {
        var r = stage.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - 0.5;
        var ny = (e.clientY - r.top) / r.height - 0.5;
        apply(-ny * MAX * 2, nx * MAX * 2);
      });
      stage.addEventListener('mouseleave', reset);
    }

    /* Giroscopio (móvil) — permiso iOS en el primer touch */
    var gyroActive = false;

    function onOrient(e) {
      if (e.gamma == null || e.beta == null) return;
      gyroActive = true;
      var gy = Math.max(-28, Math.min(28, e.gamma || 0));
      var gx = Math.max(-28, Math.min(28, (e.beta || 0) - 45));
      apply(-gx * 0.22, gy * 0.26);
    }

    function attachOrient() {
      window.addEventListener('deviceorientation', onOrient, true);
    }

    if (typeof DeviceOrientationEvent !== 'undefined') {
      var needsPermission =
        typeof DeviceOrientationEvent.requestPermission === 'function';
      if (!needsPermission) {
        attachOrient();
      } else {
        var ask = function () {
          attachOrient();
          window.removeEventListener('touchend', ask);
        };
        window.addEventListener('touchend', ask, { once: true, passive: true });
      }
    }

    /* Touch: arrastre horizontal suave */
    var tx = 0;
    var ty = 0;
    stage.addEventListener(
      'touchmove',
      function (e) {
        if (gyroActive) return;
        var t = e.touches[0];
        if (!t) return;
        var r = stage.getBoundingClientRect();
        var nx = (t.clientX - r.left) / r.width - 0.5;
        var ny = (t.clientY - r.top) / r.height - 0.5;
        tx = nx * MAX * 2;
        ty = -ny * MAX * 2;
        apply(ty, tx);
      },
      { passive: true }
    );

    stage.addEventListener(
      'touchend',
      function () {
        if (!gyroActive) reset();
      },
      { passive: true }
    );
  }

  /* =============================================================
   * 5. Fondo Three.js — red neuronal reactiva al giroscopio
   * ============================================================= */
  function initNeuralBg() {
    var canvas = $('#bg-canvas');
    if (!canvas) return;

    if (typeof THREE === 'undefined') {
      canvas.remove();
      if (!$('.bg-fallback')) {
        document.body.insertBefore(el('div', 'bg-fallback'), document.body.firstChild);
      }
      return;
    }

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 42;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    var COUNT = window.innerWidth < 600 ? 78 : 130;
    var CONNECT = window.innerWidth < 600 ? 13 : 17;

    var pos = new Float32Array(COUNT * 3);
    var vel = new Float32Array(COUNT * 3);
    for (var i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 76;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 48;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 34;
      vel[i * 3] = (Math.random() - 0.5) * 0.16;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.16;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    var nodes = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 0.34,
        color: 0x00e9fa,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    scene.add(nodes);

    /* Aristas */
    var lineMat = new THREE.LineBasicMaterial({
      color: 0x00b8c9,
      transparent: true,
      opacity: 0.11,
    });
    var group = new THREE.Group();
    scene.add(group);

    function rebuildLines() {
      for (var g = group.children.length - 1; g >= 0; g--) {
        var child = group.children[g];
        group.remove(child);
        if (child.geometry) child.geometry.dispose();
      }
      for (var a = 0; a < COUNT; a++) {
        for (var b = a + 1; b < COUNT; b++) {
          var dx = pos[a * 3] - pos[b * 3];
          var dy = pos[a * 3 + 1] - pos[b * 3 + 1];
          var dz = pos[a * 3 + 2] - pos[b * 3 + 2];
          var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < CONNECT) {
            var lg = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(pos[a * 3], pos[a * 3 + 1], pos[a * 3 + 2]),
              new THREE.Vector3(pos[b * 3], pos[b * 3 + 1], pos[b * 3 + 2]),
            ]);
            group.add(new THREE.Line(lg, lineMat));
          }
        }
      }
    }
    rebuildLines();

    /* Parallax por giroscopio / puntero */
    var targetRX = 0;
    var targetRY = 0;
    var curRX = 0;
    var curRY = 0;

    function onOrient(e) {
      if (e.gamma == null || e.beta == null) return;
      targetRY = Math.max(-22, Math.min(22, e.gamma || 0));
      targetRX = Math.max(-16, Math.min(16, ((e.beta || 0) - 45) * 0.7));
    }

    if (typeof DeviceOrientationEvent !== 'undefined') {
      if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
        window.addEventListener('deviceorientation', onOrient, true);
      } else {
        window.addEventListener(
          'touchend',
          function once() {
            window.removeEventListener('touchend', once);
            DeviceOrientationEvent.requestPermission().then(function (r) {
              if (r === 'granted') {
                window.addEventListener('deviceorientation', onOrient, true);
              }
            });
          },
          { once: true, passive: true }
        );
      }
    }

    window.addEventListener('mousemove', function (e) {
      if (typeof DeviceOrientationEvent !== 'undefined') return;
      targetRY = (e.clientX / window.innerWidth - 0.5) * 22;
      targetRX = (e.clientY / window.innerHeight - 0.5) * -14;
    });

    function resize() {
      var w = window.innerWidth;
      var h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', resize);
    resize();

    /* Loop */
    var t0 = performance.now();
    function animate() {
      requestAnimationFrame(animate);
      var now = performance.now();
      var dt = Math.min(0.05, (now - t0) / 1000);
      t0 = now;

      curRX += (targetRX - curRX) * 0.06;
      curRY += (targetRY - curRY) * 0.06;

      for (var i = 0; i < COUNT; i++) {
        pos[i * 3] += vel[i * 3] * dt * 60;
        pos[i * 3 + 1] += vel[i * 3 + 1] * dt * 60;
        pos[i * 3 + 2] += vel[i * 3 + 2] * dt * 60;

        if (pos[i * 3] > 38) pos[i * 3] = -38;
        if (pos[i * 3] < -38) pos[i * 3] = 38;
        if (pos[i * 3 + 1] > 24) pos[i * 3 + 1] = -24;
        if (pos[i * 3 + 1] < -24) pos[i * 3 + 1] = 24;
        if (pos[i * 3 + 2] > 17) pos[i * 3 + 2] = -17;
        if (pos[i * 3 + 2] < -17) pos[i * 3 + 2] = 17;
      }
      geo.attributes.position.needsUpdate = true;

      if (Math.floor(now / 320) !== Math.floor((now - dt * 1000) / 320)) {
        rebuildLines();
      }

      group.rotation.x = curRX * 0.012;
      group.rotation.y = curRY * 0.012;
      nodes.rotation.x = curRX * 0.016;
      nodes.rotation.y = curRY * 0.016;
      nodes.rotation.z = now * 0.00004;

      renderer.render(scene, camera);
    }
    animate();
  }

  /* =============================================================
   * 6. Boot
   * ============================================================= */
  /* =============================================================
   * 5. Brillo que sigue al cursor
   * ============================================================= */
  function initGlow() {
    var card = $('#card');
    if (!card) return;

    var glow = el('div', 'card-glow');
    card.appendChild(glow);

    function move(e) {
      var r = card.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width) * 100;
      var y = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty('--gx', x + '%');
      card.style.setProperty('--gy', y + '%');
    }

    card.addEventListener('pointermove', move, { passive: true });
    // En tactil el brillo se fija en la zona tocada (sin cursor no hay hover).
    card.addEventListener(
      'touchmove',
      function (e) {
        if (e.touches && e.touches[0]) move(e.touches[0]);
      },
      { passive: true }
    );
  }

  function boot() {
    render();
    initTilt();
    initNeuralBg();
    initQrZoom();
    initGlow();
    document.documentElement.setAttribute('data-founder', D.id);
    /* Superficie de test/debug: permite verificar el vCard desde consola o QA */
    window.__xlerion = {
      data: D,
      buildVCard: function () {
        return buildVCard(D);
      },
      downloadVCard: function () {
        downloadVCard(D);
      },
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
