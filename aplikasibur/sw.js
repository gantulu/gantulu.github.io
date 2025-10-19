const cacheName='data-list-card-v2';
const assetsToCache=['/','/index.html','/manifest.json','/icon-192.png','/icon-512.png','/notif.mp3','https://cdn.tailwindcss.com','https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'];

self.addEventListener('install', e => { e.waitUntil(caches.open(cacheName).then(c=>c.addAll(assetsToCache))); });
self.addEventListener('fetch', e => { e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))); });
