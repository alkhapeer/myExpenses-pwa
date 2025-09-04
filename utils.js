function fmtCurrency(value, currencyCode) {
  if (currencyCode === "EGP" || currencyCode === "ج.م") {
    // Egyptian pounds show currency symbol ج.م
    try {
      return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits:2 }).format(value);
    } catch(e){}
  }
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode, maximumFractionDigits:2 }).format(value);
  } catch(e){
    return value + " " + (currencyCode || '');
  }
}
function todayISO(){ const d=new Date(); return d.toISOString().slice(0,10); }
function monthKey(d=new Date()){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; }
