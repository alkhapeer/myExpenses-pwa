// ======= service-worker.js =======
const CACHE_VERSION = "v1.0.0";
const CACHE_NAME = `masarefy-cache-${CACHE_VERSION}`;

const ASSETS = [
  "./",
  "index.html",
  "ads.html",
  "admin.html",
  "ads-config.json",
  "privacy.html",
  "styles.css",
  "config.js",
  "i18n.js",
  "analytics.js",
  "ads.js",
  "utils.js",
  "storage.js",
  "charts.js",
  "app.js",
  "install.js",
  "manifest.webmanifest",
  "vendor/chart.min.js",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
];

const NETWORK_ONLY_HOSTS = [
  "googletagmanager.com",
  "google-analytics.com",
  "googlesyndication.com",
  "doubleclick.net",
  "adsterra",
  "propellerads",
  "profitablecpmgate",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k!==CACHE_NAME && caches.delete(k))))
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (NETWORK_ONLY_HOSTS.some(h => url.hostname.includes(h))) {
    return; // network-only
  }
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request).then(r => r).catch(() => {
      if(event.request.mode === "navigate") return caches.match("index.html");
      return new Response("", {status: 200});
    }))
  );
});
