import { describe, expect, it } from 'vitest';
import { calcAverage } from '../updateAllCards';

describe('calcAverage', () => {
  it.each([
    // [currentAverage, newVal, noOfRaces, expected]
    { avg: 0, next: 10, count: 1, expected: 10 },
    { avg: 10, next: 10, count: 2, expected: 10 },
    { avg: 10, next: 20, count: 3, expected: 13 },
    { avg: 4, next: 1, count: 10, expected: 4 }, // Decimal handling
  ])('calculates $expected when avg is $avg and next race is $next', ({ avg, next, count, expected }) => {
    expect(calcAverage(avg, next, count)).toBe(expected);
  });
})