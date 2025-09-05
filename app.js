
import { CONFIG } from "./config.js";
import { i18nDict, getInitialLang, applyLang, t } from "./i18n.js";
import { uid, formatCurrency, todayISO, parseISO } from "./utils.js";
import { loadExpenses, saveExpenses, loadPrefs, savePrefs, loadCategories, addCategory } from "./storage.js";
import { renderCharts } from "./charts.js";

let state = {
  expenses: [],
  editingId: null,
  filters: { q: "", from: "", to: "" },
  lang: getInitialLang(),
  prefs: { currency: CONFIG.CURRENCY_SYMBOL, budget: "" },
  savedCats: []
};

function init(){
  try{
    applyLang(state.lang);
    state.prefs = { ...state.prefs, ...loadPrefs() };
    state.savedCats = loadCategories();
    const curIn = document.getElementById("currencyInput");
    const budIn = document.getElementById("budgetInput");
    if (curIn) curIn.value = state.prefs.currency || "";
    if (budIn) budIn.value = state.prefs.budget || "";
    state.expenses = loadExpenses();
    const dateEl = document.getElementById("date");
    if (dateEl) dateEl.value = todayISO();
    renderCategorySuggestions();
    bindEvents();
    renderAll();
  }catch(err){
    console.error("Init error:", err);
  }
}

function bindEvents(){
  // Modal
  const openBtn = document.getElementById("openSettings");
  const closeBtn = document.getElementById("closeSettings");
  const modal = document.getElementById("settingsModal");
  const backdrop = modal ? modal.querySelector(".modal-backdrop") : null;
  const langSelect = document.getElementById("langSelect");
  const saveSettings = document.getElementById("saveSettings");

  const openModal = ()=>{ if (modal){ modal.classList.remove("hidden"); modal.style.display="block"; modal.setAttribute("aria-hidden","false"); } };
  const closeModal = ()=>{ if (modal){ modal.classList.add("hidden"); modal.style.display="none"; modal.setAttribute("aria-hidden","true"); } };
  if (openBtn) openBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (backdrop) backdrop.addEventListener("click", closeModal);
  if (langSelect) langSelect.addEventListener("change", (e)=>{ state.lang = e.target.value; applyLang(state.lang); renderAll(); });
  if (saveSettings) saveSettings.addEventListener("click", ()=>{
    const c = document.getElementById("currencyInput"); const b = document.getElementById("budgetInput");
    state.prefs.currency = (c && c.value) || state.prefs.currency;
    state.prefs.budget = (b && b.value) || "";
    savePrefs(state.prefs);
    closeModal();
    renderAll();
  });

  // Save Category
  const btnSaveCat = document.getElementById("saveCategory");
  const catInput = document.getElementById("category");
  if (btnSaveCat && catInput){
    btnSaveCat.addEventListener("click", ()=>{
      const name = (catInput.value||"").trim();
      if (!name) return;
      addCategory(name);
      state.savedCats = loadCategories();
      renderCategorySuggestions();
    });
  }

  // Numeral normalization (strong)
  const amountEl = document.getElementById("amount");
  if (amountEl){
    const map = {'٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9','۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9'};
    const normalize = (s)=> String(s||"").replace(/[٠-٩۰-۹]/g, ch => map[ch]).replace(',', '.');
    amountEl.addEventListener("beforeinput", (e)=>{
      if (e.data){
        const norm = normalize(e.data);
        if (norm !== e.data){
          e.preventDefault();
          const { selectionStart, selectionEnd, value } = amountEl;
          const v = value.slice(0, selectionStart) + norm + value.slice(selectionEnd);
          amountEl.value = v;
          const pos = (selectionStart||0) + norm.length;
          amountEl.setSelectionRange(pos, pos);
        }
      }
    });
    ["input","change","blur","paste"].forEach(ev=>{
      amountEl.addEventListener(ev, ()=>{
        const caret = amountEl.selectionStart;
        const v = normalize(amountEl.value);
        if (amountEl.value !== v){
          amountEl.value = v;
          if (document.activeElement === amountEl && caret != null){
            const pos = Math.min(v.length, caret);
            amountEl.setSelectionRange(pos, pos);
          }
        }
      });
    });
  }

  // Form submit
  const form = document.getElementById("expenseForm");
  const cancelEditBtn = document.getElementById("cancelEdit");
  if (form){
    form.addEventListener("submit", (e)=>{
      e.preventDefault();
      const payload = {
        id: state.editingId || uid(),
        date: form.date.value,
        category: form.category.value.trim(),
        description: form.description.value.trim(),
        amount: Number((form.amount.value || "0"))
      };
      if (!payload.category){ alert(t("category")); return; }
      if (state.editingId){
        const i = state.expenses.findIndex(x=>x.id===state.editingId);
        if (i>=0) state.expenses[i] = payload;
        state.editingId = null;
        const lbl = document.getElementById("submitBtnLabel"); if (lbl) lbl.textContent = t("add_expense");
        if (cancelEditBtn) cancelEditBtn.classList.add("hidden");
      }else{
        state.expenses.push(payload);
      }
      saveExpenses(state.expenses);
      form.reset(); form.date.value = todayISO();
      const q = document.getElementById("q"); if (q) q.value = ""; state.filters.q = "";
      renderAll();
    });
  }
  if (cancelEditBtn){
    cancelEditBtn.addEventListener("click", ()=>{
      state.editingId = null;
      const lbl = document.getElementById("submitBtnLabel"); if (lbl) lbl.textContent = t("add_expense");
      cancelEditBtn.classList.add("hidden");
      if (form){ form.reset(); form.date.value = todayISO(); }
    });
  }

  // Table actions
  const tbody = document.getElementById("tbody");
  if (tbody){
    tbody.addEventListener("click", (e)=>{
      const editBtn = e.target.closest(".btn-edit");
      const delBtn = e.target.closest(".btn-del");
      const row = e.target.closest("tr[data-id]");
      if (!row) return;
      const id = row.getAttribute("data-id");
      if (editBtn) startEdit(id);
      else if (delBtn){
        state.expenses = state.expenses.filter(x=>x.id!==id);
        saveExpenses(state.expenses);
        renderAll();
      }
    });
  }

  // Filters
  const q = document.getElementById("q");
  const from = document.getElementById("from");
  const to = document.getElementById("to");
  const clearFilters = document.getElementById("clearFilters");
  if (q) q.addEventListener("input", (e)=>{ state.filters.q = e.target.value.trim().toLowerCase(); renderAll(); });
  if (from) from.addEventListener("change", (e)=>{ state.filters.from = e.target.value; renderAll(); });
  if (to) to.addEventListener("change", (e)=>{ state.filters.to = e.target.value; renderAll(); });
  if (clearFilters) clearFilters.addEventListener("click", ()=>{
    state.filters = { q:"", from:"", to:"" };
    if (q) q.value = ""; if (from) from.value=""; if (to) to.value="";
    renderAll();
  });
}

