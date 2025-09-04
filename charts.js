// ====================
// 📌 charts.js
// ====================

let pieChart, barChart;

function renderCharts() {
  const ctxPie = document.getElementById("pieChart").getContext("2d");
  const ctxBar = document.getElementById("barChart").getContext("2d");

  const categories = {};
  expenses.forEach(e => {
    categories[e.category] = (categories[e.category] || 0) + e.amount;
  });

  const labels = Object.keys(categories);
  const data = Object.values(categories);

  if (pieChart) pieChart.destroy();
  if (barChart) barChart.destroy();

  pieChart = new Chart(ctxPie, {
    type: "pie",
    data: {
      labels,
      datasets: [{ data }]
    }
  });

  barChart = new Chart(ctxBar, {
    type: "bar",
    data: {
      labels,
      datasets: [{ data }]
    }
  });
}
