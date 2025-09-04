const CACHE_NAME = "masarefy-shell-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./config.js",
  "./i18n.js",
  "./utils.js",
  "./storage.js",
  "./categories.js",
  "./ads.js",
  "./charts.js",
  "./install.js",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/icons/icon-192.png"
];

self.addEventListener("install", (e)=> {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e)=> {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => {
      if(k !== CACHE_NAME) return caches.delete(k);
    })))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e)=>{
  const url = new URL(e.request.url);
  if(url.origin === location.origin){
    e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
  }
});
