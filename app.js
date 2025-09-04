// Main app logic
(function(){
  // Elements
  const expenseForm = document.getElementById("expenseForm");
  const expensesList = document.getElementById("expensesList");
  const searchInput = document.getElementById("search");
  const filterCategory = document.getElementById("filterCategory");
  const filterDay = document.getElementById("filterDay");
  const categoriesListEl = document.getElementById("categoriesList");
  const newCategoryInput = document.getElementById("newCategoryInput");
  const addCategoryBtn = document.getElementById("addCategoryBtn");
  const submitBtn = document.getElementById("submitBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const budgetInput = document.getElementById("budgetInput");
  const setBudgetBtn = document.getElementById("setBudgetBtn");
  const totalTodayEl = document.getElementById("totalToday");
  const totalMonthEl = document.getElementById("totalMonth");
  const spentVal = document.getElementById("spentVal");
  const remainVal = document.getElementById("remainVal");
  const progressBar = document.getElementById("progressBar");
  const adviceBox = document.getElementById("adviceBox");
  const exportBtn = document.getElementById("exportBtn");
  const importBtn = document.getElementById("importBtn");
  const importFile = document.getElementById("importFile");
  const resetBtn = document.getElementById("resetBtn");
  const currencySelect = document.getElementById("currency");
  const langBtn = document.getElementById("langBtn");

  // State
  let state = loadAll();
  if(!state.expenses) state.expenses = [];
  if(!state.categories) state.categories = APP_CONFIG.CATEGORIES_DEFAULT.slice();
  if(!state.budget) state.budget = 0;
  if(!state.currency) state.currency = APP_CONFIG.DEFAULT_CURRENCY || "EGP";
  if(!state.lang) state.lang = localStorage.getItem("masarefy.lang") || APP_CONFIG.DEFAULT_LOCALE || "ar";
  saveAll(state);

  // Editing
  let editingId = null;

  // Init UI values
  budgetInput.value = state.budget || "";
  currencySelect.value = state.currency || APP_CONFIG.DEFAULT_CURRENCY;
  document.documentElement.lang = state.lang === 'ar' ? 'ar' : 'en';
  applyI18n();

  // init categories & UI
  initCategories();
  renderAll();

  // events
  expenseForm.addEventListener("submit", onSubmit);
  searchInput.addEventListener("input", () => renderExpenses());
  filterCategory.addEventListener("change", renderExpenses);
  filterDay.addEventListener("change", renderExpenses);
  addCategoryBtn.addEventListener("click", ()=> {
    const v = newCategoryInput.value.trim();
    if(!v) return alert("أدخل اسم الفئة");
    addCategory(v);
    newCategoryInput.value = "";
    renderCategoriesUI();
    renderExpenses();
  });
  categoriesListEl.addEventListener("click", (ev)=> {
    // delegated - handled in categories.js UI functions
  });
  cancelEditBtn.addEventListener("click", ()=> { editingId = null; submitBtn.textContent = state.lang==='ar'?'أضف':'Add'; cancelEditBtn.style.display='none'; expenseForm.reset(); });
  setBudgetBtn.addEventListener("click", ()=>{ state.budget = +budgetInput.value || 0; state.currency = currencySelect.value; saveAll(state); renderAll(); });
  exportBtn.addEventListener("click", ()=> {
    const blob = new Blob([JSON.stringify(state, null, 2)], {type:"application/json"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "masarefy-backup.json"; a.click();
  });
  importBtn.addEventListener("click", ()=> importFile.click());
  importFile.addEventListener("change", (e)=> {
    const f = e.target.files[0];
    if(!f) return;
    const r = new FileReader();
    r.onload = ()=> {
      try{
        const data = JSON.parse(r.result);
        if(confirm("هل تريد استبدال البيانات الحالية؟")) {
          state = data;
          saveAll(state);
          initCategories();
          renderAll();
        }
      }catch(err){ alert("ملف غير صالح"); }
    };
    r.readAsText(f);
  });
  resetBtn.addEventListener("click", ()=> { if(confirm("مسح كل البيانات؟")){ localStorage.removeItem('masarefy.v1'); location.reload(); } });
  langBtn.addEventListener("click", ()=>{
    state.lang = state.lang==='ar'?'en':'ar';
    localStorage.setItem("masarefy.lang", state.lang);
    applyI18n();
    renderAll();
  });

  // request notification permission
  if("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission().catch(()=>{});
  }

  // form handler
  function onSubmit(ev){
    ev.preventDefault();
    const name = document.getElementById("eName").value.trim();
    const amount = +document.getElementById("eAmount").value || 0;
    const category = document.getElementById("eCategory").value;
    const date = document.getElementById("eDate").value || todayISO();
    if(!name || !amount) { alert(state.lang==='ar'?"أدخل اسمًا ومبلغًا صحيحًا":"Enter valid name and amount"); return; }

    if(editingId){
      // update
      const idx = state.expenses.findIndex(x=>x.id===editingId);
      if(idx>-1) state.expenses[idx] = { id: editingId, name, amount, category, date };
      editingId = null;
      submitBtn.textContent = state.lang==='ar' ? 'أضف' : 'Add';
      cancelEditBtn.style.display='none';
    } else {
      state.expenses.push({ id: Date.now(), name, amount, category, date });
    }
    saveAll(state);
    expenseForm.reset();
    renderAll();
  }

  // render helpers
  function renderAll(){
    renderCategoriesUI(); // categories.js
    renderExpenses();
    renderSummary();
    renderAdvice();
    renderCharts();
  }

  function renderExpenses(){
    expensesList.innerHTML = "";
    const q = (searchInput.value||"").toLowerCase();
    const fc = filterCategory.value || "";
    const fd = filterDay.value || "";
    const items = state.expenses.filter(e => ( (!fc || e.category===fc) && (!fd || e.date===fd) && (e.name.toLowerCase().includes(q) || String(e.amount).includes(q)) ));
    // sort by date desc
    items.sort((a,b)=> b.date.localeCompare(a.date));
    items.forEach(exp => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="left">
          <div class="exp-name">${exp.name}</div>
          <div class="exp-meta">${exp.category} • ${exp.date}</div>
        </div>
        <div class="right">
          <div class="exp-amount">${fmtCurrency(exp.amount, state.currency)}</div>
          <div class="exp-actions">
            <button class="btn small" data-action="edit" data-id="${exp.id}">✏️</button>
            <button class="btn small" data-action="delete" data-id="${exp.id}">🗑️</button>
          </div>
        </div>
      `;
      expensesList.appendChild(li);
    });

    // attach handlers (delegation)
    expensesList.querySelectorAll('button[data-action]').forEach(btn=>{
      btn.onclick = ()=> {
        const id = +btn.dataset.id;
        if(btn.dataset.action === 'edit') startEdit(id);
        if(btn.dataset.action === 'delete') doDelete(id);
      };
    });

    // update day filter options
    buildDayFilter();
  }

  function startEdit(id){
    const e = state.expenses.find(x=>x.id===id);
    if(!e) return;
    document.getElementById("eName").value = e.name;
    document.getElementById("eAmount").value = e.amount;
    document.getElementById("eCategory").value = e.category;
    document.getElementById("eDate").value = e.date;
    editingId = id;
    submitBtn.textContent = state.lang==='ar' ? 'تحديث' : 'Update';
    cancelEditBtn.style.display = 'inline-block';
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function doDelete(id){
    if(!confirm(state.lang==='ar'?"حذف المصروف؟":"Delete expense?")) return;
    state.expenses = state.expenses.filter(x=>x.id!==id);
    saveAll(state);
    renderAll();
  }

  function renderSummary(){
    const today = todayISO();
    const month = monthKey();
    const sumToday = state.expenses.filter(e=>e.date===today).reduce((s,e)=>s+ (+e.amount||0),0);
    const sumMonth = state.expenses.filter(e=>e.date?.startsWith(month)).reduce((s,e)=>s+ (+e.amount||0),0);
    totalTodayEl.textContent = `${state.lang==='ar'?'اليوم':'Today'}: ${fmtCurrency(sumToday, state.currency)}`;
    totalMonthEl.textContent = `${state.lang==='ar'?'الشهر':'Month'}: ${fmtCurrency(sumMonth, state.currency)}`;
    spentVal.textContent = `${state.lang==='ar'?'المصروف':'Spent'}: ${fmtCurrency(sumMonth,state.currency)}`;
    const remain = Math.max(0, (state.budget||0) - sumMonth);
    remainVal.textContent = `${state.lang==='ar'?'المتبقي':'Remaining'}: ${fmtCurrency(remain,state.currency)}`;
    // progress
    const p = state.budget>0 ? Math.min(100, Math.round((sumMonth/(state.budget||1))*100)) : 0;
    progressBar.style.width = p + "%";
  }

  function renderAdvice(){
    const month = monthKey();
    const sumMonth = state.expenses.filter(e=>e.date?.startsWith(month)).reduce((s,e)=>s+ (+e.amount||0),0);
    const budget = state.budget || 0;
    const remaining = budget - sumMonth;
    let txt = '';
    if(!budget){
      txt = state.lang==='ar'?"⚠️ اضبط ميزانيتك أولاً!":"⚠️ Set your budget first!";
    } else if(remaining<=0){
      txt = state.lang==='ar'?"❌ تجاوزت ميزانيتك! قلل الإنفاق فوراً.":"❌ You've exceeded your budget! Cut spending.";
      notifyUser(state.lang==='ar'?"تنبيه مصاريفي":"Masarefy Alert", state.lang==='ar'?"لقد تجاوزت ميزانيتك الشهرية!":"You exceeded your monthly budget!");
    } else if(remaining <= budget*0.1){
      txt = state.lang==='ar'?"⚠️ الباقي أقل من 10% من الميزانية!":"⚠️ Remaining less than 10% of budget!";
    } else if(remaining <= budget*0.3){
      txt = state.lang==='ar'?"ℹ️ اقتربت من استهلاك معظم الميزانية.":"ℹ️ You're nearing most of your budget.";
    } else {
      txt = state.lang==='ar'?"💡 ممتاز! استمر في التوفير 👌":"💡 Great! Keep saving 👌";
    }
    adviceBox.textContent = txt;
  }

  // helper: build unique day filter
  function buildDayFilter(){
    const days = Array.from(new Set(state.expenses.map(e=>e.date))).sort().reverse();
    filterDay.innerHTML = '<option value="">كل الأيام</option>';
    days.forEach(d=>{
      const o = document.createElement("option"); o.value = d; o.textContent = d + (d===todayISO()? " (اليوم)":"");
      filterDay.appendChild(o);
    });
  }

  // notifications (local)
  function notifyUser(title, body){
    if(!("Notification" in window)) return;
    if(Notification.permission === "granted") {
      new Notification(title, { body });
    } else {
      Notification.requestPermission().then(()=>{ if(Notification.permission==="granted") new Notification(title,{body}); });
    }
  }

  // Render categories UI (delegates to categories.js)
  // categories.js exposes categories array + functions; ensure it's loaded
  // initCategories() already called earlier via categories.js when page loaded

  // Expose renderCharts to global (charts.js will call)
  window.renderCharts = renderCharts;

  // Save on unload
  window.addEventListener("beforeunload", ()=> saveAll(state));

})(); // end app
