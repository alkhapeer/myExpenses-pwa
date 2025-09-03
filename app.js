document.addEventListener('DOMContentLoaded', () => {
  // اللغة
  const userLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
  const settings = getSettings();
  const lang = settings.lang || userLang || window.APP_CONFIG.DEFAULT_LANGUAGE;
  applyLanguage(lang);

  document.getElementById('langBtn').addEventListener('click', () => {
    const newLang = (document.documentElement.lang === 'ar') ? 'en' : 'ar';
    setSettings(Object.assign(getSettings(), {lang: newLang}));
    applyLanguage(newLang);
  });

  // سنة في الفوتر
  document.getElementById('year').textContent = new Date().getFullYear();

  // إظهار إعلان أول مرة
  if(!localStorage.getItem('adShown')){
    window.location.href = '/ads.html';
    return;
  }

  // init ads & analytics
  initAds();
  // track open
  if(window.trackEvent) window.trackEvent('app_open', {app:'masarefy'});

  // form submit
  const form = document.getElementById('expenseForm');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const name = document.getElementById('eName').value.trim();
    const amt = Number(document.getElementById('eAmount').value || 0);
    const cat = document.getElementById('eCategory').value;
    const date = document.getElementById('eDate').value || (new Date()).toISOString().slice(0,10);
    if(!name || !amt) { toast('أدخل اسمًا ومبلغًا صحيحًا'); return; }
    const obj = { name, amount: amt, category: cat, date };
    addExpense(obj);
    renderUI();
    if(window.trackEvent) window.trackEvent('expense_add',{category:cat, amount:amt});
    toast('تم الإضافة');
    form.reset();
  });

  // export
  document.getElementById('exportBtn').addEventListener('click', ()=>{
    const rows = [['id','name','amount','category','date']];
    getExpenses().forEach(e => rows.push([e.id,e.name,e.amount,e.category,e.date]));
    downloadCSV('masarefy_export.csv', rows);
    if(window.trackEvent) window.trackEvent('export_csv');
  });

  document.getElementById('resetBtn').addEventListener('click', ()=>{
    if(confirm('هل أنت متأكد من حذف كل البيانات؟')){
      clearAll();
      renderUI();
      if(window.trackEvent) window.trackEvent('data_cleared');
    }
  });

  document.getElementById('setBudgetBtn').addEventListener('click', ()=>{
    const b = Number(document.getElementById('budgetInput').value||0);
    const s = getSettings();
    s.budget = b;
    setSettings(s);
    toast('تم حفظ الميزانية');
  });

  // search & render
  document.getElementById('search').addEventListener('input', renderUI);
  renderUI();

  // register service worker
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/service-worker.js').then(()=>console.log('SW registered'));
  }

  showIOSInstallHint();
});

function renderUI(){
  const list = getExpenses();
  const ul = document.getElementById('expensesList');
  const query = document.getElementById('search').value.toLowerCase();
  ul.innerHTML = '';
  const filtered = list.filter(e => (e.name + e.category + e.date).toLowerCase().includes(query));
  filtered.sort((a,b)=> b.date.localeCompare(a.date));
  filtered.forEach(e=>{
    const li = document.createElement('li');
    li.innerHTML = `<div><strong>${e.name}</strong><div class="muted">${e.category} • ${e.date}</div></div><div><span>${formatCurrency(Number(e.amount))}</span>
      <button data-id="${e.id}" class="del">حذف</button></div>`;
    ul.appendChild(li);
  });
  // delete handlers
  ul.querySelectorAll('.del').forEach(btn=>{
    btn.addEventListener('click', ()=> {
      deleteExpense(btn.dataset.id); renderUI();
      toast('حُذف');
    });
  });

  // summary
  const today = new Date().toISOString().slice(0,10);
  const totalToday = getExpenses().filter(e=> e.date===today ).reduce((s,x)=>s+Number(x.amount),0);
  document.getElementById('totalToday').textContent = `اليوم: ${formatCurrency(totalToday)}`;
  const monthStart = new Date(); monthStart.setDate(1);
  const monthKey = monthStart.toISOString().slice(0,7);
  const totalMonth = getExpenses().filter(e => e.date.slice(0,7)===monthKey).reduce((s,x)=>s+Number(x.amount),0);
  document.getElementById('totalMonth').textContent = `الشهر: ${formatCurrency(totalMonth)}`;
  // budget check
  const s = getSettings();
  if(s.budget && totalMonth > s.budget){
    document.getElementById('totalMonth').style.color = 'crimson';
    toast('تجاوزت الميزانية الشهرية!');
  } else {
    document.getElementById('totalMonth').style.color = '';
  }

  // charts
  renderCharts();
}
