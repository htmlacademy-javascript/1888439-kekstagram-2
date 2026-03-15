import { queryByText } from '@testing-library/dom';
import { afterAll, afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { createFragmentWith, getRandomInt, keepNumberInRange, parseTime, selectOrThrow } from '../js/utils';

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

  test('when the limit less than 1', () => {
    expect(() => keepNumberInRange(randomNum, 0)).toThrowError(RangeError);
  });
});

describe('should parseTime function return time in minutes', () => {
  test('when it received the time in full format', () => {
    expect(parseTime('00:00')).toBe(0);
    expect(parseTime('01:05')).toBe(65);
    expect(parseTime('23:59')).toBe(24 * 60 - 1);
  });

  test('when it received the time in short format', () => {
    expect(parseTime('0:0')).toBe(0);
    expect(parseTime('1:5')).toBe(65);
  });
});

describe('should createFragmentWith function return DocumentFragment filled with data', () => {
  let cb;

  beforeEach(() => {
    cb = vi.fn((data) => {
      const paragraph = document.createElement('p');
      paragraph.textContent = data;
      return paragraph;
    });
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  test('when it gets scalar data', () => {
    const data = 1;

    const fragment = createFragmentWith(data, cb);

    expect(queryByText(fragment, data)).not.toBeNull();
    expect(fragment).instanceOf(DocumentFragment);
    expect(cb).toBeCalledTimes(1);
  });

  test('when it gets data array', () => {
    const data = [1, 2, 3];

    const fragment = createFragmentWith(data, cb);
    const elements = data.map((dataItem) => queryByText(fragment, dataItem));

    expect(elements.every((element) => element !== null)).toBe(true);
    expect(fragment).instanceOf(DocumentFragment);
    expect(cb).toBeCalledTimes(data.length);
  });
});

describe('should selectOrThrow function return selected element or throw error', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('when it not gets root element', () => {
    const className = 'element';
    document.body.innerHTML = `
      <p class="${className}"></p>
    `;

    const selectedElement = selectOrThrow(`.${className}`);

    expect(selectedElement).instanceOf(HTMLParagraphElement);
  });

  test('when it gets root element', () => {
    const className = 'element';
    document.body.innerHTML = `
      <p class="${className}">
        <span class="another-${className}"></span>
      </p>

      <h2 class="another-${className}"></h2>
    `;

    const rootEl = document.querySelector(`.${className}`);
    const selectedElement = selectOrThrow(`.another-${className}`, rootEl);

    expect(selectedElement).instanceOf(HTMLSpanElement);
  });

  test('when it not found element', () => {
    const className = 'element';
    document.body.innerHTML = `
      <p class="${className}"></p>
    `;

    expect(() => selectOrThrow(`.another-${className}`))
      .toThrowError(/not found/);
  });
});
