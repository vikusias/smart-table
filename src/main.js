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

// Инициализация таблицы
const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["header", "search", "filter"],
    after: ["pagination"],
  },
  render // функция рендера, определенная ниже
);

// добавляем таблицу в DOM
const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

// Инициализация API с исходными данными
const api = initData(sourceData);

// Инициализация элементов управления
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

const { applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter.elements
);

const applySorting = initSorting([
  sampleTable.header.sortByDate,
  sampleTable.header.sortByTotal,
]);

const searchFieldName = "search";
const applySearching = initSearching(searchFieldName);

// Основная функция отрисовки таблицы
async function render(action = {}) {
  try {
    const state = collectState();

    // Формируем запрос с учетом фильтров, поиска, сортировки и пагинации
    let query = {};
    query = applyFiltering(query, state, action);
    query = applySearching(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);

    // Получение данных с сервера
    const { total, items } = await api.getRecords(query);

    // Обновляем пагинацию и таблицу
    updatePagination(total, query);
    sampleTable.render(items);
  } catch (error) {
    console.error("Ошибка при рендеринге таблицы:", error);
  }
}

// Функция сбора состояния формы
function collectState() {
  const formData = new FormData(sampleTable.container);
  const state = processFormData(formData);

  const rowsPerPage = parseInt(state.rowsPerPage || "10", 10);
  const page = parseInt(state.page ?? "1", 10);

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

// Инициализация приложения
async function init() {
  try {
    const indexes = await api.getIndexes();
    // Обновляем селекты фильтрации
    updateIndexes(sampleTable.filter.elements, {
      searchBySeller: indexes.sellers,
    });
    // первичная отрисовка таблицы
    await render();
  } catch (error) {
    console.error("Ошибка инициализации:", error);
  }
}

// Запуск
init();
