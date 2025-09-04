
// app.js
import { CONFIG } from "./config.js";
import { i18nDict, getInitialLang, applyLang, t } from "./i18n.js";
import { uid, formatCurrency, todayISO, parseISO, download } from "./utils.js";
import { loadExpenses, saveExpenses, loadPrefs, savePrefs, clearAll } from "./storage.js";
import { CATEGORIES, catLabel } from "./categories.js";
import { renderCharts } from "./charts.js";
import { initGA, gaEvent } from "./analytics.js";
import { initAds } from "./ads.js";

let state = {
  expenses: [],
  editingId: null,
  filters: { q: "", from: "", to: "" },
  lang: getInitialLang(),
  prefs: { currency: CONFIG.CURRENCY_SYMBOL, budget: "" }
};

// ---------- Init ----------
function init() {
  // Language
  applyLang(state.lang);
  document.getElementById("langSelect").value = state.lang;

  // Prefs
  const savedPrefs = loadPrefs();
  state.prefs = { ...state.prefs, ...savedPrefs };
  document.getElementById("currencyInput").value = state.prefs.currency || "";
  document.getElementById("budgetInput").value = state.prefs.budget || "";

  // Expenses
  state.expenses = loadExpenses();
  document.getElementById("date").value = todayISO();
  renderAll();

  // GA & Ads
  initGA();
  initAds();

  bindEvents();
}

function bindEvents() {
  // Language change
  document.getElementById("langSelect").addEventListener("change", (e) => {
    state.lang = e.target.value;
    applyLang(state.lang);
    // refresh category labels
    const sel = document.getElementById("category");
    const current = sel.value;
    sel.innerHTML = "";
    CATEGORIES.forEach(c => { const opt = document.createElement("option"); opt.value = c.id; opt.textContent = catLabel(c.id, state.lang); sel.appendChild(opt); });
    if (current) sel.value = current;
    renderAll();
  });

  // Save settings
  document.getElementById("saveSettings").addEventListener("click", () => {
    state.prefs.currency = document.getElementById("currencyInput").value || state.prefs.currency;
    state.prefs.budget = document.getElementById("budgetInput").value || "";
    savePrefs(state.prefs);
    gaEvent("settings_update");
    renderAll();
  });

  // Form submit add/update
  document.getElementById("expenseForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      id: state.editingId || uid(),
      date: form.date.value,
      categoryId: form.category.value,
      description: form.description.value.trim(),
      amount: Number(form.amount.value || 0)
    };
    if (state.editingId) {
      const i = state.expenses.findIndex(x => x.id === state.editingId);
      if (i >= 0) state.expenses[i] = payload;
      state.editingId = null;
      form.submitBtn.textContent = t("add_expense"); // back to add
      document.getElementById("cancelEdit").classList.add("hidden");
    } else {
      state.expenses.push(payload);
      gaEvent("expense_add");
    }
    saveExpenses(state.expenses);
    form.reset();
    form.date.value = todayISO();
    renderAll();
  });

  // Cancel edit
  document.getElementById("cancelEdit").addEventListener("click", () => {
    state.editingId = null;
    const form = document.getElementById("expenseForm");
    form.reset(); form.date.value = todayISO();
    form.submitBtn.textContent = t("add_expense");
    document.getElementById("cancelEdit").classList.add("hidden");
  });

  // Table actions (EDIT/DELETE) — event delegation fixes "Edit not working"
  document.getElementById("tbody").addEventListener("click", (e) => {
    const row = e.target.closest("tr[data-id]");
    if (!row) return;
    const id = row.getAttribute("data-id");
    if (e.target.matches(".btn-edit")) {
      startEdit(id);
    } else if (e.target.matches(".btn-del")) {
      state.expenses = state.expenses.filter(x => x.id !== id);
      saveExpenses(state.expenses);
      renderAll();
    }
  });

  // Filters
  document.getElementById("q").addEventListener("input", (e)=>{
    state.filters.q = e.target.value.trim().toLowerCase();
    renderAll();
  });
  document.getElementById("from").addEventListener("change", (e)=>{
    state.filters.from = e.target.value;
    renderAll();
  });
  document.getElementById("to").addEventListener("change", (e)=>{
    state.filters.to = e.target.value;
    renderAll();
  });
  document.getElementById("clearFilters").addEventListener("click", ()=>{
    state.filters = { q:"", from:"", to:"" };
    document.getElementById("q").value = "";
    document.getElementById("from").value = "";
    document.getElementById("to").value = "";
    renderAll();
  });

  // Export / Import
      getFiltered().forEach(e=> rows.push([e.date, e.category, e.description, e.amount]));
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    download(`expenses-${new Date().toISOString().slice(0,10)}.csv`, csv);
  });

      if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (Array.isArray(data)) {
          // naive validation
          const valid = data.every(x => x.date && x.category && typeof x.amount !== "undefined");
          if (valid) {
            state.expenses = data.map(x => ({ id: x.id || uid(), ...x }));
            saveExpenses(state.expenses);
            renderAll();
          } else {
            alert("Invalid JSON schema.");
          }
        } else {
          alert("Invalid JSON.");
        }
      } catch(err) {
        alert("Failed to parse JSON.");
      }
      e.target.value = "";
    };
    reader.readAsText(file);
  });

  // Reset — fixes "Reset not working"
  document.getElementById("resetAll").addEventListener("click", ()=>{
    const yes = confirm(`${t("confirm_reset_title")}\n\n${t("confirm_reset_msg")}`);
    if (!yes) return;
    clearAll();
    state.expenses = [];
    state.editingId = null;
    state.filters = { q:"", from:"", to:"" };
    const lang = getInitialLang(); // keep auto lang after reset
    localStorage.setItem("lang", lang);
    location.reload();
  });
}

