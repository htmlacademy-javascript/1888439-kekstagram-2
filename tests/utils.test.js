import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cycleNum, getRandomInt } from '../js/utils';

describe('should getRandomInt function return the deterministic value', () => {
  beforeEach(() => {
    vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('when two arguments are passed', () => {
    expect(getRandomInt(0, 1)).toBe(0);
    expect(getRandomInt(0, 5)).toBe(2);
    expect(getRandomInt(-10, 10)).toBe(0);
  });

  test('when one argument is passed', () => {
    expect(getRandomInt(10)).toBe(5);
  });

  test('when arguments are out of range', () => {
    expect(() => getRandomInt(10, 1)).toThrowError(RangeError);
    expect(() => getRandomInt(-10)).toThrowError(RangeError);
  });

  test('when are the boundary cases', () => {
    expect(getRandomInt(0, 0)).toBe(0);
    expect(getRandomInt(0.5, 10.5)).toBe(5);
  });
});

describe('should cycleNum function have the deterministic algorithm', () => {
  let randomNum = 0;

  beforeEach(() => {
    randomNum = getRandomInt(5, 15);
  });

  test('when values that are already in the range are passed', () => {
    expect(cycleNum(randomNum, randomNum + 1)).toBe(randomNum);
    expect(cycleNum(1, randomNum)).toBe(1);
    expect(cycleNum(randomNum, randomNum)).toBe(randomNum);
  });

  test('when values that are outside the range are passed', () => {
    expect(() => cycleNum(randomNum + 1, randomNum)).toThrowError(RangeError);
    expect(() => cycleNum(-randomNum, randomNum)).toThrowError(RangeError);
    expect(() => cycleNum(0, randomNum)).toThrowError(RangeError);
    expect(() => cycleNum(randomNum, -randomNum)).toThrowError(RangeError);
  });
});
