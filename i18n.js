
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
    language: "اللغة",
    currency: "العملة",
    budget: "الميزانية",
    install_app: "تثبيت التطبيق",
    settings: "الإعدادات",
    save: "حفظ",
    save_category: "حفظ التصنيف",
    tips: "نصائح توفير",
    filter: "تصفية",
    search: "بحث",
    from: "من",
    to: "إلى",
    clear_filters: "مسح المرشحات",
    no_data: "لا توجد بيانات",
    install_hint: "التثبيت متاح عندما يسمح المتصفح (HTTPS + دعم)"
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
    language: "Language",
    currency: "Currency",
    budget: "Budget",
    install_app: "Install App",
    settings: "Settings",
    save: "Save",
    save_category: "Save Category",
    tips: "Savings Tips",
    filter: "Filter",
    search: "Search",
    from: "From",
    to: "To",
    clear_filters: "Clear Filters",
    no_data: "No data",
    install_hint: "Install appears when the browser allows (HTTPS + support)"
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
  html.setAttribute("lang", lang);
  html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  const dict = i18nDict[lang];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
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
