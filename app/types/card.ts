import type { Timestamp } from "firebase/firestore";
import type { iRace } from "./race";

export interface iDriverCard {
  cardId: string;
  cardName: string;
  enabled: boolean;
  teamId: string;
  teamName: string;
  nationality: string;
  nationalityCode: string;
  homeRaces: iRace[];
  type: CardType;
  stats: iDriverCardStats;
}

export interface iConstructorCard extends iDriverCard {
  drivers: iDriverCard[]
}

export type iDriverCollectionCard = iDriverCard & { 
  rarity: iCardRarity; 
  quantity: number;
  userHasInCollection: boolean;
}
export type iConstructorCollectionCard = iConstructorCard & { 
  rarity: iCardRarity;
  quantity: number;
  userHasInCollection: boolean;
}

export enum CardType {
  DRIVER = 'driver',
  CONSTRUCTOR = 'constructor',
}

export interface iDriverCardStats {
  currentFantasyPoints: number;
  averageQualifyingPosition: number;
  averageRacePosition: number;
  numberOfDNFs: number;
}

export interface iCardInUsersCards {
  cardData: iDriverCard | iConstructorCard
  inCollection: boolean;
  collectedOn: Timestamp | null;
  level: number;
  quantity: number;
  rarity: iCardRarity;
  xp: number;
}

export enum iCardRarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  LEGENDARY = 'LEGENDARY',
  MYTHIC = 'MYTHIC',
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