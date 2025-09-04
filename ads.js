// ======= ads.js =======
// يجلب إعداد الإعلانات من ads-config.json (عام) + LocalStorage (خاص بالمشرف) ثم يحمّل المزوّد المناسب.
(function(){
  const LS_KEY = 'me_ads_config';

  async function loadAdminConfig(){
    // Local override first
    try{
      const local = localStorage.getItem(LS_KEY);
      if(local){ return JSON.parse(local); }
    }catch(e){}
    // Remote file
    try{
      const r = await fetch('ads-config.json', {cache:'no-cache'});
      if(r.ok){ return await r.json(); }
    }catch(e){}
    return null;
  }

  function safeLoadScript(src, attrs={}){
    if(!src) return;
    const s = document.createElement('script');
    s.async = true;
    s.src = src;
    Object.entries(attrs).forEach(([k,v])=> s.setAttribute(k, v));
    s.onerror = ()=>{};
    document.head.appendChild(s);
  }

  function renderAll(cfg){
    const top = document.getElementById('ad-top');
    const bottom = document.getElementById('ad-bottom');
    const provider = (cfg?.provider || (window.APP_CONFIG?.ADS_PROVIDER||'none')).toLowerCase();

    
    const topEnabled = cfg?.banners?.top?.enabled ?? true;
    const bottomEnabled = cfg?.banners?.bottom?.enabled ?? true;
    if(top) top.style.display = topEnabled ? 'block':'none';
    if(bottom) bottom.style.display = bottomEnabled ? 'block':'none';
    if(!topEnabled && !bottomEnabled) return;

    if(provider==='adsense'){
      const client = cfg?.adsense?.client || window.APP_CONFIG?.ADSENSE_CLIENT_ID || '';
      const slotTop = cfg?.adsense?.slot_top || window.APP_CONFIG?.ADSENSE_SLOT_BANNER_TOP || '';
      const slotBottom = cfg?.adsense?.slot_bottom || window.APP_CONFIG?.ADSENSE_SLOT_BANNER_BOTTOM || '';
      // Loader
      if(client && !document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')){
        safeLoadScript(`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`, {'crossorigin':'anonymous'});
      }
      function renderAdSense(container, slot){
        if(!client || !slot || !container) return;
        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.display = 'block';
        ins.setAttribute('data-ad-client', client);
        ins.setAttribute('data-ad-slot', slot);
        ins.setAttribute('data-ad-format', 'auto');
        ins.setAttribute('data-full-width-responsive', 'true');
        container.innerHTML = ''; container.appendChild(ins);
        const s = document.createElement('script');
        s.text = '(adsbygoogle=window.adsbygoogle||[]).push({});';
        container.appendChild(s);
      }
      if(topEnabled) renderAdSense(top, slotTop);
      if(bottomEnabled) renderAdSense(bottom, slotBottom);
    }
    else if(provider==='propeller'){
      const src = cfg?.propeller?.script_src || window.APP_CONFIG?.PROPELLER_SCRIPT_SRC || '';
      const zone = cfg?.propeller?.data_zone || window.APP_CONFIG?.PROPELLER_DATA_ZONE || '';
      if(src) safeLoadScript(src, {'data-zone': zone});
      if(top) top.innerHTML = '<div class="ad-placeholder">PropellerAds</div>';
      if(bottom) bottom.innerHTML = '<div class="ad-placeholder">PropellerAds</div>';
    }
    else if(provider==='adsterra'){
      const src = cfg?.adsterra?.script_src || window.APP_CONFIG?.ADSTERRA_SCRIPT_SRC || '';
      if(src) safeLoadScript(src);
      if(top) top.innerHTML = '<div class="ad-placeholder">Adsterra</div>';
      if(bottom) bottom.innerHTML = '<div class="ad-placeholder">Adsterra</div>';
    }
  }

  
async function init(){ 
  const cfg = await loadAdminConfig(); 
  renderAll(cfg||null); 
  try{
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const placement = e.target.id==='ad-top' ? 'top' : 'bottom';
          if(typeof window.track==='function'){ track('ad_impression', {placement, provider: (cfg?.provider||'none')}); }
        }
      });
    }, {threshold: 0.5});
    const t = document.getElementById('ad-top'); const b = document.getElementById('ad-bottom');
    if(t) io.observe(t); if(b) io.observe(b);
  }catch(_){}
}

  window.addEventListener('DOMContentLoaded', init);
  window.renderAds = init; // لإعادة التحميل بعد تغيير الإعدادات
})();
