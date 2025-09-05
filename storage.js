
const KEY_EXPENSES = "expenses";
const KEY_PREFS = "prefs";
const KEY_CATS = "saved_categories";

export function loadExpenses(){ try{return JSON.parse(localStorage.getItem(KEY_EXPENSES)||"[]");}catch{return[];} }
export function saveExpenses(a){ localStorage.setItem(KEY_EXPENSES, JSON.stringify(a)); }

export function loadPrefs(){ try{return JSON.parse(localStorage.getItem(KEY_PREFS)||"{}");}catch{return{};} }
export function savePrefs(p){ localStorage.setItem(KEY_PREFS, JSON.stringify(p)); }

export function loadCategories(){ try{return JSON.parse(localStorage.getItem(KEY_CATS)||"[]");}catch{return[];} }
export function saveCategories(arr){
  const clean = Array.from(new Set((arr||[]).map(s=>String(s||"").trim()).filter(Boolean)));
  localStorage.setItem(KEY_CATS, JSON.stringify(clean));
}
export function addCategory(name){
  const n = String(name||"").trim(); if (!n) return;
  const cur = loadCategories();
  if (!cur.includes(n)){ cur.push(n); saveCategories(cur); }
}
