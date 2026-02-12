import type { Timestamp } from "firebase/firestore";
import type { iCardInUsersCards, iCardInCollection, iCardRarity, iDriverCard, iConstructorCard } from "./card";
import type { iPackInUser } from './pack';

export interface iFBUser {
  cards: iCardInUsersCards[];
  cardsHistory: Record<string, iUserCardHistory>;
  cardsInCollection: number;
  collection: Record<string, iCardInCollection[]>;
  collectionCompletion: number;
  currentRank: number;
  currentScore: number;
  currentTeam: iCurrentTeam;
  displayName: string;
  latestResult: iResult | null;
  money: number;
  packs: Record<string, iPackInUser>;
  prevRank: number;
  progressInRewardTrack: number;
  results: iResult[];
  rewardLevel: number;
}

interface iCurrentTeam {
  rareLegendaryDriver: iDriverCard | null;
  rareLegendaryConstructor: iConstructorCard | null;
  uncommonDriver: iDriverCard | null;
  uncommonConstructor: iConstructorCard | null;
  commonDriver: iDriverCard | null;
  commonConstructor: iConstructorCard | null;
}

export interface iResult {
  cards: iCurrentTeamScores;
  raceName: string;
  raceStart: Timestamp,
  round: number;
  score: number;
}

interface iCurrentTeamScores {
  rareLegendaryDriver: iDriverScore;
  rareLegendaryConstructor: number;
  uncommonDriver: iDriverScore;
  uncommonConstructor: number;
  commonDriver: iDriverScore;
  commonConstructor: number;
}

export interface iDriverScore {
  cardId: string;
  cardName: string;
  cardRarity: iCardRarity;
  fantasyQualScore: number;
  fantasyRaceScore: number;
  fastestLap: boolean;
  realRacePosition: number;
  realStartingPosition: number;
  teamId: string;
  teamName: string;
  totalFantasyScore: number;
  wasDNF: boolean;
}

export interface iConstructorScore {
  cardId: string;
  cardName: string;
  cardRarity: iCardRarity;
  drivers: Record<string, iDriverScore>
  fantasyQualScore: number;
  fantasyRaceScore: number;
  totalFantasyScore: number;
}

export interface iUserCardHistory {
  xp: number;
  level: number;
}
