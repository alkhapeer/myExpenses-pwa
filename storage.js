const STORAGE_KEY = "masarefy.v1";

function saveAll(state){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function loadAll(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
  catch(e){ return {}; }
}
