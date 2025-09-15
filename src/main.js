import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
// @todo: подключение


// Исходные данные используемые в render()
const { data, ...indexes } = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));

  // Обработка числа строк и страницы
  const rowsPerPage = parseInt(state.rowsPerPage);
  const page = parseInt(state.page ?? 1);

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
  let state = collectState(); // состояние полей из таблицы
  let result = [...data]; // копируем для последующего изменения
  // @todo: использование
  if (applyPagination) {
    result = applyPagination(result, state, action);
  }

  // Перед выводом, можно применить сортировку, фильтр и поиск
  // Например:
  if (applyFiltering) {
    result = applyFiltering(result, state, action);
  }
  if (applySorting) {
    result = applySorting(result, state, action);
  }
  if (applySearching) {
    result = applySearching(result, state, action);
  }

  sampleTable.render(result);

  // обновляем пагинацию
  if (applyPagination) {
    applyPagination(result, state, action);
  }
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["header"],
    after: ["pagination"],
  },
  render
);

// @todo: инициализация
import { initPagination } from "./components/pagination.js";

const applyPagination = initPagination(
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);

// Инициализация фильтрации
// @todo: подключение фильтрации
import { initFiltering } from "./components/filtering.js";

const applyFiltering = initFiltering(sampleTable.filter.elements, {
  searchBySeller: indexes.sellers,
});

// Инициализация сортировки
// @todo: подключение сортировки
import { initSorting } from "./components/sorting.js";

const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

// Инициализация поиска
// @todo: подключение поиска
import { initSearching } from "./components/searching.js";

const searchFieldName = "search"; // имя поля поиска
const applySearching = initSearching(searchFieldName);

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

render();
