const expensesList = document.getElementById("expensesList");
const adviceText = document.getElementById("adviceText");
let editingId = null;

function renderExpenses() {
  expensesList.innerHTML = "";
  const q = document.getElementById("search").value.toLowerCase();
  const fCat = document.getElementById("filterCategory").value;
  expenses.forEach((e, i) => {
    if ((fCat === "all" || e.category === fCat) &&
        (e.name.toLowerCase().includes(q) || String(e.amount).includes(q))) {
      const li = document.createElement("li");
      li.className = "expense-item";
      li.innerHTML = `
        <span>${e.name} - ${e.amount} - ${e.category} - ${e.date}</span>
        <div>
          <button onclick="editExpense(${i})">✏️</button>
          <button onclick="deleteExpense(${i})">🗑️</button>
        </div>`;
      expensesList.appendChild(li);
    }
  });
  updateSummary();
  renderCharts();
  renderAdvice();
}

function addExpense(name, amount, category, date) {
  if (editingId !== null) {
    expenses[editingId] = { name, amount, category, date };
    editingId = null;
  } else {
    expenses.push({ name, amount, category, date });
  }
  saveData();
  renderExpenses();
}

function deleteExpense(i) {
  expenses.splice(i, 1);
  saveData();
  renderExpenses();
}

function editExpense(i) {
  const e = expenses[i];
  document.getElementById("eName").value = e.name;
  document.getElementById("eAmount").value = e.amount;
  document.getElementById("eCategory").value = e.category;
  document.getElementById("eDate").value = e.date;
  editingId = i;
}

function updateSummary() {
  const today = new Date().toISOString().split("T")[0];
  let totalToday = 0, totalMonth = 0;
  const month = today.slice(0, 7);
  expenses.forEach(e => {
    if (e.date === today) totalToday += +e.amount;
    if (e.date.startsWith(month)) totalMonth += +e.amount;
  });
  const budget = loadData().budget || 0;
  document.getElementById("totalToday").textContent = `اليوم: ${totalToday}`;
  document.getElementById("totalMonth").textContent =
    `الشهر: ${totalMonth} / الباقي: ${budget - totalMonth}`;
}

function renderAdvice() {
  const budget = loadData().budget || 0;
  const monthSpent = expenses
    .filter(e => e.date.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((s, e) => s + +e.amount, 0);
  if (budget === 0) {
    adviceText.textContent = "اضبط ميزانيتك أولاً!";
  } else if (monthSpent > budget) {
    adviceText.textContent = "⚠️ تجاوزت ميزانيتك! قلل الإنفاق فوراً.";
    notify("⚠️ تنبيه من مصاريفي", "لقد تجاوزت ميزانيتك الشهرية!");
  } else if (monthSpent > budget * 0.7) {
    adviceText.textContent = "اقتربت من استهلاك 70% من الميزانية.";
  } else {
    adviceText.textContent = "ممتاز! استمر في التوفير 👌";
  }
}

function backupData() {
  const data = JSON.stringify({ expenses, categories, budget: loadData().budget });
  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "expenses_backup.json";
  a.click();
}

function restoreData(file) {
  const reader = new FileReader();
  reader.onload = e => {
    const data = JSON.parse(e.target.result);
    expenses = data.expenses || [];
    categories = data.categories || ["طعام","مواصلات","فواتير"];
    saveData(data.budget);
    renderExpenses();
    renderCategories();
  };
  reader.readAsText(file);
}

function notify(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

document.getElementById("expenseForm").addEventListener("submit", e => {
  e.preventDefault();
  addExpense(
    document.getElementById("eName").value,
    +document.getElementById("eAmount").value,
    document.getElementById("eCategory").value,
    document.getElementById("eDate").value || new Date().toISOString().split("T")[0]
  );
  e.target.reset();
});

document.getElementById("exportBtn").addEventListener("click", backupData);
document.getElementById("importBtn").addEventListener("click", () =>
  document.getElementById("importFile").click());
document.getElementById("importFile").addEventListener("change", e =>
  restoreData(e.target.files[0]));
document.getElementById("setBudgetBtn").addEventListener("click", () => {
  saveData(+document.getElementById("budgetInput").value);
  renderAdvice();
});
document.getElementById("search").addEventListener("input", renderExpenses);
document.getElementById("filterCategory").addEventListener("change", renderExpenses);

if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

renderCategories();
renderExpenses();
