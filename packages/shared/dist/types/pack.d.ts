import type { iCardRarity } from "./card.ts";
export interface iPack {
    cardsIncluded: number;
    cost: number;
    hiddenFromStore: boolean;
    isEmergencyPack: boolean;
    packId: string;
    packName: string;
    slots: Record<number, iSlot>;
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
