
// categories.js (canonical categories with localized labels)
export const CATEGORIES = [
  { id: "food",       labels: { en: "Food",       ar: "طعام" } },
  { id: "transport",  labels: { en: "Transport",  ar: "نقل" } },
  { id: "bills",      labels: { en: "Bills",      ar: "فواتير" } },
  { id: "shopping",   labels: { en: "Shopping",   ar: "تسوق" } },
  { id: "health",     labels: { en: "Health",     ar: "صحة" } },
  { id: "education",  labels: { en: "Education",  ar: "تعليم" } },
  { id: "other",      labels: { en: "Other",      ar: "أخرى" } }
];

export function catLabel(id, lang) {
  const item = CATEGORIES.find(c => c.id === id);
  if (!item) return id || "";
  return item.labels[lang] || item.labels.en;
}
