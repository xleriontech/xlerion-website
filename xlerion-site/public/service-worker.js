const CACHE_NAME = 'xlerion-v2';
const STATIC_CACHE = 'xlerion-static-v2';
const DYNAMIC_CACHE = 'xlerion-dynamic-v2';

// El HTML NO se precachea: se sirve siempre con estrategia red-primero para
// evitar que un despliegue (o un cambio de title/meta) quede oculto tras una
// copia antigua en caché.
const STATIC_ASSETS = [
  '/LogoX.png',
  '/logo-512.png',
  '/logo-1200x1200.png',
  '/favicon.ico',
  '/manifest.json'
];

const EXTERNAL_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Roboto+Mono:ital,wght@0,400;0,700;1,400&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        // add() individual + catch: un asset opcional ausente no debe impedir
        // que el service worker se instale.
        return Promise.all(
          STATIC_ASSETS.map((asset) => cache.add(asset).catch(() => {}))
        );
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // La API nunca se cachea: siempre red.
  if (url.origin === self.location.origin && url.pathname.startsWith('/api/')) return;

  const isSameOrigin = url.origin === self.location.origin;
  const isNavigation = request.mode === 'navigate' || request.destination === 'document';

  // Navegaciones (HTML): red primero; caché solo como respaldo sin conexión.
  if (isSameOrigin && isNavigation) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() =>
          caches.match(request)
            .then((cached) => cached || caches.match('/index.html'))
            .then((fallback) => fallback || new Response('Offline', { status: 503, statusText: 'Offline' }))
        )
    );
    return;
  }

  if (isSameOrigin) {
    // Estáticos: caché primero con revalidación en segundo plano.
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            fetch(request)
              .then((networkResponse) => {
                if (networkResponse.ok) {
                  caches.open(DYNAMIC_CACHE).then((cache) => {
                    cache.put(request, networkResponse.clone());
                  });
                }
              })
              .catch(() => {});
            return cachedResponse;
          }

          return fetch(request)
            .then((networkResponse) => {
              if (networkResponse.ok) {
                const responseClone = networkResponse.clone();
                caches.open(DYNAMIC_CACHE).then((cache) => {
                  cache.put(request, responseClone);
                });
              }
              return networkResponse;
            })
            .catch(() => new Response('Offline', { status: 503, statusText: 'Offline' }));
        })
    );
  } else {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  }
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación de XLERION',
    icon: '/LogoX.png',
    badge: '/LogoX.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      { action: 'explore', title: 'Ver', icon: '/LogoX.png' },
      { action: 'close', title: 'Cerrar', icon: '/LogoX.png' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('XLERION', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
