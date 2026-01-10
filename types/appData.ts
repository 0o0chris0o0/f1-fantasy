import type { Timestamp } from "firebase/firestore";

export interface iRoundInfo {
  currentRound: number;
  raceName: string;
  raceStart: Timestamp;
  teamEditCutoff: Timestamp;
}