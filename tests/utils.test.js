import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { getRandomInt, keepNumberInRange } from '../js/utils';

describe('should getRandomInt function return the deterministic value', () => {
  beforeEach(() => {
    vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('when two arguments are passed', () => {
    expect(getRandomInt(0, 5)).toBe(2);
    expect(getRandomInt(-10, 10)).toBe(0);
  });

  test('when generated number does not include an upper bound', () => {
    expect(getRandomInt(0, 1)).toBe(0);
  });

  test('when one argument is passed', () => {
    expect(getRandomInt(10)).toBe(5);
  });

  test('when are the boundary cases', () => {
    expect(getRandomInt(0, 0)).toBe(0);
    expect(getRandomInt(0.5, 10.5)).toBe(5);
    expect(() => getRandomInt(10, 1)).toThrowError(RangeError);
    expect(() => getRandomInt(-10)).toThrowError(RangeError);
  });
});

describe('should keepNumberInRange function have the deterministic algorithm', () => {
  let randomNum = 0;

  beforeEach(() => {
    randomNum = getRandomInt(5, 15);
  });

  test('when number that are already in the range are passed', () => {
    expect(keepNumberInRange(randomNum, randomNum + 1)).toBe(randomNum);
    expect(keepNumberInRange(1, randomNum)).toBe(1);
    expect(keepNumberInRange(randomNum, randomNum)).toBe(randomNum);
  });

  test('when the number is greater than limit', () => {
    expect(keepNumberInRange(randomNum + 1, randomNum)).toBe(1);
  });

  test('when the number is less than 1', () => {
    expect(keepNumberInRange(0, randomNum)).toBe(randomNum);
  });
});