function renderCategorySuggestions(){
  const list = document.getElementById("categoriesList");
  if (!list) return;
  list.innerHTML = "";
  state.savedCats.forEach(cat=>{
    const opt = document.createElement("option");
    opt.value = cat;
    list.appendChild(opt);
  });
}

function startEdit(id){
  const item = state.expenses.find(x=>x.id===id);
  if (!item) return;
  state.editingId = id;
  const form = document.getElementById("expenseForm");
  if (form){
    form.date.value = item.date;
    form.category.value = item.category;
    form.description.value = item.description;
    form.amount.value = item.amount;
  }
  const lbl = document.getElementById("submitBtnLabel"); if (lbl) lbl.textContent = t("update_expense");
  const cancelEditBtn = document.getElementById("cancelEdit"); if (cancelEditBtn) cancelEditBtn.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getFiltered(){
  let arr = [...state.expenses];
  const { q, from, to } = state.filters;
  if (q){
    arr = arr.filter(x=>
      (x.description||"").toLowerCase().includes(q) ||
      (x.category||"").toLowerCase().includes(q)
    );
  }
  if (from){ const d = parseISO(from); arr = arr.filter(x=> parseISO(x.date) >= d); }
  if (to){ const d = parseISO(to); arr = arr.filter(x=> parseISO(x.date) <= d); }
  arr.sort((a,b)=> a.date < b.date ? 1 : -1);
  return arr;
}

function summarize(arr){
  const todayStr = todayISO();
  const today = arr.filter(x=>x.date===todayStr).reduce((s,x)=>s+Number(x.amount||0),0);
  const ym = new Date().toISOString().slice(0,7);
  const month = arr.filter(x=>x.date.startsWith(ym)).reduce((s,x)=>s+Number(x.amount||0),0);
  const byCat = arr.reduce((acc,e)=>{ const k=(e.category||"").trim()||"—"; acc[k]=(acc[k]||0)+Number(e.amount||0); return acc; },{});
  let topCat = t("no_data");
  if (Object.keys(byCat).length) topCat = Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0][0];
  return { today, month, topCat };
}

function renderAll(){
  const appTitle = document.getElementById("appTitle");
  if (appTitle) appTitle.textContent = t("app_title");
  const lbl = document.getElementById("submitBtnLabel");
  if (lbl) lbl.textContent = state.editingId ? t("update_expense") : t("add_expense");
  const thActions = document.getElementById("thActions"); if (thActions) thActions.textContent = t("actions");
  const labelDate = document.getElementById("labelDate"); if (labelDate) labelDate.textContent = t("date");
  const labelCategory = document.getElementById("labelCategory"); if (labelCategory) labelCategory.textContent = t("category");
  const labelDesc = document.getElementById("labelDesc"); if (labelDesc) labelDesc.textContent = t("description");
  const labelAmount = document.getElementById("labelAmount"); if (labelAmount) labelAmount.textContent = t("amount");

  const arr = getFiltered();
  const tbody = document.getElementById("tbody");
  if (tbody){
    tbody.innerHTML = "";
    arr.forEach(e=>{
      const tr = document.createElement("tr");
      tr.setAttribute("data-id", e.id);
      tr.innerHTML = `
        <td>${e.date}</td>
        <td>${e.category||""}</td>
        <td>${e.description||""}</td>
        <td>${formatCurrency(e.amount, state.prefs.currency)}</td>
        <td>
          <button class="btn btn-edit" type="button" data-i18n="edit">` + t("edit") + `</button>
          <button class="btn btn-del" type="button" data-i18n="delete">` + t("delete") + `</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  const { today, month, topCat } = summarize(arr);
  const sumToday = document.getElementById("sumToday"); if (sumToday) sumToday.textContent = formatCurrency(today, state.prefs.currency);
  const sumMonth = document.getElementById("sumMonth"); if (sumMonth) sumMonth.textContent = formatCurrency(month, state.prefs.currency);
  const sumTopCat = document.getElementById("sumTopCat"); if (sumTopCat) sumTopCat.textContent = topCat;

  renderCharts(arr);
}

window.addEventListener("DOMContentLoaded", init);
