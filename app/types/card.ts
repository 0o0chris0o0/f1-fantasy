import type { Timestamp } from "firebase/firestore";

export interface iCard {
  cardId: string;
  cardName: string;
  enabled: boolean;
  teamId: string;
  teamName: string;
  type: CardType;
  stats: iCardStats;
}

export enum CardType {
  DRIVER = 'driver',
  CONSTRUCTOR = 'constructor',
}

export interface iCardStats {
  averageQualifyingPosition: number;
  averageRacePosition: number;
  numberOfDNFs: number;
}

export interface iCardInUsersCards {
  cardId: string;
  rarity: iCardRarity
  quantity: number;
}

export enum iCardRarity {
  COMMON,
  UNCOMMON,
  RARE,
  LEGENDARY
}

export interface iCardInCollection {
  cardId: string;
  collectedOn: false | Timestamp;
}

// export interface iCardWithQuantity extends iCard {
//   quantity: number;
//   tyres: number;
// }

// export interface iCardWithIsNew extends iCard {
//   isNew: boolean;
// }

// export interface iCardWithCollected extends iCardWithQuantity {
//   collectedOn: false | Timestamp;
// }

// export interface iCollectionGroup {
//   teamId: string;
//   teamName: string;
//   car: iCardWithCollected;
//   teamPrinciple: iCardWithCollected[];
//   drivers: iCardWithCollected[];
//   cardsCollected: number;
//   totalCards: number;
// }