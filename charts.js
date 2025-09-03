let pieChart, barChart;
function renderCharts(){
  const expenses = getExpenses();
  // تصنيف المجموع
  const mapCat = {};
  expenses.forEach(e=>{
    const cat = e.category || 'other';
    mapCat[cat] = (mapCat[cat]||0) + Number(e.amount);
  });
  const labels = Object.keys(mapCat);
  const data = labels.map(l=>mapCat[l]);

  // Pie
  const pieCtx = document.getElementById('pieChart').getContext('2d');
  if(pieChart) pieChart.destroy();
  pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: { labels, datasets:[{ data }] },
    options:{responsive:true}
  });

  // Bar: آخر 7 أيام
  const daysMap = {};
  for(let i=6;i>=0;i--){
    const d = new Date(); d.setDate(d.getDate()-i);
    const key = d.toISOString().slice(0,10);
    daysMap[key]=0;
  }
  expenses.forEach(e=>{
    const key = (new Date(e.date)).toISOString().slice(0,10);
    if(daysMap[key] !== undefined) daysMap[key]+=Number(e.amount);
  });
  const barLabels = Object.keys(daysMap);
  const barData = Object.values(daysMap);
  const barCtx = document.getElementById('barChart').getContext('2d');
  if(barChart) barChart.destroy();
  barChart = new Chart(barCtx, {
    type: 'bar',
    data:{ labels:barLabels, datasets:[{ label:'Expenses', data:barData }] },
    options:{responsive:true}
  });
}
