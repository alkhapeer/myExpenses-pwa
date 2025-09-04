// ======= i18n.js =======
window.I18N = {
  ar: {
    app_title: "مصاريفي | My Expenses",
    add_expense: "إضافة مصروف",
    name: "الاسم/الوصف",
    amount: "المبلغ",
    category: "التصنيف",
    date: "التاريخ",
    note_optional: "ملاحظة (اختياري)",
    save: "حفظ",
    expenses: "المصاريف",
    actions: "إجراءات",
    delete: "حذف",
    edit: "تعديل",
    total_today: "إجمالي اليوم",
    total_month: "إجمالي الشهر",
    remaining_budget: "المتبقي من الميزانية",
    set_budget: "تحديد الميزانية الشهرية",
    filters: "بحث/تصفية",
    filter_category: "تصنيف",
    filter_date_from: "من تاريخ",
    filter_date_to: "إلى تاريخ",
    apply_filters: "تطبيق",
    reset_filters: "إعادة تعيين",
    export_csv: "تصدير CSV",
    reset_data: "مسح البيانات",
    confirm_reset: "هل أنت متأكد من مسح كل البيانات؟",
    language: "اللغة",
    install_app: "📲 ثبّت التطبيق",
    privacy: "الخصوصية",
    banner_top: "بنر أعلى",
    banner_bottom: "بنر أسفل",
    toggle_banners: "إظهار/إخفاء البنرات",
    highest_category: "أعلى تصنيف إنفاق",
    charts: "الرسوم البيانية",
    pie_title: "توزيع المصروفات بالتصنيفات",
    bar_title: "الإنفاق اليومي",
    toast_added: "تمت الإضافة",
    toast_updated: "تم التحديث",
    toast_deleted: "تم الحذف",
    toast_exported: "تم تنزيل CSV",
    toast_settings_saved: "تم حفظ الإعدادات",
    budget_placeholder: "مثال: 3000",
    lang_toggle: "EN",
  },
  en: {
    app_title: "Masarefy | My Expenses",
    add_expense: "Add Expense",
    name: "Name/Description",
    amount: "Amount",
    category: "Category",
    date: "Date",
    note_optional: "Note (optional)",
    save: "Save",
    expenses: "Expenses",
    actions: "Actions",
    delete: "Delete",
    edit: "Edit",
    total_today: "Total Today",
    total_month: "Total This Month",
    remaining_budget: "Remaining Budget",
    set_budget: "Monthly Budget",
    filters: "Search/Filter",
    filter_category: "Category",
    filter_date_from: "From",
    filter_date_to: "To",
    apply_filters: "Apply",
    reset_filters: "Reset",
    export_csv: "Export CSV",
    reset_data: "Clear Data",
    confirm_reset: "Are you sure you want to clear all local data?",
    language: "Language",
    install_app: "📲 Add to Home Screen",
    privacy: "Privacy",
    banner_top: "Top Banner",
    banner_bottom: "Bottom Banner",
    toggle_banners: "Toggle Banners",
    highest_category: "Top Spending Category",
    charts: "Charts",
    pie_title: "Spending by Category",
    bar_title: "Daily Spending",
    toast_added: "Added",
    toast_updated: "Updated",
    toast_deleted: "Deleted",
    toast_exported: "CSV downloaded",
    toast_settings_saved: "Settings saved",
    budget_placeholder: "e.g., 3000",
    lang_toggle: "ع",
  }
};

window.I18nState = { lang: 'ar' };

function detectLanguage(){
  const pref = (localStorage.getItem('lang') || window.APP_CONFIG.DEFAULT_LANGUAGE || 'auto');
  if (pref !== 'auto') return pref;
  const nav = (navigator.language||'').toLowerCase();
  return nav.startsWith('ar') ? 'ar' : 'en';
}

function applyLanguage(lang){
  window.I18nState.lang = lang;
  localStorage.setItem('lang', lang);
  const dict = window.I18N[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{
    const key = el.getAttribute('data-i18n-ph');
    if(dict[key]) el.setAttribute('placeholder', dict[key]);
  });
}

function toggleLanguage(){
  const lang = window.I18nState.lang === 'ar' ? 'en' : 'ar';
  applyLanguage(lang);
  if(typeof window.renderCharts === 'function'){ window.renderCharts(); }
}

window.addEventListener('DOMContentLoaded', ()=>{
  const lang = detectLanguage();
  applyLanguage(lang);
});
