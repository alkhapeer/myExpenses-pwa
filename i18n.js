// ====================
// 📌 i18n.js
// ====================

const translations = {
  ar: {
    addExpense: "إضافة مصروف",
    listTitle: "قائمة المصاريف",
    today: "اليوم",
    month: "الشهر",
    budget: "ميزانية شهرية",
    save: "حفظ",
    reset: "إعادة تعيين",
    export: "تصدير",
    advice: "نصائح",
  },
  en: {
    addExpense: "Add Expense",
    listTitle: "Expenses List",
    today: "Today",
    month: "Month",
    budget: "Monthly Budget",
    save: "Save",
    reset: "Reset",
    export: "Export",
    advice: "Advice",
  }
};

let currentLang = "ar";
const langBtn = document.getElementById("langBtn");

langBtn.addEventListener("click", () => {
  currentLang = currentLang === "ar" ? "en" : "ar";
  applyTranslations();
});

function applyTranslations() {
  const t = translations[currentLang];
  document.getElementById("addTitle").textContent = t.addExpense;
  document.getElementById("listTitle").textContent = t.listTitle;
  document.getElementById("setBudgetBtn").textContent = t.save;
  document.getElementById("resetBtn").textContent = t.reset;
  document.getElementById("exportBtn").textContent = t.export;
  document.getElementById("app-title").textContent = currentLang === "ar" ? "مصاريفي" : "My Expenses";
  langBtn.textContent = currentLang === "ar" ? "EN" : "AR";
}
