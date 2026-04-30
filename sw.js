const CACHE_NAME = 'tachistoscope-pro-v1';
const CORE_ASSETS = [
    './',
    './index.html',
    './manifest.webmanifest',
    './css/theme.css',
    './css/lab.css',
    './css/premium-layout.css',
    './js/data.js',
    './js/scene.js',
    './js/tachistoscope.js',
    './js/export.js',
    './js/calculator.js',
    './js/experiment.js',
    './js/ui.js',
    './js/premium-ui.js',
    './js/main-premium.js',
    './lib/three.min.js',
    './lib/chart.min.js',
    './assets/icon-192.svg',
    './assets/icon-512.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys
                .filter((key) => key !== CACHE_NAME)
                .map((key) => caches.delete(key))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request)
                .then((networkResponse) => {
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });

                    return networkResponse;
                })
                .catch(() => caches.match('./index.html'));
        })
    );
});
