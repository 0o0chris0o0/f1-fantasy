import { calcCurrentModifierScore, CardType, iConstructorFantasyScore, iCurrentTeamScores, iDriverFantasyScore, iResult, type iCurrentTeam } from "@f1pick6/shared";
import { logger } from "firebase-functions";

export function generatePlayerScores(currentTeam: iCurrentTeam, fantasyScores: Record<string, iDriverFantasyScore | iConstructorFantasyScore>, round: number) {
  let returnObj: Omit<iResult, 'raceName' | 'raceStart' | 'round'> = {
    baseFantasyScore: 0,
    cards: {} as iCurrentTeamScores,
    baseQualifyingScore: 0,
    baseRaceScore: 0,
    totalModifiedScore: 0
  };

  for (const key in currentTeam) {
    if (!Object.hasOwn(currentTeam, key)) continue;
    
    const card = currentTeam[key as keyof iCurrentTeam];
    if (card) {
      const selectedCardScore = fantasyScores[card?.cardData.cardId];
      const cardModifierValues = calcCurrentModifierScore(card, round, currentTeam);
      const cardModifier = 1 + cardModifierValues.totalScoreModifier;

      // does the driver have a score
      if (selectedCardScore) {
        const cardBaseScore = selectedCardScore.totalFantasyPoints;
        const cardModifiedScore = Math.round(selectedCardScore.totalFantasyPoints * cardModifier)

        returnObj.cards[key as keyof iCurrentTeamScores] = {
          ...card,
          cardModifierValue: cardModifier,
          fantasyQualScore: selectedCardScore.qualFantasyPoints,
          fantasyRaceScore: selectedCardScore.raceFantasyPoints,
          modifiedFantasyScore: cardModifiedScore,
          baseFantasyScore: cardBaseScore,
          wasDNF: selectedCardScore.dnf
        }

        if (card.cardData.type === CardType.CONSTRUCTOR) {
          const constructorScore = selectedCardScore as iConstructorFantasyScore;
          returnObj.cards[key as keyof iCurrentTeamScores].driverScores = constructorScore.driverScores
        } else {
          const driverScore = selectedCardScore as iDriverFantasyScore;
          returnObj.cards[key as keyof iCurrentTeamScores].realRacePosition = driverScore.raceEndPosition;
          returnObj.cards[key as keyof iCurrentTeamScores].realStartingPosition = driverScore.raceStartPosition;
        }

        // add to total values
        returnObj.baseQualifyingScore += selectedCardScore.qualFantasyPoints;
        returnObj.baseRaceScore += selectedCardScore.raceFantasyPoints;
        returnObj.baseFantasyScore += cardBaseScore;
        returnObj.totalModifiedScore += cardModifiedScore;
      } else {
        logger.warn(`Player's ${key} card, ${card.cardData.cardName}, didn't have a score`)
        returnObj.cards[key as keyof iCurrentTeamScores] = {
          ...card,
          cardModifierValue: cardModifier,
          fantasyQualScore: 0,
          fantasyRaceScore: 0,
          modifiedFantasyScore: 0,
          baseFantasyScore: 0,
          wasDNF: false
        }

        if (card.cardData.type === CardType.CONSTRUCTOR) {
          returnObj.cards[key as keyof iCurrentTeamScores].driverScores = [];
        } else {
          returnObj.cards[key as keyof iCurrentTeamScores].realRacePosition = '';
          returnObj.cards[key as keyof iCurrentTeamScores].realStartingPosition = '';
        }
      }
    }
  }

  return returnObj;
};