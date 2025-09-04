let expenses = [];

function saveData(budget) {
  const data = { expenses, categories, budget: budget || loadData().budget || 0 };
  localStorage.setItem("masarefy", JSON.stringify(data));
}

function loadData() {
  return JSON.parse(localStorage.getItem("masarefy") || "{}");
}

(function init() {
  const data = loadData();
  expenses = data.expenses || [];
  categories = data.categories || categories;
  if (data.budget) document.getElementById("budgetInput").value = data.budget;
})();
