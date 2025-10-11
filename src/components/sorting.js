export function initSorting(columns) {
  return (query, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === "sort") {
      const sortDirections = {
        none: 'asc',
        asc: 'desc',
        desc: 'none'
      };

      action.dataset.value = sortDirections[action.dataset.value];
      field = action.dataset.field;
      order = action.dataset.value;

      columns.forEach((column) => {
        if (column !== action) {
          column.dataset.value = "none";
        }
      });
    } else {
      columns.forEach((column) => {
        if (column.dataset.value !== "none") {
          field = column.dataset.field;
          order = column.dataset.value;
        }
      });
    }

    const sort = field && order !== "none" ? `${field}:${order}` : null;

    return sort ? Object.assign({}, query, { sort }) : query;
  };
}

