
// analytics.js
import { CONFIG } from "./config.js";

export function initGA() {
  if (!CONFIG.GA4_MEASUREMENT_ID) return;
  const gtagURL = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.GA4_MEASUREMENT_ID}`;
  const s = document.createElement("script");
  s.src = gtagURL; s.async = true;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', CONFIG.GA4_MEASUREMENT_ID);
}

export function gaEvent(name, params={}) {
  if (typeof window.gtag === "function") {
    window.gtag('event', name, params);
  }
}
