
// charts.js
import { t } from "./i18n.js";
import { catLabel } from "./categories.js";

let pieChart, barChart;
export function renderCharts(expenses) {
  const hasChart = window.Chart && typeof Chart === "function";
  const pieEl = document.getElementById("pieChart");
  const barEl = document.getElementById("barChart");

  if (!hasChart || !pieEl || !barEl) return;

  const byCategory = expenses.reduce((acc, e) => {
    acc[e.categoryId] = (acc[e.categoryId] || 0) + Number(e.amount || 0);
    return acc;
  }, {});
  const lang = localStorage.getItem("lang") || "ar";
  const catLabels = Object.keys(byCategory).map(id => catLabel(id, lang));
  const catValues = Object.values(byCategory);

  const byMonth = expenses.reduce((acc, e) => {
    const d = new Date(e.date);
    const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    acc[k] = (acc[k] || 0) + Number(e.amount || 0);
    return acc;
  }, {});
  const mLabels = Object.keys(byMonth).sort();
  const mValues = mLabels.map(k => byMonth[k]);

  // Destroy previous
  if (pieChart) { pieChart.destroy(); }
  if (barChart) { barChart.destroy(); }

  pieChart = new Chart(pieEl.getContext("2d"), {
    type: "pie",
    data: { labels: catLabels, datasets: [{ data: catValues }] },
    options: { plugins: { legend: { display: true } } }
  });

  barChart = new Chart(barEl.getContext("2d"), {
    type: "bar",
    data: { labels: mLabels, datasets: [{ data: mValues, label: "Total" }] },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });
}
