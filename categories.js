let categories = [];

function initCategories() {
  const stored = loadAll().categories;
  categories = Array.isArray(stored) && stored.length ? stored : APP_CONFIG.CATEGORIES_DEFAULT.slice();
  renderCategoriesUI();
}

function renderCategoriesUI(){
  const sel = document.getElementById("eCategory");
  const filter = document.getElementById("filterCategory");
  const catList = document.getElementById("categoriesList");
  sel.innerHTML = ""; filter.innerHTML = `<option value="">كل الفئات</option>`; catList.innerHTML = "";

  categories.forEach((c, idx) => {
    const opt = document.createElement("option"); opt.value = c; opt.textContent = c;
    sel.appendChild(opt);
    const fopt = document.createElement("option"); fopt.value = c; fopt.textContent = c;
    filter.appendChild(fopt);

    const li = document.createElement("li");
    li.innerHTML = `<span>${c}</span><div>
      <button class="btn small" onclick="renameCategory(${idx})">✏️</button>
      <button class="btn small" onclick="removeCategory(${idx})">🗑️</button>
    </div>`;
    catList.appendChild(li);
  });

  // fill day filter (unique days from expenses)
  buildDayFilter();
}

function addCategory(name){
  if(!name) return;
  if(categories.includes(name)) return;
  categories.push(name);
  persistState();
  renderCategoriesUI();
}

function removeCategory(idx){
  if(!confirm("حذف الفئة؟")) return;
  categories.splice(idx,1);
  persistState();
  renderCategoriesUI();
}

function renameCategory(idx){
  const n = prompt("اسم الفئة الجديدة:", categories[idx]);
  if(n && !categories.includes(n)){
    const old = categories[idx];
    categories[idx] = n;
    // migrate expenses category names
    const s = loadAll();
    if(s.expenses){
      s.expenses.forEach(e => { if(e.category === old) e.category = n; });
      saveAll(s);
    }
    persistState();
    renderCategoriesUI();
    renderAll();
  }
}

function persistState(){
  const s = loadAll();
  s.categories = categories;
  saveAll(s);
}
