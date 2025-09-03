const I18N = {
  ar: {
    title: "مصاريفي",
    addTitle: "إضافة مصروف",
    listTitle: "قائمة المصاريف",
    // ... أضف نصوصاً أخرى حسب الحاجة
  },
  en: {
    title: "My Expenses",
    addTitle: "Add expense",
    listTitle: "Expenses list",
  }
};

function applyLanguage(lang){
  document.documentElement.lang = (lang === 'ar') ? 'ar' : 'en';
  document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
  document.getElementById('app-title').textContent = I18N[lang].title;
  document.getElementById('addTitle').textContent = I18N[lang].addTitle;
  document.getElementById('listTitle').textContent = I18N[lang].listTitle;
  // زر اللغة
  document.getElementById('langBtn').textContent = (lang === 'ar') ? 'EN' : 'AR';
}
