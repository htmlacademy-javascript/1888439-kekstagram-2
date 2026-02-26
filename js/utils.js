/**
 * Generate random number in range [from, to)
 * @param {number} fromOrTo
 * @param {number} [to]
 * @returns {number}
 */
export const getRandomInt = (fromOrTo, to) => {
  fromOrTo = Math.trunc(fromOrTo);
  if (to === undefined) {
    to = fromOrTo;
    fromOrTo = 0;
  }
  to = Math.trunc(to);

  if (fromOrTo > to) {
    [fromOrTo, to] = [to, fromOrTo];
  }

  return Math.trunc(Math.random() * (to - fromOrTo)) + fromOrTo;
};

/**
 * Cycle number in range [1, limit]
 * @param {number} num - Limited id
 * @param {number} limit - Max limit
 * @returns {number}
 */
export const cycleNum = (num, limit) => ((Math.max(1, num) - 1) % Math.max(1, limit)) + 1;
