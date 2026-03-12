import type { Timestamp } from "firebase/firestore";
import type { iRace } from "./race.ts";


interface iCard {
  cardId: string;
  cardName: string;
  enabled: boolean;
  teamId: string;
  teamName: string;
  nationality: string;
  nationalityCode: string;
  homeRaces: iRace[];
  type: CardType;
}
export interface iDriverCard extends iCard {
  stats: iDriverStats;
}

export interface iConstructorCard extends iCard {
  stats: iConstructorStats;
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

export interface iConstructorStats {
  currentFantasyPoints: number;
  averageFantasyPoints: number
  numberOfDNFs: number;
}

export interface iDriverStats extends iConstructorStats {
  averageQualifyingPosition: number;
  averageRacePosition: number;
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