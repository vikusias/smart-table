import "./fonts/ys-display/fonts.css";
import "./style.css";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initFiltering } from "./components/filtering.js";
import { initSorting } from "./components/sorting.js";
import { initSearching } from "./components/searching.js";

const sourceData = await import("./data/dataset_1.js");
const api = initData(sourceData);

// Инициализация таблицы
const {
  container,
  elements,
  render: tableRender,
} = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["header"],
    after: ["pagination"],
  },
  async (action) => {
    await mainRender(action);
  }
);

// Инициализация компонентов
const { applyPagination, updatePagination } = initPagination(
  {
    pages: elements.pages,
    fromRow: elements.pages.querySelector(".from"),
    toRow: elements.pages.querySelector(".to"),
    totalRows: elements.pages.querySelector(".total"),
  },
  (el, page, isCurrent) => {
    el.querySelector("input").value = page;
    el.querySelector("input").checked = isCurrent;
    el.querySelector("span").textContent = page;
    return el;
  }
);

const { updateIndexes } = await (async () => {
  const indexes = await api.getIndexes();
  return initFiltering(elements.filter, {
    searchBySeller: indexes.sellers,
  });
})();

const { applySorting } = initSorting([
  elements.header.querySelector("[data-field='date']"),
  elements.header.querySelector("[data-field='total']"),
]);

const { applySearching } = initSearching("search");

async function init() {
  const indexes = await api.getIndexes();
  updateIndexes(elements.filter, {
    searchBySeller: indexes.sellers,
  });
  await mainRender(); // вызываем нашу новую функцию рендера
}

async function mainRender(action) {
  const state = processFormData(new FormData(container));
  let query = {};

  // Пагинация
  query = applyPagination(query, state, action);
  // Фильтр
  query = initFiltering(elements.filter, {}).applyFiltering(
    query,
    state,
    action
  );
  // Сортировка
  query = applySorting ? applySorting(query, state, action) : query;
  // Поиск
  query = applySearching(query, state, action);

  const { total, items } = await api.getRecords(query);
  updatePagination(total, query);
  tableRender(items);
}

init();
