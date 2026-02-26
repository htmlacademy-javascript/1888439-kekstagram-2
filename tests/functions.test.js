import { describe, expect, test } from 'vitest';
import { collectNumber, isMeetingOnTime, isNotLonger, isPalindrome, parseTime } from '../js/functions';

describe('should the isNotLonger function check the maximum length correctly', () => {
  test('when it receives on character', () => {
    expect(isNotLonger('a', 0)).toBe(false);
    expect(isNotLonger('a', 1)).toBe(true);
    expect(isNotLonger('a', 2)).toBe(true);
    expect(isNotLonger('г', 0)).toBe(false);
    expect(isNotLonger('г', 1)).toBe(true);
    expect(isNotLonger('г', 2)).toBe(true);
  });

  test('when it receives multiple character string', () => {
    expect(isNotLonger('Hello world', 11)).toBe(true);
    expect(isNotLonger('Привет мир', 10)).toBe(true);
    expect(isNotLonger('Family 👨‍👩‍👧‍👦', 8)).toBe(true);
    expect(isNotLonger('上海自来水来自海上', 9)).toBe(true);
  });

  test('when are the boundary cases', () => {
    expect(isNotLonger('', 0)).toBe(true);
    expect(isNotLonger('', 1)).toBe(true);

    expect(isNotLonger('🦊', 0)).toBe(false);
    expect(isNotLonger('🦊', 1)).toBe(true);
    expect(isNotLonger('🦊', 2)).toBe(true);

    expect(isNotLonger('👨‍👩‍👧‍👦', 0)).toBe(false);
    expect(isNotLonger('👨‍👩‍👧‍👦', 1)).toBe(true);
    expect(isNotLonger('👨‍👩‍👧‍👦', 2)).toBe(true);
  });
});

describe('should isPalindrome function check that the string is palindrome', () => {
  test('when it receives one character string', () => {
    expect(isPalindrome('a')).toBe(true);
    expect(isPalindrome('a ')).toBe(true);
    expect(isPalindrome(' a')).toBe(true);
    expect(isPalindrome(' a ')).toBe(true);
    expect(isPalindrome('г')).toBe(true);
    expect(isPalindrome('海')).toBe(true);
  });

  test('when it receives multiple character string', () => {
    expect(isPalindrome('Лёша на полке клопа нашёл')).toBe(true);
    expect(isPalindrome(' Лёша на полке клопа нашёл')).toBe(true);
    expect(isPalindrome('Лёша на полке клопа нашёл ')).toBe(true);
    expect(isPalindrome(' Лёша на полке клопа нашёл ')).toBe(true);
    expect(isPalindrome('ДовОд')).toBe(true);
    expect(isPalindrome('上海自来水来自海上')).toBe(true);
    expect(isPalindrome('👨‍👩‍👧‍👦 👨‍👩‍👧‍👦')).toBe(true);
    expect(isPalindrome('Эта строка не палиндром')).toBe(false);
  });

  test('when are the boundary cases', () => {
    expect(isPalindrome('')).toBe(true);
    expect(isPalindrome('    ')).toBe(true);
    expect(isPalindrome('🦊')).toBe(true);
    expect(isPalindrome('👨‍👩‍👧‍👦')).toBe(true);
    // English a and russian а
    expect(isPalindrome('aа')).toBe(false);
  });
});

describe('should collectNumber function extract digits from a string and assemble a number from them', () => {
  test('when it receives only one number in the string', () => {
    expect(collectNumber('0')).toBe(0);
    expect(collectNumber('1')).toBe(1);
    expect(collectNumber('100')).toBe(100);
    expect(collectNumber('-100')).toBe(100);
    expect(collectNumber('10.24')).toBe(1024);
    expect(collectNumber('-10.24')).toBe(1024);
    expect(collectNumber('.24')).toBe(24);
  });

  test('when it receives a number as argument', () => {
    expect(collectNumber(0)).toBe(0);
    expect(collectNumber(1)).toBe(1);
    expect(collectNumber(123)).toBe(123);
    expect(collectNumber(-123)).toBe(123);
    expect(collectNumber(123.456)).toBe(123456);
  });

  test('when it receives string without numbers', () => {
    expect(collectNumber('ECMAScript ')).toBeNaN();
    expect(collectNumber(' кефир,  батона')).toBeNaN();
    expect(collectNumber('а я томат')).toBeNaN();
  });

  test('when it receives numbers among not numeric characters', () => {
    expect(collectNumber('2023 год')).toBe(2023);
    expect(collectNumber(' 2023 год')).toBe(2023);
    expect(collectNumber('2023 год ')).toBe(2023);
    expect(collectNumber(' 2023 год ')).toBe(2023);
    expect(collectNumber(' 023 год ')).toBe(23);
    expect(collectNumber('ECMAScript 2022')).toBe(2022);
    expect(collectNumber('1 кефир, 0.5 батона')).toBe(105);
    expect(collectNumber('агент 007')).toBe(7);
  });

  test('when are the boundary cases', () => {
    expect(collectNumber('')).toBeNaN();
    expect(collectNumber('   ')).toBeNaN();
    expect(collectNumber('0000')).toBe(0);
    expect(collectNumber('0001')).toBe(1);
  });
});

describe('should parseTime function return time in minutes', () => {
  test('when it received the time in full format', () => {
    expect(parseTime('00:00')).toBe(0);
    expect(parseTime('01:00')).toBe(60);
    expect(parseTime('01:15')).toBe(75);
    expect(parseTime('23:59')).toBe(24 * 60 - 1);
  });

  test('when it received the time in short format', () => {
    expect(parseTime('0:0')).toBe(0);
    expect(parseTime('01:0')).toBe(60);
    expect(parseTime('1:00')).toBe(60);
    expect(parseTime('01:5')).toBe(65);
    expect(parseTime('1:05')).toBe(65);
    expect(parseTime('10:5')).toBe(10 * 60 + 5);
  });
});

describe('should isMeetingOnTime function check if meeting within specified range [workdayStart, workdayEnd]', () => {
  test('when it received valid set of arguments', () => {
    expect(isMeetingOnTime('9:00', '18:00', '10:00', 50)).toBe(true);
    expect(isMeetingOnTime('9:00', '18:00', '9:00', 50)).toBe(true);
    expect(isMeetingOnTime('9:00', '18:00', '17:10', 50)).toBe(true);
  });

  test('when it received invalid set of arguments', () => {
    expect(isMeetingOnTime('9:00', '18:00', '8:00', 50)).toBe(false);
    expect(isMeetingOnTime('9:00', '18:00', '18:00', 50)).toBe(false);
    expect(isMeetingOnTime('9:00', '18:00', '17:00', 70)).toBe(false);
  });

  test('when are the boundary cases', () => {
    expect(isMeetingOnTime('9:00', '18:00', '17:10', 0)).toBe(true);
    expect(isMeetingOnTime('9:00', '18:00', '18:00', 0)).toBe(true);
    expect(isMeetingOnTime('9:00', '18:00', '9:00', 0)).toBe(true);
  });
});
