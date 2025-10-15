import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";

import { initSearching } from "./components/searching.js";

// Исходные данных для таблицы
const api = initData(sourceData);

/**
 * Собираем состояние формы (текущие параметры таблицы)
 * @returns {Object}
 */
function collectState() {
  // Получение данных из формы таблицы
  const state = processFormData(new FormData(sampleTable.container));
  // Преобразование строк в числа
  const rowsPerPage = parseInt(state.rowsPerPage);
  const page = parseInt(state.page ?? 1);

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Основная функция перерисовки таблицы
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
  let state = collectState();
  let query = {};

  // @todo: использование

  query = applySearching(query, state, action);
  query = applyFiltering(query, state, action);
  query = applySorting(query, state, action);
  query = applyPagination(query, state, action);
  console.log(query);

  // Получение данных по API
  const { total, items } = await api.getRecords(query);

  updatePagination(total, query);
  sampleTable.render(items);
}

// Инициализация компонента таблицы
const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render
);

// Инилизация пагинации 
const { applyPagination, updatePagination } = initPagination(
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {
    const inputElem = el.querySelector("input");
    const labelElem = el.querySelector("span");

    inputElem.value = page;
    inputElem.checked = isCurrent;
    labelElem.textContent = page;

    return el;
  }
);
//Инициализация поиска
const applySearching = initSearching(sampleTable.search.elements.search.name);

// Инициализация фильтрации
const { applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter.elements
);

// Инициализация сортировки 
const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

// Инициализация данных и первичный рендер
const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

async function init() {
  const indexes = await api.getIndexes();

  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers,
  });
}

init().then(() => {
  return render();
});
