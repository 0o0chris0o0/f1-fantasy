import { iCardRarity, type iCardInUsersCards } from "../../../../../packages/shared/types/card";
import { mockDriverCards } from "./mockDriverCards.js";

export const mockUsersCurrentCards: iCardInUsersCards[] = [
  {
    cardData: mockDriverCards[0]!,
    inCollection: false,
    collectedOn: null,
    quantity: 1,
    rarity: iCardRarity.COMMON,
    level: 1,
    xp: 1
  },
]