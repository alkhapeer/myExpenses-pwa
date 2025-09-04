(function(){
  const ads = (APP_CONFIG.ADS || []).filter(a=>a && a.img);
  if(!ads.length) return;
  const imgEl = document.getElementById("adImage");
  const linkEl = document.getElementById("adLink");
  const dots = document.getElementById("adDots");
  let i = 0;
  function renderDots(){ dots.innerHTML = ""; ads.forEach((_,idx)=>{ const s=document.createElement("span"); if(idx===i) s.classList.add("active"); dots.appendChild(s); });}
  function show(idx){ const a = ads[idx]; imgEl.src = a.img; linkEl.href = a.href || "#"; i = idx; renderDots(); }
  renderDots(); show(0);
  setInterval(()=> show((i+1)%ads.length), APP_CONFIG.ADS_ROTATE_MS || 6000);
})();
