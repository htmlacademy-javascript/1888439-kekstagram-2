import { describe, expect, test } from 'vitest';
import {collectNumber, isNotLonger, isPalindrome} from './functions';

describe('isNotLonger', () => {
  test('emtpy string', () => {
    expect(isNotLonger('', 0)).toBe(true);
    expect(isNotLonger('', 1)).toBe(true);
  });

  test('one english character in the string', () => {
    expect(isNotLonger('a', 0)).toBe(false);
    expect(isNotLonger('a', 1)).toBe(true);
    expect(isNotLonger('a', 2)).toBe(true);
  });

  test('one russian character in the string', () => {
    expect(isNotLonger('г', 0)).toBe(false);
    expect(isNotLonger('г', 1)).toBe(true);
    expect(isNotLonger('г', 2)).toBe(true);
  });

  test('one surrogate pair in the string', () => {
    expect(isNotLonger('🦊', 0)).toBe(false);
    expect(isNotLonger('🦊', 1)).toBe(true);
    expect(isNotLonger('🦊', 2)).toBe(true);
  });

  test('one grapheme cluster in the string', () => {
    expect(isNotLonger('👨‍👩‍👧‍👦', 0)).toBe(false);
    expect(isNotLonger('👨‍👩‍👧‍👦', 1)).toBe(true);
    expect(isNotLonger('👨‍👩‍👧‍👦', 2)).toBe(true);
  });

  test('multiple characters in the string', () => {
    expect(isNotLonger('Hello world', 11)).toBe(true);
    expect(isNotLonger('Привет мир', 10)).toBe(true);
    expect(isNotLonger('Family 👨‍👩‍👧‍👦', 8)).toBe(true);
    expect(isNotLonger('上海自来水来自海上', 9)).toBe(true);
  });
});

describe('isPalindrome', () => {
  test('empty string', () => {
    expect(isPalindrome('')).toBe(true);
    expect(isPalindrome('    ')).toBe(true);
  });

  test('one character in the string', () => {
    expect(isPalindrome('a')).toBe(true);
    expect(isPalindrome('a ')).toBe(true);
    expect(isPalindrome(' a')).toBe(true);
    expect(isPalindrome(' a ')).toBe(true);
    expect(isPalindrome('г')).toBe(true);
    expect(isPalindrome('🦊')).toBe(true);
    expect(isPalindrome('👨‍👩‍👧‍👦')).toBe(true);
    expect(isPalindrome('海')).toBe(true);
  });

  test('multiple characters in the string', () => {
    expect(isPalindrome('Лёша на полке клопа нашёл')).toBe(true);
    expect(isPalindrome(' Лёша на полке клопа нашёл')).toBe(true);
    expect(isPalindrome('Лёша на полке клопа нашёл ')).toBe(true);
    expect(isPalindrome(' Лёша на полке клопа нашёл ')).toBe(true);
    expect(isPalindrome('ДовОд')).toBe(true);
    expect(isPalindrome('上海自来水来自海上')).toBe(true);
    expect(isPalindrome('👨‍👩‍👧‍👦 👨‍👩‍👧‍👦')).toBe(true);
    expect(isPalindrome('Эта строка не палиндром')).toBe(false);
    // English a and russian а
    expect(isPalindrome('aа')).toBe(false);
  });
});

describe('collectNumber', () => {
  test('empty string', () => {
    expect(collectNumber('')).toBeNaN();
    expect(collectNumber('   ')).toBeNaN();
  });

  test('only one number in string', () => {
    expect(collectNumber('0')).toBe(0);
    expect(collectNumber('1')).toBe(1);
    expect(collectNumber('0000')).toBe(0);
    expect(collectNumber('0001')).toBe(1);
    expect(collectNumber('100')).toBe(100);
    expect(collectNumber('-100')).toBe(100);
    expect(collectNumber('10.24')).toBe(1024);
    expect(collectNumber('-10.24')).toBe(1024);
    expect(collectNumber('.24')).toBe(24);
  });

  test('number as argument', () => {
    expect(collectNumber(0)).toBe(0);
    expect(collectNumber(1)).toBe(1);
    expect(collectNumber(123)).toBe(123);
    expect(collectNumber(-123)).toBe(123);
    expect(collectNumber(123.456)).toBe(123456);
  });

  test('string without numbers', () => {
    expect(collectNumber('ECMAScript ')).toBeNaN();
    expect(collectNumber(' кефир,  батона')).toBeNaN();
    expect(collectNumber('а я томат')).toBeNaN();
  });

  test('numbers inside string', () => {
    expect(collectNumber('2023 год')).toBe(2023);
    expect(collectNumber(' 2023 год')).toBe(2023);
    expect(collectNumber('2023 год ')).toBe(2023);
    expect(collectNumber(' 2023 год ')).toBe(2023);
    expect(collectNumber(' 023 год ')).toBe(23);
    expect(collectNumber('ECMAScript 2022')).toBe(2022);
    expect(collectNumber('1 кефир, 0.5 батона')).toBe(105);
    expect(collectNumber('агент 007')).toBe(7);
  });
});
