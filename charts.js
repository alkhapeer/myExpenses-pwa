let pieChart, barChart;

function renderCharts(){
  // gather data aggregated by category for current month
  const all = loadAll().expenses || [];
  const month = monthKey();
  const filtered = all.filter(e => e.date && e.date.startsWith(month));
  const byCat = {};
  filtered.forEach(e => { byCat[e.category] = (byCat[e.category]||0) + (+e.amount||0); });

  const labels = Object.keys(byCat);
  const values = Object.values(byCat);

  const pieCtx = document.getElementById("pieChart").getContext("2d");
  const barCtx = document.getElementById("barChart").getContext("2d");

  if(pieChart) pieChart.destroy();
  if(barChart) barChart.destroy();

  pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: { labels, datasets: [{ data: values }] },
    options: { responsive:true }
  });

  // Bar: last 14 days
  const days = [];
  for(let i=13;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); days.push(d.toISOString().slice(0,10)); }
  const perDay = days.map(day => filtered.filter(e => e.date===day).reduce((s,e)=>s+ (+e.amount||0),0));
  barChart = new Chart(barCtx, {
    type: 'bar',
    data: { labels: days.map(d=>d.slice(5)), datasets:[{ label: 'مصاريف', data: perDay }] },
    options: { responsive:true }
  });
}
