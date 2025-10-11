import { getPages } from "../lib/utils.js";

export const initPagination = (pagesContainer, createPage) => {
  if (!pagesContainer) {
    console.error("Pagination container not found.");
    return {
      applyPagination: () => ({}),
      updatePagination: () => {},
    };
  }

  const pageTemplate = pagesContainer.querySelector("template")?.content.firstElementChild.cloneNode(true);
  
  if (!pageTemplate) {
    console.error("Pagination template not found.");
    return {
      applyPagination: () => ({}),
      updatePagination: () => {},
    };
  }

  pagesContainer.innerHTML = "";

  let pageCount;

  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;
    let page = state.page;

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

    return Object.assign({}, query, {
      limit,
      page,
    });
  };

  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.ceil(total / limit);

    if (pageCount === 0) pageCount = 1;

    const visiblePages = getPages(page, pageCount, 5);
    
    const pagesElement = pagesContainer.querySelector('[data-name="pages"]');
    
    if (pagesElement) {
      pagesElement.replaceChildren(
        ...visiblePages.map((pageNumber) => {
          const el = pageTemplate.cloneNode(true);
          return createPage(el, pageNumber, pageNumber === page);
        })
      );
    }

    const fromRow = document.querySelector("#fromRow");
    const toRow = document.querySelector("#toRow");
    const totalRows = document.querySelector("#totalRows");

    if (fromRow) fromRow.textContent = (page - 1) * limit + 1;
    if (toRow) toRow.textContent = Math.min(page * limit, total);
    if (totalRows) totalRows.textContent = total;
  };

  return {
    applyPagination,
    updatePagination,
  };
};
