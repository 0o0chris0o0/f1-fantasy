import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { generatePlayerScores } from "./generatePlayerScores";
import { iCardInUsersCards, iConstructorFantasyScore, iCurrentTeam, iDriverFantasyScore, iUserCardHistory } from "@f1pick6/shared/types";

export async function updatePlayerScores(fantasyScores: Record<string, iDriverFantasyScore | iConstructorFantasyScore>, round: number) {
  const firestore = getFirestore();
  const writeBatch = firestore.batch();

  // get all players
  const playersSnap = await firestore.collection("players").get();
  
  // update each player's score based on the fantasy scores
  playersSnap.docs.forEach((player) => {
    // get the players team
    const playerTeam = player.get('currentTeam') as iCurrentTeam

    // generate the players score object
    const playerScores = generatePlayerScores(playerTeam, fantasyScores, round);
    logger.info(`${player.get('displayName')}'s scores`, playerScores);

    
    // get the players current cards
    const playersCurrentCards = player.get('cards') as iCardInUsersCards[];
    // get the players current card history object
    const playersCurrentCardHistory = player.get('cardsHistory') as Record<string, iUserCardHistory> 
    
    // get an array of card id's of the players team
    const cardIds = Object.values(playerTeam).map((card: iCardInUsersCards) => card.cardData.cardId)

    // for each card in the players team
    cardIds.forEach(cardId => {
      // check if we need to reduce the quantity or remove each card selected
      const indexOfCard = playersCurrentCards.findIndex((c: iCardInUsersCards) => c.cardData.cardId === cardId);
      const cardQuantity = playersCurrentCards[indexOfCard].quantity
      if (cardQuantity > 1) {
        playersCurrentCards[indexOfCard].quantity -= 1;
      } else {
        playersCurrentCards.splice(indexOfCard, 1);
      }

      // update the players history object
      if (playersCurrentCardHistory[cardId]) {
        playersCurrentCardHistory[cardId].xp += 1;
        // only increase the level to a max of 4
        playersCurrentCardHistory[cardId].level += playersCurrentCardHistory[cardId].level === 4 ? 0 : 1
      } else {
        playersCurrentCardHistory[cardId] = {
          xp: 1,
          level: 2
        }
      }
    })

    // peform DB update
    writeBatch.update(player.ref, {
      cards: playersCurrentCards,
      cardsHistory: playersCurrentCardHistory,
      currentScore: FieldValue.increment(playerScores.totalFantasy),
      currentTeam: {
        commonConstructor: null,
        commonDriver: null,
        rareLegendaryConstructor: null,
        rareLegendaryDriver: null,
        uncommonConstructor: null,
        uncommonDriver: null,
      }
    })

  })

  await writeBatch.commit();
};