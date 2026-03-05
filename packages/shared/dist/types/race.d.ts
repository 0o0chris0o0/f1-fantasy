import type { Timestamp } from "firebase/firestore";
export interface iRace {
    raceName: string;
    round: number;
    raceStart: Timestamp;
    locationCountry: string;
}
