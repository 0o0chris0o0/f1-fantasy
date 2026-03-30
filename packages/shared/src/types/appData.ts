import type { Timestamp } from "firebase/firestore";
import { iCardRarity, iConstructorCard, iDriverCard } from "./card";

export interface iRoundInfo {
  currentRound: number;
  nextRaceName: string;
  nextRaceStart: Timestamp;
  teamEditCutoff: Timestamp;
}

export interface iDailyDealCard {
  cardData: iDriverCard | iConstructorCard,
  rarity: iCardRarity
  price: number;
}

export type WeekDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export type WeeklySchedule = Record<WeekDay, iDailyDealCard[]>;