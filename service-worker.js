self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('qrgen-v1').then(cache => cache.addAll([
      '/qrgenerator.html',
      '/manifest.json',
      '/icons/icon-192x192.png',
      '/icons/icon-512x512.png'
    ]))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});

