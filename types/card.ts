import type { Timestamp } from "firebase/firestore";

export interface iCard {
  cardId: string;
  cardName: string;
  currentPoints: number;
  currentRank: number;
  previousRank: number;
  previousTier: 1 | 2 | 3;
  currentTier: 1 | 2 | 3;
  enabled: boolean;
  teamId: string;
  teamName: string;
  type: CardType;
  variant: false | string;
  stats: iCardStats;
}

export interface iCardInUsersCards {
  cardId: string;
  quantity: number;
  tyres: number;
}

export interface iCardWithQuantity extends iCard {
  quantity: number;
  tyres: number;
}

export interface iCardWithIsNew extends iCard {
  isNew: boolean;
}

export interface iCardWithCollected extends iCardWithQuantity {
  collectedOn: false | Timestamp;
}

export interface iCardInCollection {
  cardId: string;
  collectedOn: false | Timestamp;
}

export enum CardType {
  DRIVER = 'driver',
  CAR = 'car',
  TEAMPRINCIPLE = 'teamPrinciple'
}

export interface iCardStats {
  averagePointsPerRace: number;
  bestQualifyingPosition: number;
  bestRacePosition: number;
  numberOfDNFs: number;
  qualificationPoints: number;
  racePoints: number;
  rankAmoungPiers: string
}
export interface iCollectionGroup {
  teamId: string;
  teamName: string;
  car: iCardWithCollected;
  teamPrinciple: iCardWithCollected[];
  drivers: iCardWithCollected[];
  cardsCollected: number;
  totalCards: number;
}