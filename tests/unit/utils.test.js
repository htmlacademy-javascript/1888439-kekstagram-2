import { queryByText, screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { afterAll, afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  capitalize,
  createFragmentWith,
  getRandomInt,
  interceptEscInsideInput,
  isContainsSomeClass,
  keepNumberInRange,
  parseTime,
  selectOrThrow,
  trimAndSplit
} from '../../js/utils.js';

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
    expect(() => getRandomInt(10, 1)).toThrowError(RangeError);
    expect(() => getRandomInt(-10)).toThrowError(RangeError);
  });
});

describe('should keepNumberInRange function have the deterministic algorithm', () => {
  test('when number that are already in the range are passed', () => {
    expect(keepNumberInRange(1, 10)).toBe(1);
    expect(keepNumberInRange(50, 100)).toBe(50);
  });

  test('when the number is greater than limit', () => {
    expect(keepNumberInRange(10, 1)).toBe(1);
  });

  test('when the number is less than 1', () => {
    expect(keepNumberInRange(0, 10)).toBe(10);
  });

  test('when the limit less than 1', () => {
    expect(() => keepNumberInRange(10, 0)).toThrowError(RangeError);
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

    expect(elements.every(Boolean)).toBeTruthy();
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
    document.body.innerHTML = `<p class="${className}"></p>`;

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

describe('should trimAndSplit function correct split the string into an array of substrings', () => {
  test('when it gets generic string', () => {
    const substrings = ['a', 'b', 'c'];
    const separator = ' ';
    const str = substrings.join(separator);

    expect(trimAndSplit(str, separator)).toEqual(substrings);
    expect(trimAndSplit(`   ${str}\t`, separator)).toEqual(substrings);
  });

  test('when are the boundary case', () => {
    expect(trimAndSplit('', ' ')).toEqual([]);
    expect(trimAndSplit('   \t', ' ')).toEqual([]);
  });
});

describe('should capitalize function set the first character of the string to uppercase', () => {
  test('when it gets generic string', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('Hello')).toBe('Hello');
  });

  test('when are the boundary case', () => {
    expect(capitalize('')).toBe('');
  });
});

describe('should interceptEscInsideInput function intercept Escape keydown event', () => {
  const containerTestId = 'container';
  const inputTestId = 'text-input';
  const textareaTestId = 'textarea-input';
  const handleKeydown = vi.fn();

  beforeEach(() => {
    document.body.innerHTML = `
      <div data-testid="${containerTestId}">
        <input type="text" data-testid="${inputTestId}">
        <textarea data-testid="${textareaTestId}"></textarea>
      </div>
    `;
    window.addEventListener('keydown', handleKeydown);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    window.removeEventListener('keydown', handleKeydown);
    vi.resetAllMocks();
  });

  test('when user is focused on input', async () => {
    const user = userEvent.setup();
    const containerElement = screen.getByTestId(containerTestId);
    const inputTextElement = screen.getByTestId(inputTestId);
    const textareaElement = screen.getByTestId(textareaTestId);

    containerElement.addEventListener('keydown', interceptEscInsideInput);

    await user.click(inputTextElement);
    await user.keyboard('{Escape}');
    expect(handleKeydown).toBeCalledTimes(0);

    await user.click(textareaElement);
    await user.keyboard('{Escape}');
    expect(handleKeydown).toBeCalledTimes(0);
  });
});

describe('should isContainsSomeClass function check if the element contains any of passed classes', () => {
  test('when it gets array of classes', () => {
    const classes = ['a', 'b', 'c'];
    const randomClass = classes[getRandomInt(classes.length)];
    const element = document.createElement('div');
    element.classList.add(...classes);

    expect(isContainsSomeClass(element, [randomClass])).toBe(true);
    expect(isContainsSomeClass(element, ['d', randomClass, 'e'])).toBe(true);
    expect(isContainsSomeClass(element, ['d', 'e'])).toBe(false);
  });
});
