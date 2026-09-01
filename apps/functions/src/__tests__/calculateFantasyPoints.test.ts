import { describe, expect, it } from "vitest";
import { iConstructorFantasyScore, iJolpicaResult } from "@f1pick6/shared";
import {
  calculateFantasyPoints,
  generateFantasyScores,
} from "../generateFantasyScores";

describe("calculateFantasyPoints", () => {
  const testCases = [
    {
      finishingPosition: 1,
      startingPosition: 1,
      driverCount: 22,
      didDnf: false,
      expectedRacePoints: 44,
      expectedQualPoints: 10,
    }, // 1st place, started 1st, no DNF
    {
      finishingPosition: 1,
      startingPosition: 2,
      driverCount: 22,
      didDnf: false,
      expectedRacePoints: 44,
      expectedQualPoints: 10,
    }, // 1st place, started 2nd, no DNF
    {
      finishingPosition: 22,
      startingPosition: 1,
      driverCount: 22,
      didDnf: true,
      expectedRacePoints: 0,
      expectedQualPoints: 10,
    }, // 22nd place, started 1st, DNF
    {
      finishingPosition: 2,
      startingPosition: 2,
      driverCount: 22,
      didDnf: false,
      expectedRacePoints: 42,
      expectedQualPoints: 10,
    }, // 2nd place, started 2nd, no DNF
    {
      finishingPosition: 10,
      startingPosition: 3,
      driverCount: 22,
      didDnf: false,
      expectedRacePoints: 26,
      expectedQualPoints: 5,
    }, // 10th place, started 3rd, no DNF
    {
      finishingPosition: 15,
      startingPosition: 11,
      driverCount: 22,
      didDnf: false,
      expectedRacePoints: 16,
      expectedQualPoints: 0,
    }, // 15th place, started 11th, no DNF
    {
      finishingPosition: 20,
      startingPosition: 10,
      driverCount: 22,
      didDnf: false,
      expectedRacePoints: 6,
      expectedQualPoints: 5,
    }, // 20th place, started 10th, no DNF
    {
      finishingPosition: 1,
      startingPosition: 1,
      driverCount: 20,
      didDnf: false,
      expectedRacePoints: 40,
      expectedQualPoints: 10,
    }, // 1st place, started 1st, no DNF, 20 drivers
  ];

  it.each(testCases)(
    "should calculate fantasy points for (finished: P$finishingPosition, Qualified: P$startingPosition, Drivers: $driverCount, DNF: $didDnf) correctly",
    ({
      finishingPosition,
      startingPosition,
      driverCount,
      didDnf,
      expectedRacePoints,
      expectedQualPoints,
    }) => {
      const points = calculateFantasyPoints(
        finishingPosition,
        startingPosition,
        driverCount,
        didDnf,
      );
      expect(points.raceFantasyPoints).toBe(expectedRacePoints);
      expect(points.qualFantasyPoints).toBe(expectedQualPoints);
    },
  );
});

describe("generateFantasyScores", () => {
  it("does not mark a constructor as DNF when only its first driver DNFs", () => {
    const results = [
      {
        position: "20",
        grid: "1",
        status: "Retired",
        Driver: {
          driverId: "driver-one",
          givenName: "Driver",
          familyName: "One",
        },
        Constructor: { constructorId: "team-one", name: "Team One" },
      },
      {
        position: "1", // 4 (2) points
        grid: "2", // 10 (5)
        status: "Finished",
        Driver: {
          driverId: "driver-two",
          givenName: "Driver",
          familyName: "Two",
        },
        Constructor: { constructorId: "team-one", name: "Team One" },
      },
    ] as iJolpicaResult[];

    const scores = generateFantasyScores(results);
    const constructorScore = scores["team-one"] as iConstructorFantasyScore;

    expect(constructorScore.dnf).toBe(false);
    expect(constructorScore.raceFantasyPoints).toBe(2);
    expect(constructorScore.qualFantasyPoints).toBe(10);
    expect(constructorScore.totalFantasyPoints).toBe(12);
  });

  it("calculates 2 DNS's correctly", () => {
    const results = [
      {
        position: "21",
        grid: "21",
        status: "Did Not Start",
        Driver: {
          driverId: "driver-one",
          givenName: "Driver",
          familyName: "One",
        },
        Constructor: { constructorId: "team-one", name: "Team One" },
      },
      {
        position: "22",
        grid: "22",
        status: "Did Not Start",
        Driver: {
          driverId: "driver-two",
          givenName: "Driver",
          familyName: "Two",
        },
        Constructor: { constructorId: "team-one", name: "Team One" },
      },
    ] as iJolpicaResult[];

    const scores = generateFantasyScores(results);
    const constructorScore = scores["team-one"] as iConstructorFantasyScore;

    expect(constructorScore.dnf).toBe(true);
    expect(constructorScore.raceFantasyPoints).toBe(0);
    expect(constructorScore.qualFantasyPoints).toBe(0);
    expect(constructorScore.totalFantasyPoints).toBe(0);
  });
});
