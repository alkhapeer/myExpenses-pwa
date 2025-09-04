// ======= charts.js =======
(function(){
  let pie, bar;
  window.renderCharts = function(){
    const ctxPie = document.getElementById('pieChart');
    const ctxBar = document.getElementById('barChart');
    if(!ctxPie || !ctxBar || !window.Chart) return;

    const dataByCat = window.computeByCategory();
    const labels = Object.keys(dataByCat);
    const values = Object.values(dataByCat);

    if(pie) pie.destroy();
    pie = new Chart(ctxPie, { type:'pie', data:{ labels, datasets:[{ data: values }] } });

    const perDay = window.computeDailyTotals();
    const dLabels = Object.keys(perDay).sort();
    const dValues = dLabels.map(k=>perDay[k]);

    if(bar) bar.destroy();
    bar = new Chart(ctxBar, { type:'bar', data:{ labels: dLabels, datasets:[{ data: dValues }] } });
  };
})();
