import type { Timestamp } from "firebase/firestore";
import type { iCard, iCardInUsersCards, iCardInCollection, iCardRarity } from "./card";
import type { iPackInUser } from './pack';

export interface iFBUser {
  cards: iCardInUsersCards[];
  cardsInCollection: number;
  cardsObtained: string[];
  collection: iCardInCollection[];
  collectionCompletion: number;
  currentRank: number;
  currentScore: number;
  currentTeam: iCurrentTeam;
  displayName: string;
  latestResult: iResult | null;
  money: number;
  packs: iPackInUser[];
  packsSinceLastLegendary: number;
  prevRank: number;
  results: iResult[];
}

export interface iUserFromStore extends iFBUser {
  userId: string;
}

interface iCurrentTeam {
  rareLegendaryDriver: iCard | null;
  rareLegendaryConstructor: iCard | null;
  uncommonDriver: iCard | null;
  uncommonConstructor: iCard | null;
  commonDriver: iCard | null;
  commonConstructor: iCard | null;
}

export interface iResult {
  cards: iCurrentTeamScores;
  raceName: string;
  raceStart: Timestamp,
  round: number;
  score: number;
}

interface iCurrentTeamScores {
  rareLegendaryDriver: IDriverScore;
  rareLegendaryConstructor: number;
  uncommonDriver: IDriverScore;
  uncommonConstructor: number;
  commonDriver: IDriverScore;
  commonConstructor: number;
}

export interface IDriverScore {
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

export interface IConstructorScore {
  cardId: string;
  cardName: string;
  cardRarity: iCardRarity;
  drivers: Record<string, IDriverScore>
  fantasyQualScore: number;
  fantasyRaceScore: number;
  totalFantasyScore: number;
}

// export interface iUserFromStore extends iFBUser {
//   userId: string;
// }
