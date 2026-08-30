// Service Worker desactivado temporalmente
// Se puede reactivar cuando tengamos una estrategia de cacheo mas robusta
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // No interceptar nada, dejar que Next.js maneje el cacheo
});
