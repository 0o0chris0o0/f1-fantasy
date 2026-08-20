import { describe, expect, it } from "vitest";
import {
  CardType,
  iCardRarity,
  type iCardInUsersCards,
  type iCurrentTeam,
} from "@f1pick6/shared/types";
import { sortCardsForMyCards } from "../filteringSorting";

const emptyTeam: iCurrentTeam = {
  legendarySlot_a: null,
  legendarySlot_b: null,
  rareSlot_a: null,
  rareSlot_b: null,
  uncommonSlot_a: null,
  uncommonSlot_b: null,
};

const makeCard = (
  cardName: string,
  teamId: string,
  rarity: iCardRarity,
  level = 1,
): iCardInUsersCards =>
  ({
    cardData: {
      cardId: cardName.toLowerCase(),
      cardName,
      enabled: true,
      teamId,
      teamName: teamId,
      nationality: "",
      nationalityCode: "",
      homeRaces: [],
      type: CardType.DRIVER,
      stats: {
        currentFantasyPoints: 0,
        averageFantasyPoints: 0,
        averageQualifyingPosition: 0,
        averageRacePosition: 0,
        numberOfDNFs: 0,
      },
    },
    inCollection: true,
    collectedOn: null,
    level,
    quantity: 1,
    rarity,
    xp: 0,
  }) as iCardInUsersCards;

describe("sortCardsForMyCards", () => {
  it("sorts cards by current boost descending", () => {
    const commonCard = makeCard("Common", "team-a", iCardRarity.COMMON);
    const legendaryCard = makeCard(
      "Legendary",
      "team-b",
      iCardRarity.LEGENDARY,
    );

    const sortedCards = sortCardsForMyCards(
      [commonCard, legendaryCard],
      "",
      "ALL",
      "ALL",
      "scoreBoost:desc,name",
      { currentRound: 1, currentTeam: emptyTeam },
    );

    expect(sortedCards.map((card) => card.cardData.cardName)).toEqual([
      "Legendary",
      "Common",
    ]);
  });

  it("includes the current team match boost", () => {
    const driver = makeCard("Driver", "team-a", iCardRarity.COMMON);
    const constructor = makeCard("Constructor", "team-a", iCardRarity.COMMON);
    constructor.cardData.type = CardType.CONSTRUCTOR;

    const currentTeam = {
      ...emptyTeam,
      legendarySlot_a: constructor,
    };

    const sortedCards = sortCardsForMyCards(
      [driver, makeCard("Other", "team-b", iCardRarity.COMMON)],
      "",
      "ALL",
      "ALL",
      "scoreBoost:desc,name",
      { currentRound: 1, currentTeam },
    );

    expect(sortedCards[0]?.cardData.cardName).toBe("Driver");
  });
});
