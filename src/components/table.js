import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
  const beforeIds = before || [];
  const afterIds = after || [];

  // Добавляем шаблоны before (обратный порядок)
  beforeIds
    .slice()
    .reverse()
    .forEach((id) => {
      const clone = cloneTemplate(id);
      root[id] = clone; // сохраняем на объекте
      root.container.prepend(clone.container);
    });

  // Добавляем шаблоны after
  afterIds.forEach((id) => {
    const clone = cloneTemplate(id);
    root[id] = clone;
    root.container.append(clone.container);
  });

  // @todo: #1.3 —  обработать события и вызвать onAction()
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

  /**
   * @param {Array} data - массив данных
   */

  const render = (data) => {
    // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
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
    // Обновляем строки таблицы
    root.elements.rows.replaceChildren(...nextRows);
  };

  return { ...root, render };
}

