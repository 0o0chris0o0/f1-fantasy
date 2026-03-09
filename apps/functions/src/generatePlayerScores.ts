import { calcCurrentModifierScore, CardType, iCardInUsersCards, iConstructorFantasyScore, iDriverFantasyScore, type iCurrentTeam } from "@f1pick6/shared";
import { logger } from "firebase-functions";

type SlotKeys = 'common' | 'uncommon' | 'rareLegendary';

interface iPlayerBaseScores {
  baseScore: number;
  totalFantasy: number;
}

interface iPlayerCardScore {
  driverBaseScore: number;
  driverModifiedScore: number;
  driverModifierValue: number;
  constructorBaseScore: number;
  constructorModifiedScore: number;
  constructorModifierValue: number;
}

type iPlayerScore = iPlayerBaseScores & Record<SlotKeys, iPlayerCardScore>

export function generatePlayerScores(currentTeam: iCurrentTeam, fantasyScores: Record<string, iDriverFantasyScore | iConstructorFantasyScore>, round: number) {
  let returnObj: iPlayerScore = {
    baseScore: 0,
    totalFantasy: 0,
    common: {} as iPlayerCardScore,
    uncommon: {} as iPlayerCardScore,
    rareLegendary: {} as iPlayerCardScore
  };
  
  const slotKeys = ['common', 'uncommon', 'rareLegendary'];

  // for each rarity slot
  slotKeys.forEach((slotKey) => {
    // get the driver
    const selectedSlotDriver = currentTeam[`${slotKey}Driver` as keyof iCurrentTeam];
    // get the constructor
    const selectedSlotConstructor = currentTeam[`${slotKey}Constructor` as keyof iCurrentTeam];

    [selectedSlotDriver, selectedSlotConstructor].forEach((card) => {
      // add slot driver
      if (card) {
        const selectedCardScore = fantasyScores[card?.cardData.cardId] as iDriverFantasyScore;
        const cardModifierValues = calcCurrentModifierScore(card, round, currentTeam);
        const cardModifier = 1 + cardModifierValues.totalScoreModifier;

        // does the driver have a score
        if (selectedCardScore) {
          const cardBaseScore = selectedCardScore.totalFantasyPoints;
          const cardModifiedScore = Math.round(selectedCardScore.totalFantasyPoints * cardModifier)

          returnObj.baseScore += cardBaseScore;
          returnObj.totalFantasy += cardModifiedScore;

          if (card.cardData.type === CardType.DRIVER) {
            returnObj[slotKey as SlotKeys].driverBaseScore = cardBaseScore;
            returnObj[slotKey as SlotKeys].driverModifiedScore = cardModifiedScore;
            returnObj[slotKey as SlotKeys].driverModifierValue = cardModifier;
          } else {
            returnObj[slotKey as SlotKeys].constructorBaseScore = cardBaseScore;
            returnObj[slotKey as SlotKeys].constructorModifiedScore = cardModifiedScore;
            returnObj[slotKey as SlotKeys].constructorModifierValue = cardModifier;
          }
          // returnObj.drivers.push(selectedSlotDriver)
        } else {
          logger.warn(`Player's ${slotKey} card, ${card.cardData.cardName}, didn't have a score`)
          if (card.cardData.type === CardType.DRIVER) {
            returnObj[slotKey as SlotKeys].driverBaseScore = 0;
            returnObj[slotKey as SlotKeys].driverModifiedScore = 0;
            returnObj[slotKey as SlotKeys].driverModifierValue = cardModifier;
          } else {
            returnObj[slotKey as SlotKeys].constructorBaseScore = 0;
            returnObj[slotKey as SlotKeys].constructorModifiedScore = 0;
            returnObj[slotKey as SlotKeys].constructorModifierValue = cardModifier;
          }
        }
      }
    })

  })

  return returnObj;
};