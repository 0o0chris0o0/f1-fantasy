import { describe, expect, it } from 'vitest';
import { calculateFantasyPoints } from '../generateFantasyScores';

describe('calculateFantasyPoints', () => {

  const testCases = [
    { finishingPosition: 1, startingPosition: 1, driverCount: 22, didDnf: false, expectedRacePoints: 44, expectedQualPoints: 10 }, // 1st place, started 1st, no DNF
    { finishingPosition: 1, startingPosition: 2, driverCount: 22, didDnf: false, expectedRacePoints: 44, expectedQualPoints: 10 }, // 1st place, started 2nd, no DNF
    { finishingPosition: 22, startingPosition: 1, driverCount: 22, didDnf: true, expectedRacePoints: -5, expectedQualPoints: 10 }, // 22nd place, started 1st, DNF
    { finishingPosition: 2, startingPosition: 2, driverCount: 22, didDnf: false, expectedRacePoints: 42, expectedQualPoints: 10 }, // 2nd place, started 2nd, no DNF
    { finishingPosition: 10, startingPosition: 3, driverCount: 22, didDnf: false, expectedRacePoints: 26, expectedQualPoints: 5 }, // 10th place, started 5th, no DNF
    { finishingPosition: 15, startingPosition: 10, driverCount: 22, didDnf: false, expectedRacePoints: 16, expectedQualPoints: 5 }, // 15th place, started 12th, no DNF
    { finishingPosition: 20, startingPosition: 11, driverCount: 22, didDnf: false, expectedRacePoints: 6, expectedQualPoints: 0 }, // 20th place, started 8th, DNF  
    { finishingPosition: 1, startingPosition: 1, driverCount: 20, didDnf: false, expectedRacePoints: 40, expectedQualPoints: 10 }, // 1st place, started 1st, no DNF, 20 drivers
  ]

  it.each(testCases)(
    'should calculate fantasy points for (finished: P$finishingPosition, Qualified: P$startingPosition, Drivers: $driverCount, DNF: $didDnf) correctly',
    ({ finishingPosition, startingPosition, driverCount, didDnf, expectedRacePoints, expectedQualPoints }) => {
      const points = calculateFantasyPoints(finishingPosition, startingPosition, driverCount, didDnf);
      expect(points.raceFantasyPoints).toBe(expectedRacePoints);
      expect(points.qualFantasyPoints).toBe(expectedQualPoints);
    }
  );  
});