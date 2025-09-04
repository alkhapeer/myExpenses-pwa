let categories = ["طعام","مواصلات","فواتير","تسوق","أخرى"];

function renderCategories() {
  const catSel = document.getElementById("eCategory");
  const filterSel = document.getElementById("filterCategory");
  catSel.innerHTML = "";
  filterSel.innerHTML = `<option value="all">كل الفئات</option>`;
  categories.forEach(c => {
    catSel.innerHTML += `<option value="${c}">${c}</option>`;
    filterSel.innerHTML += `<option value="${c}">${c}</option>`;
  });
}

document.getElementById("addCategoryBtn").addEventListener("click", () => {
  const c = prompt("أدخل اسم الفئة الجديدة:");
  if (c && !categories.includes(c)) {
    categories.push(c);
    saveData();
    renderCategories();
  }
});
