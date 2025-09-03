const STORAGE_KEY = 'masarefy_expenses_v1';
const SETTINGS_KEY = 'masarefy_settings_v1';

function getExpenses(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch(e){
    return [];
  }
}
function saveExpenses(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function addExpense(obj){
  const list = getExpenses();
  obj.id = Date.now().toString();
  list.push(obj);
  saveExpenses(list);
  return obj;
}
function updateExpense(id, data){
  const list = getExpenses();
  const idx = list.findIndex(x=>x.id===id);
  if(idx>-1){ list[idx]=Object.assign(list[idx],data); saveExpenses(list); return true; }
  return false;
}
function deleteExpense(id){
  const list = getExpenses().filter(x=>x.id!==id);
  saveExpenses(list);
}
function clearAll(){
  localStorage.removeItem(STORAGE_KEY);
}
function getSettings(){ return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'); }
function setSettings(obj){ localStorage.setItem(SETTINGS_KEY, JSON.stringify(obj)); }
