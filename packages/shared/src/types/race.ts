import type { Timestamp } from "firebase/firestore";

export interface iRace {
  firstPractice: Timestamp;
  locationCountry: string;
  raceName: string;
  raceStart: Timestamp;
  round: number;
}