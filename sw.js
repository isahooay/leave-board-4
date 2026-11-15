/* 送餐小組排假表 service worker｜作者：帥｜GROK 輔助｜修改日期 2026-11-15 08:05 */
'use strict';
const CACHE = 'leave-board-4-0703-fix1';
const APP = './GROK-送餐-四人排假表-2026-11-03-0703.html';
const FILES = ['./manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
const PAGES = ['./', APP];   // 網站根目錄（index.html）跟原檔名都可能是入口；任一個不存在不影響安裝

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE)
    .then((c) => c.addAll(FILES).then(() => Promise.all(PAGES.map((u) => c.add(u).catch(() => null)))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('leave-board-4-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(req).catch(() => (req.mode === 'navigate'
        ? caches.match('./').then((r) => r || caches.match(APP))
        : Response.error()));
    })
  );
});
