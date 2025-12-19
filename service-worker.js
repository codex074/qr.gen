const CACHE_NAME = 'qrgen-v2'; // อัปเดตเวอร์ชัน
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  // ต้อง Cache ไลบรารีภายนอกด้วยเพื่อให้ทำงาน Offline ได้
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs/qrcode.min.js',
  'https://unpkg.com/html5-qrcode',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11',
  'https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700&display=swap'
];

// Install Event: เก็บไฟล์ลง Cache
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event: ลบ Cache เวอร์ชันเก่าทิ้ง
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
});

// Fetch Event: ดึงข้อมูลจาก Cache ก่อน ถ้าไม่มีค่อยโหลดจากเน็ต
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(e.request).catch(() => {
        // กรณี Offline และหาไฟล์ไม่เจอ อาจจะ return หน้า offline.html (ถ้ามี)
      });
    })
  );
});
