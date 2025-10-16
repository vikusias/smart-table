export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      elements[elementName].append(
        ...Object.values(indexes[elementName]).map((name) => {
          const optionElem = document.createElement("option");
          optionElem.value = name;
          optionElem.textContent = name;

          return optionElem;
        })
      );
    });
  };

  const applyFiltering = (query, state, action) => {
    if (action && action.name === "clear") {
      const parent = action.parentElement;
      const inputElem = parent.querySelector("input");
      const field = action.dataset.field;

      inputElem.value = "";
      state[field] = "";
    }
    

    const filter = {};
    Object.keys(elements).forEach((key) => {
      if (elements[key]) {
        if (
          ["INPUT", "SELECT"].includes(elements[key].tagName) &&
          elements[key].value
        ) {
          filter[`filter[${elements[key].name}]`] = elements[key].value;
        }
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
