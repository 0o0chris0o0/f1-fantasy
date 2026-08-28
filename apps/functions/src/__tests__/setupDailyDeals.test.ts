import { describe, expect, it } from "vitest";
import { createDailyDealSchedule, setPrice } from "../setupDailyDeals";
import { CardType, iCardRarity } from "@f1pick6/shared/types";

function createCard(cardId: string, averageFantasyPoints: number) {
  return {
    cardId,
    cardName: cardId,
    enabled: true,
    teamId: "team",
    teamName: "Team",
    nationality: "",
    nationalityCode: "",
    homeRaces: [],
    type: CardType.DRIVER,
    stats: {
      currentFantasyPoints: averageFantasyPoints,
      averageFantasyPoints,
      averageQualifyingPosition: 1,
      averageRacePosition: 1,
      numberOfDNFs: 0,
    },
  } as any;
}

describe("createDailyDealSchedule", () => {
  it("does not add undefined deals when fewer than 25 cards are available", () => {
    const schedule = createDailyDealSchedule(
      [createCard("one", 10), createCard("two", 10)],
      () => 0,
    );

    const deals = Object.values(schedule).flat();

    expect(deals).toHaveLength(2);
    expect(deals.every(Boolean)).toBe(true);
  });

  it("assigns five deals to each weekday when 25 cards are available", () => {
    const schedule = createDailyDealSchedule(
      Array.from({ length: 25 }, (_, index) => createCard(`${index}`, 10)),
      () => 0,
    );

    expect(Object.values(schedule).every((deals) => deals.length === 5)).toBe(
      true,
    );
  });
});

describe("setPrice", () => {
  it("never returns a free or negative price", () => {
    expect(setPrice(iCardRarity.COMMON, 0)).toBe(5);
    expect(setPrice(iCardRarity.LEGENDARY, -10)).toBe(5);
  });

  it("rounds higher prices down to the nearest five", () => {
    expect(setPrice(iCardRarity.COMMON, 10)).toBe(15);
  });
});
