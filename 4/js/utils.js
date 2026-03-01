/**
 * Generate random number in range [from, to)
 * @param {number} fromOrTo
 * @param {number} [to]
 * @returns {number}
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
 * Cycle number in range [1, limit]
 * @param {number} num - Limited id
 * @param {number} limit - Max limit
 * @returns {number}
 * @throws {RangeError} If 'num' is less than 1
 * @throws {RangeError} If 'limit' is less than 'num'
 */
export const cycleNum = (num, limit) => {
  if (num < 1) {
    throw new RangeError('The argument \'num\' must be greater than or equal to 1!');
  }

  if (num > limit) {
    throw new RangeError('The argument \'limit\' must be greater than or equal to the argument \'num\'!');
  }

  return (num - 1) % limit + 1;
};
