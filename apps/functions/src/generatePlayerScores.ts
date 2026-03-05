import type { iCurrentTeam } from "@f1pick6/shared";
import type { iConstructorFantasyScore, iDriverFantasyScore } from "../types/fantasyScores";
import { logger } from "firebase-functions";
import calcCurrentModifierScore from "@f1pick6/shared/utils";

// interface iPlayerScore {
//   totalFantasy: number;
// }

export function generatePlayerScores(currentTeam: iCurrentTeam, fantasyScores: Record<string, iDriverFantasyScore | iConstructorFantasyScore>, round: number) {
  // const returnObj = {};
  const slotKeys = ['common', 'uncommon', 'rareLegendary'];

  slotKeys.forEach((slotKey) => {
    // get the driver
    const selectedSlotDriver = currentTeam[`${slotKey}Driver` as keyof iCurrentTeam];
    // get the constructor
    // const selectedSlotConstructor = currentTeam[`${slotKey}Constructor` as keyof iCurrentTeam];

    if (selectedSlotDriver?.cardData.cardId) {
      const selectedDriverScore = fantasyScores[selectedSlotDriver?.cardData.cardId] as iDriverFantasyScore;

      const driverModifierScores = calcCurrentModifierScore(selectedSlotDriver, round, currentTeam);


      logger.log(`Player's ${slotKey} driver fantasy score: ${selectedDriverScore.totalFantasyPoints}`);
      logger.log(`Player's ${slotKey} driver modifier score: ${driverModifierScores.totalScoreModifier}`);
    }

  })
};