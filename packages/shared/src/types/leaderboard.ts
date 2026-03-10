export interface iLeaderBoard {
  [playerId: string]: iLeaderboardScore
}

export interface iLeaderboardScore {
  playerId: string;
  playerName: string;
  currentScore: number;
  currentRank: number;
  prevRank: number;
  qualifyingScore: number;
  modifierScore: number;
  raceScore: number;
}