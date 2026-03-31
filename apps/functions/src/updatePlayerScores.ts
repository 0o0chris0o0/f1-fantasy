import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { generatePlayerScores } from "./generatePlayerScores";
import { iCardInUsersCards, iConstructorFantasyScore, iCurrentTeam, iDriverFantasyScore, iLeaderBoard, iLeaderboardScore, iResult, iRoundInfo, iUserCardHistory } from "@f1pick6/shared/types";

export async function updatePlayerScores(fantasyScores: Record<string, iDriverFantasyScore | iConstructorFantasyScore>, roundData: iRoundInfo) {
  const firestore = getFirestore();
  const writeBatch = firestore.batch();

  const returnObj: Record<string, Omit<iLeaderboardScore, 'currentRank' | 'prevRank'>> = {};

  // get all players
  const playersSnap = await firestore.collection("players").get();
  
  // update each player's score based on the fantasy scores
  playersSnap.docs.forEach((player) => {
    // get the players team
    const playerTeam = player.get('currentTeam') as iCurrentTeam

    // generate the players score object
    const playerScores = generatePlayerScores(playerTeam, fantasyScores, roundData.currentRound);
    logger.info(`${player.get('displayName')}'s scores`, {
      baseScore: playerScores.baseFantasyScore,
      baseRaceScore: playerScores.baseRaceScore,
      baseQualifyingScore: playerScores.baseQualifyingScore,
      modifiedScore: playerScores.totalModifiedScore
    });

    const playersResultObj: iResult = {
      ...playerScores,
      raceName: roundData.nextRaceName,
      raceStart: roundData.nextRaceStart,
      round: roundData.currentRound,
    }

    const playersLeaderboardObj: Omit<iLeaderboardScore, 'currentRank' | 'prevRank'> = {
      playerId: player.id,
      playerName: player.get('displayName'),
      currentScore: playerScores.totalModifiedScore,
      qualifyingScore: playerScores.baseQualifyingScore,
      raceScore: playerScores.baseRaceScore,
      modifierScore: playerScores.totalModifiedScore - playerScores.baseFantasyScore
    }
    
    // get the players current cards
    const playersCurrentCards = player.get('cards') as iCardInUsersCards[];
    // get the players current card history object
    const playersCurrentCardHistory = player.get('cardsHistory') as Record<string, iUserCardHistory> 
    
    // get an array of card id's of the players team
    // const cardIds = 
    const playersTeam = Object.values(playerTeam).filter(Boolean)

    // for each card in the players team
    playersTeam.forEach((card: iCardInUsersCards) => {
      // check if we need to reduce the quantity or remove each card selected
      const indexOfCard = playersCurrentCards.findIndex((c: iCardInUsersCards) => c.cardData.cardId === card.cardData.cardId && c.rarity === card.rarity);
      const cardQuantity = playersCurrentCards[indexOfCard]?.quantity;

      if (cardQuantity > 1) {
        playersCurrentCards[indexOfCard].quantity -= 1;
      } else {
        playersCurrentCards.splice(indexOfCard, 1);
      }

      // update the players XP and levels
      // ensure to update every card with the same ID
      playersCurrentCards.forEach((c: iCardInUsersCards) => {
        if (c.cardData.cardId === card.cardData.cardId) {
          c.xp += 1;
          // only increase the level to a max of 4
          c.level += c.level === 4 ? 0 : 1;
        }
      });

      // update the players history object
      if (playersCurrentCardHistory[card.cardData.cardId]) {
        playersCurrentCardHistory[card.cardData.cardId].xp += 1;
        // only increase the level to a max of 4
        playersCurrentCardHistory[card.cardData.cardId].level += playersCurrentCardHistory[card.cardData.cardId].level === 4 ? 0 : 1
      } else {
        playersCurrentCardHistory[card.cardData.cardId] = {
          xp: 1,
          level: 2
        }
      }
    })

    // peform DB update
    writeBatch.update(player.ref, {
      cards: playersCurrentCards,
      cardsHistory: playersCurrentCardHistory,
      currentScore: FieldValue.increment(playerScores.totalModifiedScore),
      dailyDealCardsPurchased: [], // reset daily purchases
      money: FieldValue.increment(playerScores.totalModifiedScore),
      latestResult: playersResultObj,
      latestResultCleared: false,
      results: FieldValue.arrayUnion(playersResultObj),
      currentTeam: {
        commonConstructor: null,
        commonDriver: null,
        rareLegendaryConstructor: null,
        rareLegendaryDriver: null,
        uncommonConstructor: null,
        uncommonDriver: null,
      }
    })

    returnObj[player.id] = playersLeaderboardObj;
  })

  await writeBatch.commit();

  return returnObj;
};