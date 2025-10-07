import { cloneTemplate } from "../lib/utils.js";

export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  (before || [])
    .slice()
    .reverse()
    .forEach((id) => {
      const clone = cloneTemplate(id);
      root[id] = clone;
      root.container.prepend(clone.container);
    });

  (after || []).forEach((id) => {
    const clone = cloneTemplate(id);
    root[id] = clone;
    root.container.append(clone.container);
  });

  // Обработчики событий
  root.container.addEventListener("change", () => onAction());
  root.container.addEventListener("reset", () => {
    setTimeout(() => onAction(), 0);
  });
  root.container.addEventListener("submit", (e) => {
    e.preventDefault();
    onAction(e.submitter);
  });

  const render = (data) => {
    const rows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);
      Object.keys(item).forEach((key) => {
        if (row.elements[key]) {
          const el = row.elements[key];
          if (
            el.tagName.toLowerCase() === "input" ||
            el.tagName.toLowerCase() === "select"
          ) {
            el.value = item[key];
          } else {
            el.textContent = item[key];
          }
        }
      });
      return row.container;
    });
    root.elements.rows.replaceChildren(...rows);
  };

  return { container: root.container, elements: root.elements, render };
}

