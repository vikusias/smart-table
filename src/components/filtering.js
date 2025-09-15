import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями
  Object.keys(indexes).forEach((elementName) => {
    elements[elementName].innerHTML = Object.values(indexes[elementName]).map(
      (name) => `<option value="${name}">${name}</option>`
    );
  });

  return (data, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === "clear") {
      const parent = action.target.closest("button");
      const fieldName = parent.dataset.field;
      if (fieldName && elements[fieldName]) {
        elements[fieldName].value = "";
      }
    }
    // @todo: #4.5 — отфильтровать данные используя компаратор

    return data.filter((row) => compare(row, state));
  };
}
