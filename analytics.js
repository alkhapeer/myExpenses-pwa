(function initGA(){
  const id = window.APP_CONFIG.GA4_MEASUREMENT_ID;
  if(!id) return;
  // تحميل gtag
  const s = document.createElement('script');
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  s.async = true;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id, { anonymize_ip: true });

  // دالة مساعدة لازالة بيانات حساسة
  window.trackEvent = function(name, params={}){
    try {
      gtag('event', name, params);
    } catch(e){}
  };
})();
