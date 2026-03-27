import { readFile } from 'node:fs/promises';

/**
 * Returns HTML script object by specified path
 *
 * @param {string | URL} path
 * @returns {HTMLScriptElement}
 */
export const getScript = async (path) => {
  const scriptSrc = await readFile(path, { encoding: 'utf-8' });
  const scriptElement = document.createElement('script');
  scriptElement.textContent = scriptSrc;

  return scriptElement;
};
