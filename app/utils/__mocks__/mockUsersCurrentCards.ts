import { iCardRarity, type iCardInUsersCards } from "../../types/card";

import { mockDriverCards } from "./mockDriverCards";

export const mockUsersCurrentCards: iCardInUsersCards[] = [
    {
        cardData: mockDriverCards[0]!,
        quantity: 1,
        rarity: iCardRarity.COMMON,
        level: 1,
        xp: 1
    },
]