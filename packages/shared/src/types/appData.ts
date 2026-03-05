import type { Timestamp } from "firebase/firestore";

export interface iRoundInfo {
  currentRound: number;
  nextRaceName: string;
  nextRaceStart: Timestamp;
  teamEditCutoff: Timestamp;
}