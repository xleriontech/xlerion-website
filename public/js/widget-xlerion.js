/*
 * Asistente Xlerion — widget embebible (vanilla JS, sin dependencias).
 *
 * Siempre visible. Si /api/chat?health=1 responde { enabled: true } el chat
 * funciona contra el proxy; si no, el panel muestra el protocolo de respaldo
 * con contacto directo y la informacion basica de servicios.
 *
 * Privacidad (Ley 1581 de 2012 / Decreto 1377 de 2013): el usuario acepta el
 * aviso antes de la primera consulta; el proxy no guarda el texto, solo un
 * hash tecnico para auditoria.
 */
(function () {
  'use strict';

  var ENDPOINT = '/api/chat';
  var CONSENT_VERSION = '2026-11';
  var CONSENT_KEY = 'xlerion_chat_consent';
  var PRIVACY_URL = '/legal/privacidad';
  var MAX_HISTORY = 6;

  var history = [];
  var busy = false;
  var live = null;
  var fallbackShown = false;

  function storageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      /* modo privado: la sesion vive en memoria */
    }
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function mount() {
    if (document.getElementById('xlerion-chat-root')) return;

    var host = document.createElement('div');
    host.id = 'xlerion-chat-root';
    document.body.appendChild(host);

    var root = host.attachShadow({ mode: 'open' });

    var style = document.createElement('style');
    style.textContent = [
      ':host{all:initial}',
      '.fab{position:fixed;right:20px;bottom:20px;z-index:2147483000;display:flex;align-items:center;justify-content:center;width:58px;height:58px;border:0;border-radius:50%;cursor:pointer;background:radial-gradient(circle at 50% 50%,#070710 0 58%,transparent 59%),linear-gradient(135deg,#00e9fa,#7c3aed);box-shadow:0 10px 30px rgba(0,233,250,.35)}',
      '.fab-icon{width:32px;height:32px;object-fit:contain;display:block}',
      '.fab:focus-visible{outline:2px solid #00e9fa;outline-offset:3px}',
      '.panel{position:fixed;right:20px;bottom:88px;z-index:2147483000;display:none;flex-direction:column;width:min(380px,calc(100vw - 40px));height:min(560px,calc(100vh - 120px));border-radius:16px;background:#0a0a12;color:#e8eaf2;border:1px solid rgba(0,233,250,.25);overflow:hidden;font:14px/1.5 Inter,system-ui,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.55)}',
      '.panel.open{display:flex}',
      'header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:14px 16px;background:linear-gradient(135deg,rgba(0,233,250,.12),rgba(124,58,237,.16));border-bottom:1px solid rgba(255,255,255,.08)}',
      'header strong{display:block;font-size:14px;letter-spacing:.04em}',
      'header small{color:#9aa3b2;font-size:11px}',
      '.close{border:0;background:transparent;color:#9aa3b2;font-size:20px;line-height:1;cursor:pointer;padding:0 2px}',
      '.close:hover{color:#e8eaf2}',
      '.log{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}',
      '.msg{max-width:86%;padding:10px 12px;border-radius:12px;white-space:pre-wrap;word-wrap:break-word}',
      '.msg.bot{align-self:flex-start;background:#12121d;border:1px solid rgba(255,255,255,.07)}',
      '.msg.user{align-self:flex-end;background:rgba(0,233,250,.16);border:1px solid rgba(0,233,250,.35)}',
      '.meta{font-size:11px;color:#8a93a5;margin-top:8px;white-space:normal}',
      '.meta a{color:#00e9fa;text-decoration:none;margin-right:6px}',
      '.msg p{margin:0 0 8px}',
      '.msg p:last-child{margin:0}',
      '.msg .sec{display:block;font-weight:600;color:#e8eaf2;margin:10px 0 6px}',
      '.msg ul{margin:0 0 8px 18px;padding:0}',
      '.msg li{margin:0 0 6px}',
      '.msg a{color:#00e9fa}',
      '.gate{padding:14px;border-top:1px solid rgba(255,255,255,.08);background:#0d0d17}',
      '.gate p{margin:0 0 10px;font-size:12px;color:#c3c9d6}',
      '.gate a{color:#00e9fa}',
      '.row{display:flex;gap:8px}',
      '.row[hidden]{display:none}',
      'input{flex:1;min-width:0;padding:10px 12px;border-radius:10px;border:1px solid rgba(255,255,255,.14);background:#070710;color:#e8eaf2;font:inherit}',
      'input:focus{outline:2px solid rgba(0,233,250,.45);outline-offset:1px}',
      'button.primary{padding:10px 14px;border:0;border-radius:10px;cursor:pointer;font-weight:600;color:#070710;background:linear-gradient(135deg,#00e9fa,#7c3aed)}',
      'button.primary[disabled]{opacity:.45;cursor:not-allowed}',
      '.foot{padding:0 14px 10px;font-size:10px;color:#6f7889;margin:0}',
      '.foot[hidden]{display:none}',
      '[hidden]{display:none!important}'
    ].join('\n');
    root.appendChild(style);

    var fab = el('button', 'fab');
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Abrir asistente Xlerion');
    var fabIcon = document.createElement('img');
    fabIcon.src = '/LogoX_mark.svg';
    fabIcon.alt = '';
    fabIcon.width = 32;
    fabIcon.height = 32;
    fabIcon.className = 'fab-icon';
    fab.appendChild(fabIcon);

    var panel = el('section', 'panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Asistente Xlerion');

    var header = el('header');
    var titles = el('div');
    titles.appendChild(el('strong', null, 'Asistente Xlerion'));
    var sub = el('small', null, 'Respuestas basadas en fuentes oficiales');
    titles.appendChild(sub);
    var closeBtn = el('button', 'close', '\u00d7');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Cerrar asistente');
    header.appendChild(titles);
    header.appendChild(closeBtn);

    var log = el('div', 'log');
    log.setAttribute('aria-live', 'polite');

    var gate = el('div', 'gate');
    var gateText = el('p');
    gateText.appendChild(el('strong', null, 'Aviso de privacidad. '));
    gateText.appendChild(document.createTextNode(
      'Tus mensajes se tratan conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013. ' +
      'En este sitio no se almacena el texto de la conversación, solo un hash técnico para ' +
      'auditoría; el procesamiento se realiza con un proveedor de IA externo. '
    ));
    var privacyLink = el('a', null, 'Política de tratamiento');
    privacyLink.href = PRIVACY_URL;
    privacyLink.target = '_blank';
    privacyLink.rel = 'noopener';
    gateText.appendChild(privacyLink);
    gateText.appendChild(document.createTextNode('.'));
    var acceptBtn = el('button', 'primary', 'Aceptar y continuar');
    acceptBtn.type = 'button';
    gate.appendChild(gateText);
    gate.appendChild(acceptBtn);

    var composer = el('div', 'row');
    composer.hidden = true;
    var input = el('input');
    input.type = 'text';
    input.maxLength = 500;
    input.placeholder = 'Escribe tu pregunta…';
    input.setAttribute('aria-label', 'Tu pregunta');
    var sendBtn = el('button', 'primary', 'Enviar');
    sendBtn.type = 'button';
    composer.appendChild(input);
    composer.appendChild(sendBtn);

    var foot = el('p', 'foot', 'La IA puede equivocarse. Verifica siempre la fuente citada.');
    foot.hidden = true;

    panel.appendChild(header);
    panel.appendChild(log);
    panel.appendChild(gate);
    panel.appendChild(composer);
    panel.appendChild(foot);

    root.appendChild(fab);
    root.appendChild(panel);

    function link(href, label) {
      var a = el('a', null, label);
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      return a;
    }

    function addListItem(list, title, text) {
      var li = el('li');
      if (title) li.appendChild(el('strong', null, title));
      if (text) li.appendChild(document.createTextNode(title ? ' ' + text : text));
      list.appendChild(li);
    }

    function addFallback() {
      if (fallbackShown) return;
      fallbackShown = true;
      sub.textContent = 'Contacto directo con el equipo';

      var msg = el('div', 'msg bot');
      msg.appendChild(el('p', null,
        '\u26a0\ufe0f Nuestro asistente de IA est\u00e1 experimentando un alto volumen de consultas o ' +
        'mantenimiento t\u00e9cnico en este momento. Para brindarte la atenci\u00f3n DeepTech que mereces, ' +
        'te ofrecemos dos opciones:'));

      msg.appendChild(el('span', 'sec', '\ud83d\udcde Contacto directo con especialistas'));
      var contacts = el('ul');
      var wa = el('li');
      wa.appendChild(document.createTextNode('WhatsApp: '));
      wa.appendChild(link('https://wa.me/573132263265', '+57 313 226 3265'));
      contacts.appendChild(wa);
      var mail = el('li');
      mail.appendChild(document.createTextNode('Email: '));
      mail.appendChild(link('mailto:contacto@xlerion.com.co', 'contacto@xlerion.com.co'));
      contacts.appendChild(mail);
      var li = el('li');
      li.appendChild(document.createTextNode('LinkedIn: '));
      li.appendChild(link('https://www.linkedin.com/in/mikerodriguez84', 'linkedin.com/in/mikerodriguez84'));
      contacts.appendChild(li);
      msg.appendChild(contacts);

      msg.appendChild(el('span', 'sec', '\ud83d\udccb Mientras tanto, informaci\u00f3n b\u00e1sica sobre nuestros servicios'));
      var faq = el('ul');
      addListItem(faq, 'Gemelos Digitales 3D (SmartFactory).',
        'Monitoreo de telemetr\u00eda industrial y mantenimiento predictivo con renderizado GPU en navegador. Stack: React 18, Three.js, FastAPI, Docker.');
      addListItem(faq, 'Asistentes RAG Corporativos.',
        'B\u00fasqueda en conocimiento no estructurado con IA generativa controlada. Stack: Python, LangChain, PostgreSQL/pgvector.');
      addListItem(faq, 'Backend IoT Resiliente.',
        'Ingesta de datos en entornos de conectividad intermitente. Stack: Python Asyncio, MQTT, TimescaleDB, Linux Edge.');
      msg.appendChild(faq);

      msg.appendChild(el('p', null,
        'Hito institucional: Xlerion se encuentra inscrita en el Banco de Postulaci\u00f3n de Empresas de la ' +
        'Industria Digital del MinTIC (documento p\u00fablico del 19 de agosto de 2025, NIT 81720164, Cundinamarca).'));
      msg.appendChild(el('p', null,
        '\ud83d\udd12 Tus datos ser\u00e1n tratados conforme a la Ley 1581 de 2012 (Habeas Data). ' +
        'Gracias por tu paciencia. El equipo de Xlerion.'));

      log.appendChild(msg);
      /* El aviso de disculpa y los contactos van al inicio: no saltar al final. */
      log.scrollTop = 0;
    }

    function greet() {
      if (log.children.length) return;
      addMessage('bot', 'Hola. Soy el asistente de Xlerion. Puedo explicarte nuestras soluciones, ' +
        'casos de \u00e9xito y nuestra inscripci\u00f3n en el Banco de Postulaci\u00f3n de Empresas de la ' +
        'Industria Digital del MinTIC 2025. \u00bfQu\u00e9 necesitas?');
    }

    function applyMode() {
      if (live === false) {
        sub.textContent = 'Contacto directo con el equipo';
        composer.hidden = true;
        foot.hidden = true;
        if (hasConsent()) addFallback();
      } else {
        sub.textContent = 'Respuestas basadas en fuentes oficiales';
        if (hasConsent()) {
          composer.hidden = false;
          foot.hidden = false;
          greet();
        }
      }
    }

    function setConsent() {
      storageSet(CONSENT_KEY, CONSENT_VERSION);
      gate.hidden = true;
      applyMode();
      if (live !== false) input.focus();
    }

    function hasConsent() {
      return storageGet(CONSENT_KEY) === CONSENT_VERSION;
    }

    function refreshLive() {
      return fetch(ENDPOINT + '?health=1', { cache: 'no-store' })
        .then(function (response) { return response.ok ? response.json() : null; })
        .then(function (health) { live = !!(health && health.enabled === true); })
        .catch(function () { live = false; })
        .then(function () { applyMode(); return live; });
    }

    function togglePanel(force) {
      var open = typeof force === 'boolean' ? force : !panel.classList.contains('open');
      panel.classList.toggle('open', open);
      fab.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open && hasConsent()) applyMode();
      if (open && live === false && !fallbackShown) refreshLive();
      if (open && live !== false) input.focus();
    }

    function addMessage(role, text, sources) {
      var msg = el('div', 'msg ' + role, text);
      if (sources && sources.length) {
        var meta = el('div', 'meta', 'Fuente: ');
        sources.forEach(function (s) {
          var a = el('a', null, s.title || s.url);
          a.href = s.url;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          meta.appendChild(a);
        });
        msg.appendChild(meta);
      }
      log.appendChild(msg);
      log.scrollTop = log.scrollHeight;
      return msg;
    }

    function ask() {
      var text = input.value.trim();
      if (!text || busy) return;
      if (live === false) {
        addFallback();
        return;
      }

      busy = true;
      sendBtn.disabled = true;
      input.value = '';
      addMessage('user', text);
      var pending = addMessage('bot', '…');

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({
          question: text,
          history: history.slice(-MAX_HISTORY),
          consent: true,
          consent_version: CONSENT_VERSION
        })
      })
        .then(function (response) {
          return response.json()
            .catch(function () { return {}; })
            .then(function (body) { return { ok: response.ok, status: response.status, body: body }; });
        })
        .then(function (result) {
          pending.remove();
          if (!result.ok || !result.body.answer) {
            if (result.status === 429) {
              addMessage('bot', 'Has alcanzado el límite de consultas por minuto. Espera un momento e intenta de nuevo.');
            } else {
              addFallback();
            }
            return;
          }
          addMessage('bot', result.body.answer, result.body.sources);
          history.push({ role: 'user', content: text });
          history.push({ role: 'assistant', content: result.body.answer });
          if (history.length > MAX_HISTORY) history = history.slice(-MAX_HISTORY);
        })
        .catch(function () {
          pending.remove();
          addFallback();
        })
        .finally(function () {
          busy = false;
          sendBtn.disabled = false;
          input.focus();
        });
    }

    fab.addEventListener('click', function () { togglePanel(); });
    closeBtn.addEventListener('click', function () { togglePanel(false); });
    acceptBtn.addEventListener('click', setConsent);
    sendBtn.addEventListener('click', ask);
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') ask();
    });
    panel.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') togglePanel(false);
    });

    if (hasConsent()) gate.hidden = true;
    applyMode();
    refreshLive();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
