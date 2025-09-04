// ====================
// 📌 app.js
// ====================

// العناصر
const expenseForm = document.getElementById("expenseForm");
const expensesList = document.getElementById("expensesList");
const totalTodayEl = document.getElementById("totalToday");
const totalMonthEl = document.getElementById("totalMonth");
const budgetInput = document.getElementById("budgetInput");
const setBudgetBtn = document.getElementById("setBudgetBtn");
const adviceText = document.getElementById("adviceText");
const resetBtn = document.getElementById("resetBtn");
const exportBtn = document.getElementById("exportBtn");
const currencySelect = document.getElementById("currency");
const searchInput = document.getElementById("search");

// البيانات
let expenses = loadData().expenses || [];
let budget = loadData().budget || 0;
let currency = loadData().currency || "ج.م";

// تهيئة
budgetInput.value = budget || "";
currencySelect.value = currency || "ج.م";
renderExpenses();
renderSummary();
renderAdvice();
renderCharts();

// إضافة مصروف
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("eName").value;
  const amount = +document.getElementById("eAmount").value;
  const category = document.getElementById("eCategory").value;
  const date = document.getElementById("eDate").value || new Date().toISOString().slice(0,10);

  expenses.push({ id: Date.now(), name, amount, category, date });
  saveData();
  renderExpenses();
  renderSummary();
  renderAdvice();
  renderCharts();
  expenseForm.reset();
});

// تعيين ميزانية
setBudgetBtn.addEventListener("click", () => {
  budget = +budgetInput.value || 0;
  currency = currencySelect.value;
  saveData();
  renderSummary();
  renderAdvice();
});

// تصدير JSON
exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(loadData(), null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "expenses-backup.json";
  a.click();
});

// إعادة تعيين
resetBtn.addEventListener("click", () => {
  if (confirm("هل أنت متأكد من إعادة التعيين؟")) {
    localStorage.removeItem("masarefy");
    expenses = [];
    budget = 0;
    currency = "ج.م";
    location.reload();
  }
});

// 🔎 البحث
searchInput.addEventListener("input", () => {
  renderExpenses(searchInput.value);
});

// حفظ/تحميل
function saveData() {
  localStorage.setItem("masarefy", JSON.stringify({ expenses, budget, currency }));
}
function loadData() {
  return JSON.parse(localStorage.getItem("masarefy") || "{}");
}

// عرض الملخص
function renderSummary() {
  const today = new Date().toISOString().slice(0,10);
  const month = new Date().toISOString().slice(0,7);

  const todayTotal = expenses.filter(e => e.date === today).reduce((s,e) => s + e.amount, 0);
  const monthTotal = expenses.filter(e => e.date.startsWith(month)).reduce((s,e) => s + e.amount, 0);

  totalTodayEl.textContent = `اليوم: ${todayTotal} ${currency}`;
  totalMonthEl.textContent = `الشهر: ${monthTotal} ${currency}`;
}

// عرض النصائح
function renderAdvice() {
  if (!budget) {
    adviceText.textContent = "⚠️ اضبط ميزانيتك أولاً!";
    return;
  }
  const month = new Date().toISOString().slice(0,7);
  const monthTotal = expenses.filter(e => e.date.startsWith(month)).reduce((s,e) => s + e.amount, 0);
  const remaining = budget - monthTotal;

  if (remaining <= 0) {
    adviceText.textContent = "❌ تجاوزت ميزانيتك! قلل الإنفاق فوراً.";
  } else if (remaining <= budget * 0.1) {
    adviceText.textContent = "⚠️ الباقي أقل من 10% من الميزانية!";
  } else if (remaining <= budget * 0.3) {
    adviceText.textContent = "ℹ️ اقتربت من استهلاك معظم الميزانية.";
  } else {
    adviceText.textContent = "💡 ممتاز! استمر في التوفير 👌";
  }
}

// عرض القائمة
function renderExpenses(query="") {
  expensesList.innerHTML = "";
  expenses
    .filter(e => e.name.includes(query) || e.category.includes(query))
    .forEach(exp => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${exp.name} - ${exp.amount} ${currency} - ${exp.category} - ${exp.date}
        <button onclick="editExpense(${exp.id})">✏️</button>
        <button onclick="deleteExpense(${exp.id})">🗑️</button>
      `;
      expensesList.appendChild(li);
    });
}

// تعديل
function editExpense(id) {
  const exp = expenses.find(e => e.id === id);
  if (!exp) return;
  document.getElementById("eName").value = exp.name;
  document.getElementById("eAmount").value = exp.amount;
  document.getElementById("eCategory").value = exp.category;
  document.getElementById("eDate").value = exp.date;
  expenses = expenses.filter(e => e.id !== id);
  saveData();
  renderExpenses();
  renderCharts();
}

// حذف
function deleteExpense(id) {
  if (confirm("هل تريد حذف هذا المصروف؟")) {
    expenses = expenses.filter(e => e.id !== id);
    saveData();
    renderExpenses();
    renderSummary();
    renderAdvice();
    renderCharts();
  }
}