function startEdit(id) {
  const item = state.expenses.find(x => x.id === id);
  if (!item) return;
  state.editingId = id;
  const form = document.getElementById("expenseForm");
  form.date.value = item.date;
  form.category.value = item.categoryId;
  form.description.value = item.description;
  form.amount.value = item.amount;
  form.submitBtn.textContent = t("update_expense");
  document.getElementById("cancelEdit").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getFiltered() {
  let arr = [...state.expenses];
  const { q, from, to } = state.filters;
  if (q) {
    arr = arr.filter(x =>
      (x.description||"").toLowerCase().includes(q) ||
      (catLabel(x.categoryId, state.lang).toLowerCase().includes(q)
    );
  }
  if (from) {
    const d = parseISO(from);
    arr = arr.filter(x => parseISO(x.date) >= d);
  }
  if (to) {
    const d = parseISO(to);
    arr = arr.filter(x => parseISO(x.date) <= d);
  }
  // sort desc by date
  arr.sort((a,b) => (a.date < b.date ? 1 : -1));
  return arr;
}

function summarize(arr) {
  const todayStr = todayISO();
  const today = arr.filter(x => x.date === todayStr).reduce((s,x) => s + Number(x.amount||0), 0);
  const ym = new Date().toISOString().slice(0,7);
  const month = arr.filter(x => x.date.startsWith(ym)).reduce((s,x) => s + Number(x.amount||0), 0);
  const byCat = arr.reduce((acc,e)=>{ acc[e.categoryId]=(acc[e.categoryId]||0)+Number(e.amount||0); return acc; },{});
  let topCat = t("no_data");
  if (Object.keys(byCat).length) {
    topCat = catLabel(Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0][0], state.lang);
  }
  return { today, month, topCat };
}

function renderAll() {
  // Headings & labels update after lang change
  document.getElementById("appTitle").textContent = t("app_title");
  document.getElementById("submitBtnLabel").textContent = state.editingId ? t("update_expense") : t("add_expense");
  document.getElementById("thActions").textContent = t("actions");
  document.getElementById("labelDate").textContent = t("date");
  document.getElementById("labelCategory").textContent = t("category");
  document.getElementById("labelDesc").textContent = t("description");
  document.getElementById("labelAmount").textContent = t("amount");

  const arr = getFiltered();
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  arr.forEach(e => {
    const tr = document.createElement("tr");
    tr.setAttribute("data-id", e.id);
    tr.innerHTML = `
      <td>${e.date}</td>
      <td>${catLabel(e.categoryId, state.lang)}</td>
      <td>${e.description || ""}</td>
      <td>${formatCurrency(e.amount, state.prefs.currency)}</td>
      <td>
        <button class="btn btn-edit" type="button" data-i18n="edit">${t("edit")}</button>
        <button class="btn btn-del" type="button" data-i18n="delete">${t("delete")}</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Summary
  const { today, month, topCat } = summarize(arr);
  document.getElementById("sumToday").textContent = formatCurrency(today, state.prefs.currency);
  document.getElementById("sumMonth").textContent = formatCurrency(month, state.prefs.currency);
  document.getElementById("sumTopCat").textContent = topCat;

  // Charts
  renderCharts(arr);
}

window.addEventListener("DOMContentLoaded", () => {
  // Fill categories
  const sel = document.getElementById("category");
  sel.innerHTML = "";
  CATEGORIES.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = catLabel(c.id, state.lang);
    sel.appendChild(opt);
  });
  init();
});
