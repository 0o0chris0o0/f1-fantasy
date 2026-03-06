export interface iDriverFantasyScore {
  driverId: string;
  dnf: boolean;
  totalFantasyPoints: number;
  raceFantasyPoints: number;
  raceStartPosition: string;
  raceEndPosition: string;
  qualFantasyPoints: number;
}

export interface iConstructorFantasyScore {
  dnf: boolean; // This will be used to indicate if both drivers DNFed
  totalFantasyPoints: number;
  raceFantasyPoints: number;
  qualFantasyPoints: number;
  driverScores: iDriverFantasyScore[]
}

export enum FinishingStatus {
  FINISHED = 'Finished',
  RETIRED = 'Retired',
  UNKNOWN = 'Unknown',
}