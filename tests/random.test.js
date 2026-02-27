import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { getRandomInt } from '../js/random';

describe('should getRandomInt function return random integer in specified semi-interval [a, b)', () => {
  beforeEach(() => {
    vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('when one argument is passed', () => {
    expect(getRandomInt(0)).toBe(0);
    expect(getRandomInt(1)).toBe(0);
    expect(getRandomInt(10)).toBe(5);
  });

  test('when two arguments are passed', () => {
    expect(getRandomInt(0, 1)).toBe(0);
    expect(getRandomInt(0, 5)).toBe(2);
    expect(getRandomInt(-10, 10)).toBe(0);
  });

  test('when are the boundary cases', () => {
    expect(getRandomInt(0, 0)).toBe(0);
    expect(getRandomInt(10, -10)).toBe(0);
    expect(getRandomInt(-10)).toBe(-5);
    expect(getRandomInt(-10.5)).toBe(-5);
    expect(getRandomInt(0.5, 10.5)).toBe(5);
  });
});
