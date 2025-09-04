
export function uid() {
  return crypto.randomUUID ? crypto.randomUUID() :
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}
export function formatCurrency(v, symbol) {
  const n = Number(v || 0);
  return `${n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} ${symbol}`;
}
export function todayISO(){ return new Date().toISOString().slice(0,10); }
export function parseISO(d){ try{return new Date(d);}catch{return new Date();} }
