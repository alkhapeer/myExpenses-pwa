
importScripts("./config-sw.js");
const CACHE = `myexp-${self.CONFIG_SW.CACHE_VERSION}`;
const CORE = [
  "./","./index.html","./styles.css","./app.js","./storage.js","./utils.js","./i18n.js","./config.js",
  "./charts.js","./analytics.js","./ads.js","./install.js","./icon-192.png","./icon-512.png"
];
self.addEventListener("install", e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));
});
self.addEventListener("activate", e=>{
  e.waitUntil((async()=>{
    const keys = await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith("myexp-") && k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", e=>{
  const url = new URL(e.request.url);
  if (["www.googletagmanager.com","www.google-analytics.com","pagead2.googlesyndication.com"].includes(url.hostname)) return;
  e.respondWith((async()=>{
    const cache = await caches.open(CACHE);
    const cached = await cache.match(e.request);
    try{
      const net = await fetch(e.request);
      cache.put(e.request, net.clone());
      return net;
    }catch{
      return cached || Response.error();
    }
  })());
});
