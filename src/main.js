import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initFiltering } from "./components/filtering.js";
import { initSorting } from "./components/sorting.js";
import { initSearching } from "./components/searching.js";

// Создаие таблицы
const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["header"],
    after: ["pagination"],
  },
  render
);

// Добавляем таблицу в DOM
const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

// Инициализация API
const api = initData(sourceData);

//Пагинация — передаём DOM-элемент sampleTable.pagination
const { applyPagination, updatePagination } = initPagination(
  sampleTable.pagination,
  (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);

//Фильтрация
const { applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter // передаём DOM-элемент формы фильтрации
);

//Сортировка
const applySorting = initSorting([
  sampleTable.header.sortByDate,
  sampleTable.header.sortByTotal,
]);

//Поиск
const searchFieldName = "search";
const applySearching = initSearching(searchFieldName);

// --- Основная функция отрисовки таблицы ---
async function render(action) {
  const state = collectState();
  let query = {};

  query = applyFiltering(query, state, action);
  query = applySearching(query, state, action);
  query = applySorting(query, state, action);
  query = applyPagination(query, state, action);

  const { total, items } = await api.getRecords(query);

  updatePagination(total, query);
  sampleTable.render(items);
}

// --- Сбор состояния формы ---
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));

  const rowsPerPage = parseInt(state.rowsPerPage);
  const page = parseInt(state.page ?? 1);

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

// --- Инициализация приложения ---
async function init() {
  const indexes = await api.getIndexes();

  // Обновляем селекты в фильтре
  updateIndexes(sampleTable.filter, {
    searchBySeller: indexes.sellers,
  });

  // Отрисовка таблицы с сервера
  await render();
}

// Запуск
init();
