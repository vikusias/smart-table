import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  return (data, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === "sort") {
      // Циклический переход
      action.dataset.value = sortMap[action.dataset.value];
      field = action.dataset.field;
      order = action.dataset.value;

      // Очистка остальных
      columns.forEach((col) => {
        if (col.dataset.field !== action.dataset.field) {
          col.dataset.value = "none";
        }
      });
    } else {
      // Проверка выбранной сортировки
      columns.forEach((col) => {
        if (col.dataset.value !== "none") {
          field = col.dataset.field;
          order = col.dataset.value;
        }
      });
    }
    return sortCollection(data, field, order);
  };
}
