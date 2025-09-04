
import { CONFIG } from "./config.js";
export function initAds(){
  if (CONFIG.ADS_PROVIDER !== "adsense") return;
  if (!CONFIG.ADSENSE_CLIENT_ID) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CONFIG.ADSENSE_CLIENT_ID}`;
  s.crossOrigin = "anonymous";
  document.head.appendChild(s);
}
