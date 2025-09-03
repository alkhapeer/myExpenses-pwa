function initAds(){
  const provider = window.APP_CONFIG.ADS_PROVIDER || 'none';
  if(provider === 'none') return;
  if(provider === 'adsense'){
    // Load AdSense script
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    s.setAttribute('data-ad-client', window.APP_CONFIG.ADSENSE_CLIENT_ID || '');
    document.head.appendChild(s);

    // Insert ad slots (simple example)
    const top = document.getElementById('ad-banner-top');
    const bottom = document.getElementById('ad-banner-bottom');
    top.innerHTML = `<ins class="adsbygoogle"
         style="display:block"
         data-ad-client="${window.APP_CONFIG.ADSENSE_CLIENT_ID}"
         data-ad-slot="${window.APP_CONFIG.ADSENSE_SLOT_BANNER_TOP}"
         data-ad-format="auto"></ins>`;
    bottom.innerHTML = `<ins class="adsbygoogle"
         style="display:block"
         data-ad-client="${window.APP_CONFIG.ADSENSE_CLIENT_ID}"
         data-ad-slot="${window.APP_CONFIG.ADSENSE_SLOT_BANNER_BOTTOM}"
         data-ad-format="auto"></ins>`;
    (adsbygoogle = window.adsbygoogle || []).push({});
  }

  if(provider === 'propeller'){
    // propeller sample loader (ضع كود المزود)
    // تأكد من إضافة zone id في config.js
  }

  if(provider === 'adsterra'){
    // adsterra sample loader (ضع كود المزود)
  }
}
