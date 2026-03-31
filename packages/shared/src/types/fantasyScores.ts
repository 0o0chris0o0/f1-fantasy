export interface iDriverFantasyScore {
  driverId: string;
  driverName: string;
  dnf: boolean;
  totalFantasyPoints: number;
  raceFantasyPoints: number;
  raceStartPosition: number;
  raceEndPosition: number;
  qualFantasyPoints: number
  finishingStatus: FinishingStatus
  constructor: string;
  constructorName: string;
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
  'DID NOT START' = 'Did Not Start',
  LAPPED = 'Lapped',
  DISQUALIFIED = 'Disqualified'
}