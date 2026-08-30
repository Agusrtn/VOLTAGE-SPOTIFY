// Service Worker para VOLTAGE MUSIC

const CACHE_NAME = 'voltage-music-v3';
const urlsToCache = [
  '/',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache).catch(() => {
          console.log('Algunos archivos no se pudieron cachear');
        });
      })
  );
  self.skipWaiting();
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          return new Response('Offline');
        });
      }
    )
  );
});
