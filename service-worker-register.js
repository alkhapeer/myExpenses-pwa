
// Kill-switch: add ?nosw=1 to URL to unregister SW and reload once
(function(){
  const params = new URLSearchParams(location.search);
  if (params.get("nosw") === "1" && "serviceWorker" in navigator){
    navigator.serviceWorker.getRegistrations().then(list=>{
      Promise.all(list.map(r=>r.unregister())).then(()=>{
        localStorage.setItem("sw_killed_once","1");
        const u = new URL(location.href); u.searchParams.delete("nosw"); location.replace(u.toString());
      });
    });
    return;
  }
})();

if ("serviceWorker" in navigator){
  window.addEventListener("load", ()=>{
    navigator.serviceWorker.register("./service-worker.js").catch(console.error);
  });
}
