
// install.js — robust A2HS
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById("btnInstall");
  if (btn) btn.disabled = false;
});

window.addEventListener('appinstalled', () => {
  const btn = document.getElementById("btnInstall");
  if (btn) { btn.disabled = true; btn.textContent = btn.getAttribute("data-installed-text") || "Installed"; }
});

export function wireInstallButton() {
  const btn = document.getElementById("btnInstall");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    if (outcome === "accepted") {
      btn.disabled = true;
    }
  });
}
