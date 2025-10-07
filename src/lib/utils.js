/**
 * Клонирует шаблон и собирает все элементы с атрибутом data-name
 *
 * @param {string} templateId - ID элемента шаблона, существующего в документе
 * @returns {{container: Node, elements: unknown}} - Объект, содержащий контейнер и именованные элементы
 */

export function cloneTemplate(templateId) {
  const template = document.getElementById(templateId);
  const clone = template.content.firstElementChild.cloneNode(true);
  const elements = Array.from(clone.querySelectorAll("[data-name]")).reduce(
    (acc, el) => {
      acc[el.dataset.name] = el;
      return acc;
    },
    {}
  );
  return { container: clone, elements };
}

/**
 * Преобразует объект FormData в обычный JavaScript-объект (только одиночные значения)
 *
 * @param {FormData} formData - Объект FormData для преобразования
 * @returns {Object} - Обычный объект со значениями формы
 */

export function processFormData(formData) {
  return Array.from(formData.entries()).reduce((res, [k, v]) => {
    res[k] = v;
    return res;
  }, {});
}

/**
 * Преобразует коллекцию в объект-индекс по уникальному полю
 *
 * @param {Array|Object} arr - Исходная коллекция объектов или объект
 * @param {string} field - Должно быть уникальным!
 * @param {(Object) => any} val - Функция преобразования значений
 * @returns {Object} - Объект, индексированный по указанному полю
 */
export const makeIndex = (arr, field, val) => {
  // Проверяем, что arr является массивом
  if (!Array.isArray(arr)) {
    // Если это не массив, проверяем, является ли это объектом
    if (typeof arr === "object" && arr !== null) {
      console.warn("Expected an array but got an object, converting to array.");
      // Если это объект, преобразуем его в массив значений
      arr = Object.values(arr);
    } else {
      console.error("Expected an array or object but got:", arr);
      return {}; // Возвращаем пустой объект, если arr не массив и не объект
    }
  }

  return arr.reduce(
    (acc, cur) => ({
      ...acc,
      [cur[field]]: val(cur),
    }),
    {}
  );
};

/**
 * Возвращает массив номеров страниц, центрированный вокруг текущей страницы
 *
 * @param {number} currentPage - Текущая активная страница
 * @param {number} maxPage - Максимальный доступный номер страницы
 * @param {number} limit - Максимальное количество отображаемых страниц
 * @returns {number[]} Массив номеров страниц
 */

export function getPages(currentPage, maxPage, limit) {
  currentPage = Math.max(1, Math.min(maxPage, currentPage));
  limit = Math.min(maxPage, limit);
  let start = Math.max(1, currentPage - Math.floor(limit / 2));
  let end = start + limit - 1;
  if (end > maxPage) {
    end = maxPage;
    start = Math.max(1, end - limit + 1);
  }
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
}
