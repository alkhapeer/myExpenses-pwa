const DICT = {
  ar: {
    app: "مصاريفي",
    today: "اليوم",
    month: "الشهر",
    budget: "ميزانية شهرية",
    addExpense: "إضافة مصروف",
    listTitle: "قائمة المصاريف",
    charts: "إحصائيات",
    advice: "نصائح",
    save: "حفظ",
    reset: "إعادة تعيين",
    backup: "نسخ احتياطي",
    restore: "استعادة"
  },
  en: {
    app: "Masarefy",
    today: "Today",
    month: "Month",
    budget: "Monthly Budget",
    addExpense: "Add Expense",
    listTitle: "Expenses list",
    charts: "Charts",
    advice: "Advice",
    save: "Save",
    reset: "Reset",
    backup: "Backup",
    restore: "Restore"
  }
};

let CURRENT_LANG = localStorage.getItem("masarefy.lang") || APP_CONFIG.DEFAULT_LOCALE || "ar";

function applyI18n() {
  const d = DICT[CURRENT_LANG] || DICT.ar;
  document.getElementById("app-title").textContent = d.app;
  document.getElementById("todayLabel").textContent = d.today;
  document.getElementById("monthLabel").textContent = d.month;
  document.getElementById("budgetLabel").textContent = d.budget;
  document.getElementById("addTitle").textContent = d.addExpense;
  document.getElementById("listTitle").textContent = d.listTitle;
  document.getElementById("chartsTitle").textContent = d.charts;
  document.getElementById("adviceTitle").textContent = d.advice;
  document.getElementById("setBudgetBtn").textContent = d.save;
  document.getElementById("resetBtn").textContent = d.reset;
  document.getElementById("exportBtn").textContent = d.backup;
  document.getElementById("importBtn").textContent = d.restore;

  document.getElementById("langBtn").textContent = CURRENT_LANG === "ar" ? "EN" : "AR";
}

document.getElementById("langBtn").addEventListener("click", () => {
  CURRENT_LANG = CURRENT_LANG === "ar" ? "en" : "ar";
  localStorage.setItem("masarefy.lang", CURRENT_LANG);
  applyI18n();
  renderAll(); // re-render UI texts/data that depend on lang
});
applyI18n();
