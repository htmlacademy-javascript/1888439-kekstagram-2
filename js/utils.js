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
 */
export const keepNumberInRange = (num, limit) => (
  ((num - 1) % limit + limit) % limit + 1
);
