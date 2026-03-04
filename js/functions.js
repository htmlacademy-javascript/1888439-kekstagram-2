/**
 * Checks that the string is shorter than or equal to the specified length
 *
 * @param {string} str - String to be checked
 * @param {number} maxLen - Maximum string length
 * @returns {boolean}
 */
export const isNotLonger = (str, maxLen) => {
  const segmenter = new Intl.Segmenter();
  const segmenterIter = segmenter.segment(str)[Symbol.iterator]();

  let strLen = 0;
  while (!segmenterIter.next().done) {
    strLen += 1;
  }

  return strLen <= maxLen;
};

/**
 * Checks that the string is palindrome
 *
 * @param {string} str - String to be checked
 * @returns {boolean}
 */
export const isPalindrome = (str) => {
  const isPunctuation = /\p{P}|\p{Z}/u;
  const segmenter = new Intl.Segmenter();

  /** @type {string[]} */
  const chars = [];
  for (const { segment } of segmenter.segment(str)) {
    if (!isPunctuation.test(segment)) {
      chars.push(segment);
    }
  }

  const collator = new Intl.Collator(undefined, {
    usage: 'search',
    sensitivity: 'accent',
  });
  for (let i = 0, j = chars.length - 1; i < j; ++i, --j) {
    if (collator.compare(chars[i], chars[j]) !== 0) {
      return false;
    }
  }

  return true;
};

/**
 * Collects a number from the digits found in an argument
 *
 * @param {string | number} strOrNum - Arbitrary text or number
 * @returns {number}
 */
export const collectNumber = (strOrNum) => {
  const isDigit = /\d/;
  const str = strOrNum.toString();

  /** @type {string[]} */
  const collectedDigits = [];
  for (const char of str) {
    if (isDigit.test(char)) {
      collectedDigits.push(char);
    }
  }

  return parseInt(collectedDigits.join(''), 10);
};
