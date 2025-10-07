import { createComparison, defaultRules } from "../lib/compare.js";

const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  // Заполняем select
  Object.keys(indexes).forEach((name) => {
    elements[name].innerHTML = Object.values(indexes[name]).map(
      (n) => `<option value="${n}">${n}</option>`
    );
  });

  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((name) => {
      elements[name].innerHTML = Object.values(indexes[name]).map(
        (n) => `<option value="${n}">${n}</option>`
      );
    });
  };

  const applyFiltering = (query, state, action) => {
    // Обработка очистки
    if (action && action.name === "clear") {
      const parent = action.target.closest("button");
      const fieldName = parent.dataset.field;
      if (fieldName && elements[fieldName]) {
        elements[fieldName].value = "";
      }
    }

    const filter = {};
    Object.keys(elements).forEach((key) => {
      if (elements[key] && elements[key].value) {
        filter[`filter[${key}]`] = elements[key].value;
      }
    });
    return Object.keys(filter).length ? { ...query, ...filter } : query;
  };

  return { updateIndexes, applyFiltering };
}
