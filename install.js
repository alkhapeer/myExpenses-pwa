let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById('installBtn');
  btn.style.display = 'inline-block';
  btn.addEventListener('click', async () => {
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      toast('تم التثبيت!');
    }
    deferredPrompt = null;
    btn.style.display = 'none';
  });
});

// تعليمات iOS بسيطة
function showIOSInstallHint(){
  if(/iphone|ipad|ipod/i.test(navigator.userAgent) && !window.matchMedia('(display-mode: standalone)').matches){
    // إظهار نافذة تعليمية (بسيطة)
    if(!localStorage.getItem('ios_installed_hint')){
      alert('لتثبيت التطبيق على iPhone: اضغط زر المشاركة ثم "Add to Home Screen".');
      localStorage.setItem('ios_installed_hint', '1');
    }
  }
}
