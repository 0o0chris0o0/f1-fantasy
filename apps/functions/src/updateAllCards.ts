import { CardType, iCardInUsersCards, iConstructorCard, iConstructorFantasyScore, iDriverCard, iDriverFantasyScore, iDriverStats } from "@f1pick6/shared/types";
import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { arrayAggDistinct } from "firebase/firestore/pipelines";

export async function updateAllCards(fantasyScores: Record<string, iDriverFantasyScore | iConstructorFantasyScore>, round: number) {
  const firestore = getFirestore();
  const writeBatch = firestore.batch();

  let updatedCards: Record<string, iDriverCard | iConstructorCard> = {};

  // get all cards
  const cardsRef = await firestore.collection('cards').get();

  // split cards into drivers and constructors
  let driverCards: iDriverCard[] = [];
  let constructorCards: iConstructorCard[] = [];
  cardsRef.docs.forEach((doc) => {
    const cardType = doc.get('type');
    if (cardType === CardType.DRIVER) {
      const cardData = doc.data() as iDriverCard;
      driverCards.push(cardData);
    } else if (cardType === CardType.CONSTRUCTOR) {
      const cardData = doc.data() as iConstructorCard;
      constructorCards.push(cardData)
    }
  })
  
  // update all driver cards in cards DB object
  driverCards.forEach((card: iDriverCard) => {
    let cardScores = fantasyScores[card.cardId] as iDriverFantasyScore;

    if (cardScores) {
      // add current fantasy points total
      card.stats.currentFantasyPoints += cardScores.totalFantasyPoints

      // calc new average fantasy points
      card.stats.averageFantasyPoints = calcAverage(
        card.stats.averageFantasyPoints, 
        cardScores.totalFantasyPoints, 
      round
      )

      // add DNF's
      if (cardScores.dnf) {
        card.stats.numberOfDNFs += 1;
      }

      // calculate average qualifying position
      card.stats.averageQualifyingPosition = calcAverage(
        (card.stats as iDriverStats).averageQualifyingPosition, 
        (cardScores as iDriverFantasyScore).raceStartPosition, 
        round
      );

      // calculate average race position
      card.stats.averageRacePosition = calcAverage(
        (card.stats as iDriverStats).averageRacePosition, 
        (cardScores as iDriverFantasyScore).raceEndPosition, 
        round
      )

      const cardRef = firestore.doc(`cards/${card.cardId}`)
      writeBatch.update(cardRef, { stats: card.stats });

      // check if the driver just raced for a different team
      if (cardScores.constructor !== card.teamId) {
        logger.info(`${card.cardName} has a new team, moving to ${cardScores.constructorName}`)
        card.teamId = cardScores.constructor;
        card.teamName = cardScores.constructorName;
      }

      // add updated cards into local memory for updating player cards
      updatedCards[card.cardId] = card;
      
    } else {
      logger.warn(`Couldn't get a fantasy score for card ID: ${card.cardId}`)
    }
  })

  constructorCards.forEach((card: iConstructorCard) => {
    let cardScores = fantasyScores[card.cardId] as iConstructorFantasyScore;

    if (cardScores) {
      // add current fantasy points total
      card.stats.currentFantasyPoints += cardScores.totalFantasyPoints

      // calc new average fantasy points
      card.stats.averageFantasyPoints = calcAverage(
        card.stats.averageFantasyPoints, 
        cardScores.totalFantasyPoints, 
      round
      )

      // add DNF's
      if (cardScores.dnf) {
        card.stats.numberOfDNFs += 1;
      }

      // update drivers
      const constructorDrivers = Object.values(updatedCards).filter(card => card.type === CardType.DRIVER && card.teamId === card.cardId);

      const cardRef = firestore.doc(`cards/${card.cardId}`)
      writeBatch.update(cardRef, { stats: card.stats, drivers: constructorDrivers });

      // add updated cards into local memory for updating player cards
      updatedCards[card.cardId] = card;
      
    } else {
      logger.warn(`Couldn't get a fantasy score for card ID: ${card.cardId}`)
    }
  })

  // get all players
  const playersRef = await firestore.collection('players').get();

  // update the cards in each players DB object
  playersRef.docs.forEach((doc) => {
    const playersCards: iCardInUsersCards[] = doc.get('cards');
    const newPlayersCard: iCardInUsersCards[] = [];

    playersCards.forEach((card) => {
      const newCardData = updatedCards[card.cardData.cardId];

      // we won't have card data if the driver didn't race
      if (newCardData) {
        newPlayersCard.push({ ...card, cardData: newCardData });
      }
    })

    writeBatch.update(doc.ref, { cards: newPlayersCard })
  })

  await writeBatch.commit();
}

export function calcAverage(currentAverage: number, newVal: number, noOfRaces: number) {
  // 1. Calculate the sum of all previous positions
  const previousSum = currentAverage * (noOfRaces - 1);
    
  // 2. Add the new position to the sum (Use previousSum here!)
  const newSum = previousSum + newVal;
    
  // 3. Divide by the new total number of races
  const newAverage = newSum / noOfRaces;
    
  return Math.round(newAverage);
}