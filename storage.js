
// storage.js
const KEY_EXPENSES = "expenses";
const KEY_PREFS = "prefs";

export function loadExpenses() {
  try { return JSON.parse(localStorage.getItem(KEY_EXPENSES) || "[]"); }
  catch { return []; }
}

export function saveExpenses(arr) {
  localStorage.setItem(KEY_EXPENSES, JSON.stringify(arr));
}

export function loadPrefs() {
  try { return JSON.parse(localStorage.getItem(KEY_PREFS) || "{}"); }
  catch { return {}; }
}

export function savePrefs(p) {
  localStorage.setItem(KEY_PREFS, JSON.stringify(p));
}

export function clearAll() {
  localStorage.removeItem(KEY_EXPENSES);
  localStorage.removeItem(KEY_PREFS);
}
