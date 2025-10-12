import { sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  return (query, state, action) => {
    let field = null;
    let order = null;

    if (
      action &&
      typeof action === "object" &&
      "dataset" in action &&
      action.dataset
    ) {
      if (action.dataset.name === "sort") {
        const currentOrder = action.dataset.value;
        const sortDirections = {
          none: "up",
          up: "down",
          down: "none",
        };
        const newOrder = sortDirections[currentOrder];

        // Обновляем значение dataset
        if ("dataset" in action && action.dataset) {
          action.dataset.value = newOrder;
        }

        // Получаем поле сортировки
        if ("field" in action.dataset) {
          field = action.dataset.field;
        }
        order = newOrder;

        // Сброс остальных колонок
        columns.forEach((col) => {
          if (col && col.dataset && "value" in col.dataset) {
            col.dataset.value = "none";
          }
        });
      }
    } else {
      columns.forEach((col) => {
        if (
          col &&
          col.dataset &&
          "value" in col.dataset &&
          col.dataset.value !== "none"
        ) {
          if ("field" in col.dataset) {
            field = col.dataset.field;
            order = col.dataset.value;
          }
        }
      });
    }

    const sort = field && order !== "none" ? `${field}:${order}` : null;
    return sort ? Object.assign({}, query, { sort }) : query;
  };
}
