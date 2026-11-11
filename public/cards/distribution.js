/* =============================================================
 * XLERION — Tarjetas digitales · Canales de distribución
 *  · PWA instalable (beforeinstallprompt)
 *  · Compartir nativo (Web Share API) con fallback a portapapeles
 *  · Apple Wallet / Google Wallet
 *  · Web NFC (indicador + lectura)
 *  · Contador de escaneos
 *
 * Depende de window.foundersData y window.ACTIVE_FOUNDER.
 * ============================================================= */

(function () {
  'use strict';

  var D =
    (typeof window !== 'undefined' && window.foundersData && window.foundersData[window.ACTIVE_FOUNDER]) ||
    (typeof foundersData !== 'undefined' && typeof ACTIVE_FOUNDER !== 'undefined' && foundersData[ACTIVE_FOUNDER]);
  if (!D) return;

  var $ = function (sel, root) {
    return (root || document).querySelector(sel);
  };

  /* =============================================================
   * Deteccion de plataforma
   * ============================================================= */
  function detectOS() {
    var ua = navigator.userAgent || '';
    var plat = navigator.platform || '';
    var maxTouch = navigator.maxTouchPoints || 0;

    var ios = /iPad|iPhone|iPod/.test(ua) || (plat === 'MacIntel' && maxTouch > 1);
    var android = /Android/.test(ua);
    var isMobile = ios || android || /Mobile|IEMobile|Opera Mini/i.test(ua);

    return {
      ios: ios,
      android: android,
      mobile: isMobile,
      desktop: !isMobile,
      name: ios ? 'ios' : android ? 'android' : 'desktop',
    };
  }

  var OS = detectOS();

  /* =============================================================
   * Toast (confirmaciones y avisos)
   * ============================================================= */
  function toast(message, kind) {
    var box = $('#toast');
    if (!box) return;
    var icon = kind === 'ok' ? 'bi-check-circle-fill' : kind === 'err' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill';
    box.className = 'toast toast--' + (kind || 'info') + ' is-visible';
    box.innerHTML = '<i class="bi ' + icon + '"></i><span>' + message + '</span>';
    clearTimeout(box._t);
    box._t = setTimeout(function () {
      box.classList.remove('is-visible');
    }, 3800);
  }

  /* =============================================================
   * PWA instalable
   * ============================================================= */
  function initInstall(btn) {
    if (!btn) return;
    var deferred = null;

    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferred = e;
      btn.hidden = false;
    });

    window.addEventListener('appinstalled', function () {
      btn.hidden = true;
      toast('App instalada en tu dispositivo', 'ok');
    });

    btn.addEventListener('click', function () {
      if (deferred) {
        deferred.prompt();
        deferred.userChoice.then(function (choice) {
          if (choice.outcome === 'accepted') toast('Instalando Xlerion Card…', 'ok');
          deferred = null;
          btn.hidden = true;
        });
        return;
      }
      // iOS Safari no dispara beforeinstallprompt: se explican los pasos.
      toast('En iOS: Compartir → Añadir a pantalla de inicio', 'info');
    });

    // En iOS se muestra siempre (el usuario debe hacerlo a mano).
    if (OS.ios) btn.hidden = false;
  }

  /* =============================================================
   * Compartir
   * ============================================================= */
  function initShare(btn) {
    if (!btn) return;

    var url = 'https://xlerion.com.co/' + (D.publicSlug || D.id);

    if (navigator.share) {
      btn.dataset.mode = 'share';
      btn.setAttribute('aria-label', 'Compartir tarjeta');
      btn.setAttribute('title', 'Compartir tarjeta');
    } else {
      btn.dataset.mode = 'copy';
      btn.setAttribute('aria-label', 'Copiar enlace');
      btn.setAttribute('title', 'Copiar enlace');
    }

    btn.addEventListener('click', function () {
      if (navigator.share) {
        navigator
          .share({
            title: 'Xlerion | ' + (D.fullName || D.name),
            text: 'Conoce a ' + (D.fullName || D.name) + ', ' + D.role + ' en Xlerion',
            url: url,
          })
          .catch(function () {
            /* el usuario cancelo el dialogo: no es un error */
          });
        return;
      }
      var fallback = function () {
        var ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          toast('Enlace copiado', 'ok');
        } catch (e) {
          toast(url, 'info');
        }
        document.body.removeChild(ta);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          toast('Enlace copiado', 'ok');
        }, fallback);
      } else {
        fallback();
      }
    });
  }

  /* =============================================================
   * Wallet (Apple / Google)
   * ============================================================= */
  function initWallet(btn) {
    if (!btn) return;

    // En escritorio no hay Wallet: se oculta el boton.
    if (OS.desktop) {
      btn.hidden = true;
      return;
    }

    var platform = OS.ios ? 'apple' : 'google';
    btn.dataset.platform = platform;
    btn.setAttribute(
      'aria-label',
      platform === 'apple' ? 'Agregar a Apple Wallet' : 'Agregar a Google Wallet'
    );
    btn.setAttribute(
      'title',
      platform === 'apple' ? 'Agregar a Apple Wallet' : 'Agregar a Google Wallet'
    );

    btn.addEventListener('click', function () {
      btn.classList.add('is-loading');
      fetch('/api/wallet/' + D.id + '?platform=' + platform, { headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (res.status === 501) {
            return res.json().then(function (info) {
              toast('Wallet pendiente de credenciales: ' + (info.missing || 'configurar emisor'), 'err');
            });
          }
          if (!res.ok) throw new Error('HTTP ' + res.status);

          if (platform === 'apple') {
            return res.blob().then(function (blob) {
              var url = URL.createObjectURL(blob);
              var a = document.createElement('a');
              a.href = url;
              a.download = 'xlerion-' + D.id + '.pkpass';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              setTimeout(function () {
                URL.revokeObjectURL(url);
              }, 2000);
              toast('Pase de Wallet descargado', 'ok');
            });
          }

          return res.json().then(function (data) {
            if (data.url) {
              window.location.href = data.url;
            } else {
              toast('Pase generado correctamente', 'ok');
            }
          });
        })
        .catch(function () {
          toast('No se pudo generar el pase de Wallet', 'err');
        })
        .then(function () {
          btn.classList.remove('is-loading');
        });
    });
  }

  /* =============================================================
   * Web NFC
   * ============================================================= */
  function initNfc(btn) {
    if (!btn) return;

    if (!('NDEFReader' in window)) {
      btn.hidden = true;
      return;
    }

    btn.hidden = false;
    btn.setAttribute('aria-label', 'Leer NFC');
    btn.setAttribute('title', 'NFC disponible en este dispositivo');

    var ndef = new NDEFReader();
    btn.addEventListener('click', function () {
      try {
        ndef.scan();
        toast('Acerca la tarjeta NFC al teléfono…', 'info');
      } catch (e) {
        toast('No se pudo iniciar la lectura NFC', 'err');
      }
    });

    ndef.onreading = function (event) {
      var decoder = new TextDecoder();
      var value = '';
      for (var i = 0; i < event.message.records.length; i++) {
        value += decoder.decode(event.message.records[i].data);
      }
      btn.classList.add('is-active');
      toast('NFC leído: ' + value, 'ok');
    };

    ndef.onreadingerror = function () {
      toast('Error al leer el NFC', 'err');
    };
  }

  /* =============================================================
   * Contador de escaneos
   * ============================================================= */
  function initCounter(el) {
    if (!el) return;

    fetch('/api/scan/' + D.id + '?stats=1', { headers: { Accept: 'application/json' } })
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .then(function (data) {
        if (!data || !data.stats) return;
        var total = data.stats.total || 0;
        var unique = data.stats.unique || 0;
        el.querySelector('[data-count]').textContent = total;
        el.setAttribute('title', total + ' escaneos · ' + unique + ' personas unicas');
        el.hidden = false;
      })
      .catch(function () {
        /* el contador es informativo: si falla, se oculta y no molesta */
      });
  }

  /* =============================================================
   * Boot
   * ============================================================= */
  function boot() {
    var utils = $('#utils');
    if (!utils) return;

    initInstall($('#btn-install', utils));
    initShare($('#btn-share', utils));
    initWallet($('#btn-wallet', utils));
    initNfc($('#btn-nfc', utils));
    initCounter($('#counter', utils));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
