
// service-worker.js
importScripts("./config-sw.js");

const CACHE_NAME = `myexp-${self.CONFIG_SW.CACHE_VERSION}`;
const CORE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./storage.js",
  "./utils.js",
  "./i18n.js",
  "./config.js",
  "./charts.js",
  "./analytics.js",
  "./ads.js",
  "./categories.js",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(CORE)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith("myexp-") && k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

const ANALYTICS_HOSTS = ["www.googletagmanager.com", "www.google-analytics.com", "pagead2.googlesyndication.com"];

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (ANALYTICS_HOSTS.includes(url.hostname)) return; // don't cache

  if (e.request.mode === "navigate") {
    e.respondWith((async () => {
      try {
        const net = await fetch(e.request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(e.request, net.clone());
        return net;
      } catch {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match("./index.html");
        return cached || Response.error();
      }
    })());
    return;
  }

  // Stale-While-Revalidate for static
  e.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(e.request);
    const fetchPromise = fetch(e.request).then(net => {
      cache.put(e.request, net.clone());
      return net;
    }).catch(() => cached);
    return cached || fetchPromise;
  })());
});
