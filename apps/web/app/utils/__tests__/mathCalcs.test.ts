import { describe, expect, it } from "vitest";
import { calcProgressForRewardTrack } from "../mathCalcs.js";

describe('calcProgressForRewardTrack', () => {
  const totalCards = 132;

  it('should return the correct obj for no cards', () => {
    const result = calcProgressForRewardTrack(totalCards, 0)
    expect(result).toStrictEqual({ progress: 0, level: 1 });
  });

  it('should return the correct obj for 1 card', () => {
    const result = calcProgressForRewardTrack(totalCards, 1)
    expect(result).toStrictEqual({ progress: 1, level: 1 });
  });

  it('should return the correct obj for 14 cards', () => {
    const result = calcProgressForRewardTrack(totalCards, 14)
    expect(result).toStrictEqual({ progress: 0, level: 1 });
  });

  it('should return the correct obj for 15 cards', () => {
    const result = calcProgressForRewardTrack(totalCards, 15)
    expect(result).toStrictEqual({ progress: 1, level: 2 });
  });

  it('should return the correct obj for 28 cards', () => {
    const result = calcProgressForRewardTrack(totalCards, 28)
    expect(result).toStrictEqual({ progress: 0, level: 2 });
  });

  it('should return the correct obj for 29 cards', () => {
    const result = calcProgressForRewardTrack(totalCards, 29)
    expect(result).toStrictEqual({ progress: 1, level: 3 });
  });

  it('should return the correct obj for 41 cards', () => {
    const result = calcProgressForRewardTrack(totalCards, 41)
    expect(result).toStrictEqual({ progress: 0, level: 3 });
  });

  it('should return the correct obj for 130 cards', () => {
    const result = calcProgressForRewardTrack(totalCards, 130)
    expect(result).toStrictEqual({ progress: 11, level: 10 });
  });

  it('should return the correct obj for 132 cards', () => {
    const result = calcProgressForRewardTrack(totalCards, 132)
    expect(result).toStrictEqual({ progress: 0, level: 11 });
  });
});