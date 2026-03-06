import { calcCurrentModifierScore, iConstructorFantasyScore, iDriverFantasyScore, type iCurrentTeam } from "@f1pick6/shared";
import { logger } from "firebase-functions";

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
    const selectedSlotConstructor = currentTeam[`${slotKey}Constructor` as keyof iCurrentTeam];

    logger.log(`Player's ${slotKey} driver is ${selectedSlotDriver?.cardData.cardName}`);

    [selectedSlotDriver, selectedSlotConstructor].forEach(card => {
      if (card?.cardData.cardId) {
        const selectedDriverScore = fantasyScores[card?.cardData.cardId] as iDriverFantasyScore;

        // does the driver have a score
        if (selectedDriverScore) {
          const driverModifierScores = calcCurrentModifierScore(card, round, currentTeam);

          logger.log(`Player's ${slotKey} card scores`);
          logger.log(selectedDriverScore)
          logger.log(`Player's ${slotKey} card modifier scores`);
          logger.log(driverModifierScores);
        } else {
          logger.warn(`Player's ${slotKey} card, ${card.cardData.cardName}, didn't have a score`)
        }
      }
    })

    
  })
};