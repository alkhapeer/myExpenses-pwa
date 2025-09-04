// ======= config.js =======
// قابل للتعديل بعد النشر (ضع قيمك هنا)
window.APP_CONFIG = {
  APP_NAME: "مصاريفي | My Expenses",
  DEFAULT_LANGUAGE: "auto",     // "auto" | "ar" | "en"
  CURRENCY_SYMBOL: "ج.م",       // استخدم "$" أو "SAR" أو أي رمز آخر

  // ---- Analytics ----
  GA4_MEASUREMENT_ID: "",       // مثال: G-XXXXXXXXXX (اتركه فارغًا لتعطيل GA)

  // ---- Ads Provider ----
  ADS_PROVIDER: "adsense",      // "adsense" | "propeller" | "adsterra" | "none"

  // AdSense
  ADSENSE_CLIENT_ID: "",        // ca-pub-xxxxxxxxxxxxxxxx
  ADSENSE_SLOT_BANNER_TOP: "",  // رقم slot
  ADSENSE_SLOT_BANNER_BOTTOM: "",

  // PropellerAds
  PROPELLER_SCRIPT_SRC: "",     // مثال: https://propu.sh/pfe/current/tag.min.js?z=ZONE_ID
  PROPELLER_DATA_ZONE: "",      // ZONE_ID إن لزم

  // Adsterra
  ADSTERRA_SCRIPT_SRC: "",      // مثال: https://www.profitablecpmgate.com/xx/xx/loader.js
  ADSTERRA_ZONE: "",            // إن لزم

  // ---- UI options ----
  SHOW_BANNERS_BY_DEFAULT: true,
  SPLASH_SECONDS: 20,           // مدة شاشة الترحيب (20–30)
  CACHE_VERSION: "v1.0.0",      // غيّرها عند تحديث الـ SW
};
