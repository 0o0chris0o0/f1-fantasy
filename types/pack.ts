import type { iCard, CardType } from "./card";

export interface iPack {
  cardsIncluded: number;
  cost: number;
  packId: string;
  packName: string;
  hiddenFromStore: boolean;
  slots: Record<number, iSlot>
  isEmergencyPack: boolean;
  increaseTier1Chance: boolean;
  type: PackType;
}

export interface iSlot {
  forcedCardType: CardType | 'any';
  forcedLootType: LootType | 'any';
  hardTyreChance: number;
  lootCardChance: number;
  lootTokenChance: number;
  lootTyreChance: number;
  mediumTyreChance: number;
  newCardChance: number;
  softTyreChance: number;
  tier1Chance: number;
  tier2Chance: number;
  tier3Chance: number;
  variantChance: number;
}

export interface iPackInUser {
  packId: string;
  packName: string;
  quantity: number;
}

export interface iLoot {
  type: LootType;
  data: iCard | TyreType | number;
  isNew: boolean;
}

export enum PackType {
  CARDS = 'cards',
  TOKENS = 'tokens',
  TYRES = 'tyres',
  MULTI = 'multi'
}

export enum LootType {
  CARD = 'card',
  TOKEN = 'token',
  TYRE = 'tyre'
}

export enum TyreType {
  HARD = 'hard',
  MEDIUM = 'medium',
  SOFT = 'soft'
}