// ======= analytics.js =======
(function(){
  const cfg = window.APP_CONFIG || {};
  const GAID = cfg.GA4_MEASUREMENT_ID || "";
  const CONSENT_KEY = "me_consent";
  function loadGA(){
    if(!GAID) return;
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GAID}`;
    s.onerror = ()=>{};
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', GAID, { anonymize_ip: true });
  }
  function showConsent(){
    if(localStorage.getItem(CONSENT_KEY)==='yes') { loadGA(); return; }
    const bar = document.createElement('div');
    bar.className = 'consent-bar';
    bar.innerHTML = `<div>نستخدم Google Analytics (بشكل مجهول) وبعض مزودي الإعلانات وقد يستخدمون ملفات تعريف الارتباط. <a href="privacy.html" target="_blank">تفاصيل</a></div>
    <button class="btn-primary" id="consent-accept">موافق</button>`;
    document.body.appendChild(bar);
    document.getElementById('consent-accept').onclick = ()=>{
      localStorage.setItem(CONSENT_KEY,'yes');
      bar.remove();
      loadGA();
    };
  }
  window.track = function(eventName, params={}){
    if(typeof window.gtag === 'function' && GAID){
      try{ gtag('event', eventName, params); }catch(e){}
    }
  };
  window.addEventListener('DOMContentLoaded', showConsent);
})();
