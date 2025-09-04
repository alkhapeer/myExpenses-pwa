# مصاريفي | My Expenses — PWA (No Backend)

تطبيق تتبّع مصاريف **بدون أي خادم** (HTML/CSS/JS فقط)، يعمل أوفلاين، مع إحصاءات GA4، وإعلانات (AdSense/Propeller/Adsterra). جاهز للنشر على **Netlify** أو **Vercel**.

## الميزات
- لغتان (ar/en) تلقائي + زر تبديل.
- شاشة ترحيب/إعلان أول مرة (20–30 ثانية) مع عد تنازلي وزر تخطي يظهر بعد نهاية العد (مرّة واحدة لكل جهاز).
- بنرات داخلية قابلة للإظهار/الإخفاء.
- إدارة مصاريف محليًا (LocalStorage): إضافة/تحرير/حذف/بحث/تصفية.
- ملخصات: إجمالي يومي/شهري + أعلى تصنيف.
- رسوم Pie + Bar عبر ملف `vendor/chart.min.js` (مُبسّط – يفضّل استبداله بـ Chart.js الرسمي).
- تصدير CSV + مسح البيانات.
- زر تثبيت (A2HS) + إرشادات iOS.
- PWA كاملة عبر `service-worker.js` (Cache-first للأصول، Network-only للتحليلات/الإعلانات).
- تفضيلات (لغة/بنرات/ميزانية) محفوظة محليًا.

## الإعداد
1) **عدّل `config.js`**:
   - `GA4_MEASUREMENT_ID`: ضع قيمة GA4 (أو اتركه فارغًا لتعطيل التحليلات).
   - `ADS_PROVIDER`: adsense | propeller | adsterra | none
   - مفاتيح الإعلانات:
     - AdSense: `ADSENSE_CLIENT_ID`, `ADSENSE_SLOT_BANNER_TOP`, `ADSENSE_SLOT_BANNER_BOTTOM`
     - Propeller/Adsterra: ضع روابط السكربت/zone id.
   - `CURRENCY_SYMBOL`, `SPLASH_SECONDS`, `CACHE_VERSION` حسب رغبتك.

2) **(اختياري) استبدل** `vendor/chart.min.js` بملف Chart.js الرسمي لضمان ميزات كاملة.

## النشر
- **Netlify**: اسحب المجلد كما هو أو اربطه كمستودع. تأكد من وجود `_headers` (اختياري للأمان).
- **Vercel**: ارفع المجلد أو اربطه. الملف `vercel.json` يضبط بعض الترويسات.

## ملاحظات الخصوصية
- لا تُرسل أي بيانات مصاريف للخادم. كل شيء محليًا على جهاز المستخدم.
- GA4 (إن فُعل) يجمع أحداثًا عامة ومجهولة (app_open, expense_add, settings_update, export_csv).

## تطوير محلي
افتح `index.html` مباشرة أو عبر خادم بسيط:
```bash
python -m http.server 8080
```
ثم زر `http://localhost:8080` (التثبيت عبر SW يعمل فقط على http/https).
