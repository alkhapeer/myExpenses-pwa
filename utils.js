// ======= utils.js =======
export function formatAmount(x, currency=window.APP_CONFIG.CURRENCY_SYMBOL){
  const n = Number(x||0);
  return `${n.toLocaleString(undefined,{minimumFractionDigits:0, maximumFractionDigits:2})} ${currency}`;
}
export function formatDateISO(d){
  const dt = d instanceof Date ? d : new Date(d);
  return dt.toISOString().slice(0,10);
}
export function uuid(){
  return 'xxyyxy'.replace(/[xy]/g, c => {
    const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  })+'-'+Date.now().toString(36);
}
export function toCSV(rows){
  const esc = s => ('"'+ String(s).replace(/"/g,'""') +'"');
  const header = ["id","name","amount","category","date","note"];
  const data = [header.join(",")].concat(rows.map(r => [r.id, r.name, r.amount, r.category, r.date, r.note||""].map(esc).join(",")));
  return data.join("\n");
}
export function download(filename, text){
  const blob = new Blob([text], {type: 'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.style.display='none';
  document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(url); a.remove();}, 0);
}
export function toast(msg){
  const t = document.createElement('div');
  t.className = 'toasty';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=>t.classList.add('show'), 10);
  setTimeout(()=>{t.classList.remove('show'); setTimeout(()=>t.remove(), 300);}, 2000);
}
