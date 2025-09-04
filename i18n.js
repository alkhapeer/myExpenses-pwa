
// i18n.js
export const i18nDict = {
  ar: {
    app_title: "مصروفاتي",
    add_expense: "إضافة مصروف",
    update_expense: "تحديث المصروف",
    cancel_edit: "إلغاء",
    date: "التاريخ",
    category: "التصنيف",
    description: "الوصف",
    amount: "المبلغ",
    actions: "إجراءات",
    edit: "تعديل",
    delete: "حذف",
    total_today: "إجمالي اليوم",
    total_month: "إجمالي الشهر",
    top_category: "أكثر تصنيف",
    export_csv: "تصدير CSV",
    import_json: "استيراد JSON",
    reset_all: "إعادة التعيين (مسح الكل)",
    language: "اللغة",
    currency: "العملة",
    budget: "الميزانية",
    search: "بحث",
    from: "من",
    to: "إلى",
    install_app: "تثبيت التطبيق",
    settings: "الإعدادات",
    save: "حفظ",
    no_data: "لا توجد بيانات",
    filter: "تصفية",
    clear_filters: "مسح المرشحات",
    confirm_reset_title: "تأكيد إعادة التعيين",
    confirm_reset_msg: "سيتم مسح كل البيانات والتفضيلات. هل أنت متأكد؟",
    yes: "نعم",
    no: "لا"
  },
  en: {
    app_title: "My Expenses",
    add_expense: "Add Expense",
    update_expense: "Update Expense",
    cancel_edit: "Cancel",
    date: "Date",
    category: "Category",
    description: "Description",
    amount: "Amount",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    total_today: "Total Today",
    total_month: "Total Month",
    top_category: "Top Category",
    export_csv: "Export CSV",
    import_json: "Import JSON",
    reset_all: "Reset (Clear All)",
    language: "Language",
    currency: "Currency",
    budget: "Budget",
    search: "Search",
    from: "From",
    to: "To",
    install_app: "Install App",
    settings: "Settings",
    save: "Save",
    no_data: "No data",
    filter: "Filter",
    clear_filters: "Clear Filters",
    confirm_reset_title: "Confirm Reset",
    confirm_reset_msg: "All expenses & preferences will be deleted. Continue?",
    yes: "Yes",
    no: "No"
  }
};

export function getInitialLang() {
  const saved = localStorage.getItem("lang");
  if (saved) return saved;
  const nav = (navigator.language || "en").toLowerCase();
  return nav.startsWith("ar") ? "ar" : "en";
}

export function applyLang(lang) {
  const html = document.documentElement;
  if (lang === "ar") {
    html.setAttribute("lang", "ar");
    html.setAttribute("dir", "rtl");
  } else {
    html.setAttribute("lang", "en");
    html.setAttribute("dir", "ltr");
  }
  const dict = i18nDict[lang];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  // Inputs placeholders with data-i18n-placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) el.setAttribute("placeholder", dict[key]);
  });
  localStorage.setItem("lang", lang);
}

export function t(key) {
  const lang = localStorage.getItem("lang") || getInitialLang();
  return (i18nDict[lang] && i18nDict[lang][key]) || key;
}
