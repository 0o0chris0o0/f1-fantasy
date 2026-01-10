import type { Timestamp } from "firebase/firestore";
import type { iCard, iCardInUsersCards, iCardInCollection , CardType } from "./card";
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
  packsSinceTier1: number;
  prevRank: number;
  results: iResult[];
  tyres: iTyres;
}

export interface iUserFromStore extends iFBUser {
  userId: string;
}

interface iCurrentTeam {
  driver: Record<string, iCard | null>;
  car: iCard | null;
  teamPrinciple: iCard | null;
}

export interface IDriverScore {
  cardId: string;
  cardName: string;
  cardTier?: 1 | 2 | 3;
  fantasyQualScore: number;
  fantasyRaceScore: number;
  fastestLap: boolean;
  position: number;
  startingPosition: number;
  teamId: string;
  teamName: string;
  totalFantasyScore: number;
  type: CardType;
  wasDNF: boolean;
}

export interface IConstructorScore {
  cardId: string;
  cardName: string;
  cardTier?: 1 | 2 | 3;
  drivers: Record<string, IDriverScore>
  fantasyQualScore: number;
  fantasyRaceScore: number;
  racePosition: number;
  qualificationPosition: number;
  type: CardType;
  wasDNF: boolean;
}

export interface ITeamPrincipleScore {
  cardId: string;
  cardName: string;
  cardTier?: 1 | 2 | 3;
  drivers: Record<string, IDriverScore>
  fantasyScore: number;
  qualificationPosition: number
  teamId: string;
  teamName: string;
  wasDNF: boolean;
}

export interface iResult {
  car: IConstructorScore;
  cardCompletionBonus: number;
  drivers: Record<number, IDriverScore>;
  raceName: string;
  raceStart: Timestamp,
  round: number;
  score: number;
  teamPrinciple: ITeamPrincipleScore;
}

export interface iTyres {
  hard: number;
  medium: number;
  soft: number;
}