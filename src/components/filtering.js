export function initFiltering(filterElements) {
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      const selectElement = elements[elementName];
      if (selectElement) {
        selectElement.append(
          ...Object.values(indexes[elementName]).map((name) => {
            const el = document.createElement("option");
            el.textContent = name;
            el.value = name;
            return el;
          })
        );
      }
    });
  };

  const applyFiltering = (query, state, action) => {
    if (action && action.name === "clear") {
      const parent = action.target.closest("button");
      const fieldName = parent.dataset.field;
      if (fieldName && filterElements[fieldName]) {
        filterElements[fieldName].value = "";
      }
    }

    const filter = {};
    Object.keys(filterElements).forEach((key) => {
      const element = filterElements[key];
      if (
        element &&
        ["INPUT", "SELECT"].includes(element.tagName) &&
        element.value
      ) {
        filter[`filter[${element.name}]`] = element.value;
      }
    });

    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
