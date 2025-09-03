function formatCurrency(val){
  return `${val.toLocaleString()} ${window.APP_CONFIG.CURRENCY_SYMBOL || ''}`;
}

function toast(msg, timeout=2000){
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  Object.assign(t.style, {
    position:'fixed',right:10,bottom:10,background:'#333',color:'#fff',padding:'8px 12px',borderRadius:'6px',zIndex:9999
  });
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), timeout);
}

function downloadCSV(filename, rows){
  const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
