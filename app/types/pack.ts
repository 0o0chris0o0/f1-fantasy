import type { iCard, CardType, iCardRarity } from "./card";

export interface iPack {
  cardsIncluded: number;
  cost: number;
  packId: string;
  packName: string;
  hiddenFromStore: boolean;
  slots: Record<number, iSlot>
  isEmergencyPack: boolean;
}

export interface iSlot {
  forcedRarity: iCardRarity | null;
  rarityChances: Record<iCardRarity, number>;
}

export interface iPackInUser {
  packId: string;
  packName: string;
  quantity: number;
}