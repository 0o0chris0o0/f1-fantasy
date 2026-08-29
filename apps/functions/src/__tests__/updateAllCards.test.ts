import { describe, expect, it } from "vitest";
import { CardType, iCardRarity } from "@f1pick6/shared/types";
import { calcAverage, mergeUpdatedCards } from "../updateAllCards";

describe("calcAverage", () => {
  it.each([
    // [currentAverage, newVal, noOfRaces, expected]
    { avg: 0, next: 10, count: 1, expected: 10 },
    { avg: 10, next: 10, count: 2, expected: 10 },
    { avg: 10, next: 20, count: 3, expected: 13 },
    { avg: 4, next: 1, count: 10, expected: 4 },
  ])(
    "calculates $expected when avg is $avg and next race is $next",
    ({ avg, next, count, expected }) => {
      expect(calcAverage(avg, next, count)).toBe(expected);
    },
  );
});

describe("mergeUpdatedCards", () => {
  it("retains cards that do not have updated score data", () => {
    const unchangedCard = {
      cardData: { cardId: "did-not-race" },
      inCollection: true,
      collectedOn: null,
      level: 1,
      quantity: 1,
      rarity: iCardRarity.COMMON,
      xp: 0,
    } as any;
    const updatedCardData = {
      cardId: "raced",
      cardName: "Raced Driver",
      enabled: true,
      teamId: "team",
      teamName: "Team",
      nationality: "",
      nationalityCode: "",
      homeRaces: [],
      type: CardType.DRIVER,
      stats: {
        currentFantasyPoints: 10,
        averageFantasyPoints: 10,
        averageQualifyingPosition: 1,
        averageRacePosition: 1,
        numberOfDNFs: 0,
      },
    };
    const racedCard = { ...unchangedCard, cardData: updatedCardData };

    const cards = mergeUpdatedCards([unchangedCard, racedCard], {
      raced: { ...updatedCardData, cardName: "Updated Driver" },
    });

    expect(cards).toHaveLength(2);
    expect(cards[0]).toBe(unchangedCard);
    expect(cards[1].cardData.cardName).toBe("Updated Driver");
  });
});
