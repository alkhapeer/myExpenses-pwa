
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault(); deferredPrompt = e;
  const btn = document.getElementById("btnInstall");
  if (btn){ btn.disabled = false; btn.title = ""; }
});
window.addEventListener('appinstalled', ()=>{
  const btn = document.getElementById("btnInstall");
  if (btn){ btn.disabled = true; btn.textContent = btn.getAttribute("data-installed-text") || "Installed"; }
});

export function wireInstallButton(){
  const btn = document.getElementById("btnInstall");
  if (!btn) return;
  btn.disabled = true;
  btn.title = document.documentElement.lang === "ar" ?
    "التثبيت متاح عندما يسمح المتصفح (HTTPS + دعم)" :
    "Install appears when the browser allows (HTTPS + support)";

  btn.addEventListener("click", async ()=>{
    if (!deferredPrompt){
      alert(btn.title);
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    btn.disabled = true;
  });
}
