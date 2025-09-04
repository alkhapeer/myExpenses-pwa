
// ads.js
import { CONFIG } from "./config.js";

function injectAdSense() {
  if (!CONFIG.ADSENSE_CLIENT_ID) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CONFIG.ADSENSE_CLIENT_ID}`;
  s.crossOrigin = "anonymous";
  document.head.appendChild(s);
}

export function initAds() {
  if (CONFIG.ADS_PROVIDER === "adsense") {
    injectAdSense();
    // Banners in index.html use <ins class="adsbygoogle"> ... (slots)
    // If slots provided, they will render automatically.
  }
  // For propeller/adsterra you can add similar injectors here when needed.
}
