/** @type {Record<string, HTMLElement>} */
const cache = {};

/**
 * Retrieves an element from the cache,
 * or if the element is not present in the cache,
 * finds it in the dom, adds it to the cache, and returns it
 *
 * @param {string} selector
 * @param {HTMLElement} [rootEl]
 * @returns {HTMLElement}
 */
export const getElement = (selector, rootEl) => {
  if (selector in cache) {
    return cache[selector];
  }

  const element = (rootEl ?? document).querySelector(selector);

  if (element) {
    cache[selector] = element;
  }

  return element;
};

/**
 * Resets element cache
 */
export const resetCache = () => {
  Object.keys(cache).forEach((key) => {
    delete cache[key];
  });
};
