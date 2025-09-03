# مصاريفي | My Expenses (PWA)

مشروع PWA بسيط: حفظ بيانات محليًا، عرض إحصاءات محلية، Google Analytics، وإعلانات.

## كيفية الاستخدام محليًا
1. ضع كل الملفات في مجلد `masarefy-pwa/`.
2. افتح `index.html` في متصفح (أو استعمل Live Server).
3. أول زيارة ستنتقل إلى `ads.html` لحين انتهاء الإعلان (مرّة واحدة فقط).

## النشر على Netlify
1. ارفع المشروع إلى GitHub.
2. سجل دخول إلى https://app.netlify.com/ وانشئ موقع جديد من GitHub repository.
3. اختر الفرع واضغط Deploy.
4. تأكد من تحرير `config.js` لوضع معرف GA وبيانات AdSense.

## إعدادات مهمة
- ضع `GA4_MEASUREMENT_ID` في `config.js`.
- ضع `ADSENSE_CLIENT_ID` و`ADSENSE_SLOT_*` إذا استخدمت AdSense.
- لتفعيل Propeller/Adsterra عدل `ADS_PROVIDER` واملأ الحقول المناسبة.

## ملاحظات خصوصية
- لا نخزن بيانات المستخدم على الخادم. كل شيء في LocalStorage.
- Google Analytics مسؤول عن إحصاءات الزيارات.

## ترخيص
MIT
