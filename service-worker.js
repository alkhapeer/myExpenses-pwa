
importScripts("./config-sw.js");
const CACHE = `myexp-${self.CONFIG_SW.CACHE_VERSION}`;
const CORE = [
  "./","./index.html","./styles.css","./app.js","./storage.js","./utils.js","./i18n.js","./config.js",
  "./charts.js","./analytics.js","./ads.js","./icon-192.png","./icon-512.png"
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
const NO_CACHE_HOSTS = ["www.googletagmanager.com","www.google-analytics.com","pagead2.googlesyndication.com"];
self.addEventListener("fetch", e=>{
  const url = new URL(e.request.url);
  if (NO_CACHE_HOSTS.includes(url.hostname)) return;
  if (e.request.mode === "navigate"){
    e.respondWith((async()=>{
      try{
        const net = await fetch(e.request);
        const cache = await caches.open(CACHE); cache.put(e.request, net.clone());
        return net;
      }catch{
        const cache = await caches.open(CACHE);
        const cached = await cache.match("./index.html");
        return cached || Response.error();
      }
    })());
    return;
  }
  e.respondWith((async()=>{
    const cache = await caches.open(CACHE);
    const cached = await cache.match(e.request);
    const fetching = fetch(e.request).then(r=>{ cache.put(e.request, r.clone()); return r; }).catch(()=>cached);
    return cached || fetching;
  })());
});
