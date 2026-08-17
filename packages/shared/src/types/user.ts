import type { Timestamp } from "firebase/firestore";
import type { iCardInUsersCards, iCardInCollection } from "./card.ts";
import type { iPackInUser } from "./pack.ts";
import { FinishingStatus, iDriverFantasyScore } from "./fantasyScores.js";

export interface iFBUser {
  cards: iCardInUsersCards[];
  cardsHistory: Record<string, iUserCardHistory>;
  cardsInCollection: number;
  collection: Record<string, iCardInCollection>;
  collectionCompletion: number;
  currentScore: number;
  currentTeam: iCurrentTeam;
  dailyDealCardsPurchased: string[];
  displayName: string;
  latestResult: iResult | null;
  latestResultCleared: boolean;
  money: number;
  packs: Record<string, iPackInUser>;
  progressInRewardTrack: number;
  results: iResult[];
  rewardLevel: number;
  seenCards: string[];
}

export interface iCurrentTeam {
  legendarySlot_a: iCardInUsersCards | null;
  legendarySlot_b: iCardInUsersCards | null;
  rareSlot_a: iCardInUsersCards | null;
  rareSlot_b: iCardInUsersCards | null;
  uncommonSlot_a: iCardInUsersCards | null;
  uncommonSlot_b: iCardInUsersCards | null;
}

export interface iResult {
  baseFantasyScore: number;
  cards: iCurrentTeamScores;
  raceName: string;
  raceStart: Timestamp;
  round: number;
  totalModifiedScore: number;
  baseQualifyingScore: number;
  baseRaceScore: number;
}

export interface iCurrentTeamScores {
  legendarySlot_a: iCardScore;
  legendarySlot_b: iCardScore;
  rareSlot_a: iCardScore;
  rareSlot_b: iCardScore;
  uncommonSlot_a: iCardScore;
  uncommonSlot_b: iCardScore;
}

export interface iCardScore extends iCardInUsersCards {
  driverName?: string;
  baseFantasyScore: number;
  cardModifierValue: number;
  driverScores?: iDriverFantasyScore[];
  fantasyQualScore: number;
  fantasyRaceScore: number;
  finishingStatus?: FinishingStatus;
  modifiedFantasyScore: number;
  realRacePosition?: number;
  realStartingPosition?: number;
  wasDNF: boolean;
}

export interface iUserCardHistory {
  xp: number;
  level: number;
}

// export type SlotKeys = 'common' | 'uncommon' | 'rareLegendary';

// interface iPlayerBaseScores {
//   baseScore: number;
//   totalFantasy: number;
//   totalRaceScore: number;
//   totalQualifyingScore: number;
// }

// export interface iPlayerCardScore {
//   driverBaseScore: number;
//   driverModifiedScore: number;
//   driverModifierValue: number;
//   constructorBaseScore: number;
//   constructorModifiedScore: number;
//   constructorModifierValue: number;
// }

// export type iPlayerScore = iPlayerBaseScores & Record<SlotKeys, iPlayerCardScore>
