// ======= install.js =======
(function(){
  let deferredPrompt = null;
  const btn = document.getElementById('installBtn');
  const ua = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;

  window.addEventListener('beforeinstallprompt', (e)=>{
    e.preventDefault();
    deferredPrompt = e;
    if(btn) btn.style.display = 'inline-block';
  });

  if(isStandalone && btn){ btn.style.display='none'; }

  if(isIOS && btn){
    btn.style.display='inline-block';
    btn.addEventListener('click', ()=>{
      const modal = document.getElementById('iosModal');
      if(modal){
        modal.style.display='block';
        modal.querySelector('.close').onclick = ()=> modal.style.display='none';
      }
    });
    return;
  }

  if(btn){
    btn.addEventListener('click', async ()=>{
      if(deferredPrompt){
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
      } else {
        btn.textContent = 'Install from browser menu';
        setTimeout(()=>btn.textContent = document.querySelector('[data-i18n="install_app"]').textContent, 1500);
      }
    });
  }
})();
