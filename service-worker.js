const CACHE_NAME = 'qrgen-v5'; // เปลี่ยนเวอร์ชันเป็น v5
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
  // เอา Link CDN ออกเพื่อป้องกัน CORS Error ให้เว็บโหลดจากเน็ตโดยตรง
];

// Install Event
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event (ลบ Cache เก่าทิ้ง)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      // ถ้ามีใน Cache ก็ใช้ Cache (พวกรูป icon, index.html)
      if (response) {
        return response;
      }
      // ถ้าไม่มี (เช่นพวก CDN) ให้โหลดจากเน็ตตามปกติ
      return fetch(e.request);
    })
  );
});
