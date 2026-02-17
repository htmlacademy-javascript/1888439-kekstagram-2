export function isNotLonger(str, maxLen) {
  const segmenter = new Intl.Segmenter();

  const segmenterIter = segmenter.segment(str)[Symbol.iterator]();
  let strLen = 0;
  while (!segmenterIter.next().done) {
    strLen += 1;
  }

  return strLen <= maxLen;
}

export function isPalindrome(str) {
  const isPunctuation = /\p{P}|\p{Z}/u;

  const segmenter = new Intl.Segmenter();
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
}

export function collectNumber(strOrNum) {
  const DIGITS = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
  };

  const str = strOrNum.toString();

  const collectedDigits = [];
  for (const char of str) {
    if (char in DIGITS) {
      collectedDigits.push(DIGITS[char]);
    }
  }

  if (collectedDigits.length === 0) {
    return NaN;
  }

  return collectedDigits.reduce((num, digit) => num * 10 + digit);
}
