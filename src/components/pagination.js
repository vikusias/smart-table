import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage
) => {
  let pageCount = 0;

  return (data, state, action) => {
    const rowsPerPage = parseInt(state.rowsPerPage);
    const totalItems = data.length;
    pageCount = Math.ceil(totalItems / rowsPerPage);
    let page = parseInt(state.page ?? 1);

    if (action) {
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1);
          break;
        case "next":
          page = Math.min(pageCount, page + 1);
          break;
        case "first":
          page = 1;
          break;
        case "last":
          page = pageCount;
          break;
      }
    }

    const visiblePages = getPages(page, pageCount, 5);
    pages.replaceChildren(
      ...visiblePages.map((num) => {
        const el = createPage.cloneNode(true);
        return createPage(el, num, num === page);
      })
    );

    fromRow.textContent = (page - 1) * rowsPerPage + 1;
    toRow.textContent = Math.min(page * rowsPerPage, totalItems);
    totalRows.textContent = totalItems;

    const skip = (page - 1) * rowsPerPage;
    return data.slice(skip, skip + rowsPerPage);
  };
};
