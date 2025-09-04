
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault(); deferredPrompt = e;
  const btn = document.getElementById("btnInstall");
  if (btn) btn.disabled = false;
});
window.addEventListener('appinstalled', ()=>{
  const btn = document.getElementById("btnInstall");
  if (btn){ btn.disabled = true; btn.textContent = btn.getAttribute("data-installed-text") || "Installed"; }
});
export function wireInstallButton(){
  const btn = document.getElementById("btnInstall");
  if (!btn) return;
  btn.addEventListener("click", async ()=>{
    if (!deferredPrompt){
      alert("التثبيت يظهر فقط عندما يعرضه المتصفح (HTTPS وعلى أجهزة مدعومة).");
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  });
}
