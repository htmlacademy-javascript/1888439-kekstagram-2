/**
 * Generate random number in range [from, to)
 *
 * @param {number} fromOrTo
 * @param {number} [to]
 * @returns {number}
 *
 * @throws {RangeError} If 'to' is less than 'from'
 */
export const getRandomInt = (fromOrTo, to) => {
  fromOrTo = Math.trunc(fromOrTo);

  if (to === undefined) {
    to = fromOrTo;
    fromOrTo = 0;
  }

  to = Math.trunc(to);

  if (fromOrTo > to) {
    throw new RangeError('The argument \'to\' must be greater than or equal to the argument \'from\'!');
  }

  return Math.trunc(Math.random() * (to - fromOrTo)) + fromOrTo;
};

/**
 * Keep number in range [1, limit]
 *
 * @param {number} num - Limited number
 * @param {number} limit - Max limit
 * @returns {number}
 *
 * @throws {RangeError} If the limit is less than 1
 */
export const keepNumberInRange = (num, limit) => {
  if (limit < 1) {
    throw new RangeError('The \'limit\' must be greater than or equal 1!');
  }

  return ((num - 1) % limit + limit) % limit + 1;
};

/**
 * Parses the time in the hh:mm format and returns the minutes
 *
 * @param {string} timeStr - Time in the hh:mm format
 * @return {number}
 */
export const parseTime = (timeStr) => {
  const [hours, minutes] = timeStr.split(':', 2).map((component) => parseInt(component, 10));
  return hours * 60 + minutes;
};

/**
 * Creates a DocumentFragment and fills it with data
 *
 * @template DataType
 * @template {HTMLElement} ElementType
 * @param {DataType[] | DataType} data
 * @param {(data: DataType) => ElementType} fillCb
 * @returns {DocumentFragment}
 */
export const createFragmentWith = (data, fillCb) => {
  const fragment = document.createDocumentFragment();

  if (Array.isArray(data)) {
    data.forEach((dataItem) => {
      fragment.append(fillCb(dataItem));
    });
    return fragment;
  }

  fragment.append(fillCb(data));
  return fragment;
};

/**
 * Selects an element in the document
 * or in the provided root element
 *
 * @param {string} selector
 * @param {HTMLElement} [rootEl]
 * @returns {HTMLElement}
 */
export const selectOrThrow = (selector, rootEl) => {
  const selectedElement = (rootEl ?? document).querySelector(selector);

  if (!selectedElement) {
    throw new Error(`Selected element '${selector}' not found!`);
  }

  return selectedElement;
};

/**
 * Trims string and splits by the passed separator
 * Unlike the standard String.prototype.split method, it does not return an array with an empty string
 * if there is nothing to split.
 *
 * @param {string} str
 * @param {string | RegExp} separator
 * @returns {string[]}
 */
export const trimAndSplit = (str, separator) => {
  const subStringsArr = str.trim().split(separator);

  if (subStringsArr.length === 1 && subStringsArr[0] === '') {
    return [];
  }

  return subStringsArr;
};

/**
 * Capitalizes string
 *
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
  if (str.length === 0) {
    return str;
  }

  return `${str[0].toUpperCase()}${str.slice(1)}`;
};

/**
 * Intercepts Escape key inside text fields
 *
 * @param {KeyboardEvent} evt
 */
export const interceptEscInsideInput = (evt) => {
  if (evt.code !== 'Escape') {
    return;
  }

  const isTextInput =
    evt.target instanceof HTMLInputElement && evt.target.type === 'text'
    || evt.target instanceof HTMLTextAreaElement;

  if (isTextInput) {
    evt.stopPropagation();
  }
};
