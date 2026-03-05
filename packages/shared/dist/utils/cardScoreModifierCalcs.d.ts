import type { iCurrentTeam, iCardInUsersCards } from "../types";
export interface iCardScoreModifier {
    totalScoreModifier: number;
    rarityModifier: number;
    levelModifier: number;
    homeRaceModifier: number;
    teamMatchModifier: number;
}
export declare const calcCurrentModifierScore: (card: iCardInUsersCards, currentRound: number, currentTeam: iCurrentTeam) => iCardScoreModifier;
