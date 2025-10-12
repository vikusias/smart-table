import { cloneTemplate } from "../lib/utils.js";

export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  const beforeIds = before || [];
  const afterIds = after || [];

  beforeIds
    .slice()
    .reverse()
    .forEach((id) => {
      const clone = cloneTemplate(id);
      root[id] = clone;
      root.container.prepend(clone.container);
    });

  afterIds.forEach((id) => {
    const clone = cloneTemplate(id);
    root[id] = clone;
    root.container.append(clone.container);
  });

  root.container.addEventListener("change", () => {
    onAction();
  });
  root.container.addEventListener("reset", () => {
    setTimeout(() => {
      onAction();
    }, 0);
  });
  root.container.addEventListener("submit", (e) => {
    e.preventDefault();
    onAction(e.submitter);
  });

  const render = (data) => {
    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);
      Object.keys(item).forEach((key) => {
        if (row.elements[key]) {
          const el = row.elements[key];
          const tag = el.tagName.toLowerCase();
          if (tag === "input" || tag === "select") {
            el.value = item[key];
          } else {
            el.textContent = item[key];
          }
        }
      });
      return row.container;
    });

    root.elements.rows.replaceChildren(...nextRows);
  };

  return { ...root, render };
}
