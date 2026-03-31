import { CardType, iCardInUsersCards, iConstructorCard, iConstructorFantasyScore, iDriverCard, iDriverFantasyScore, iDriverStats, iRace } from "@f1pick6/shared/types";
import axios from "axios";
import nationalities from 'i18n-nationality';
import enLocale from 'i18n-nationality/langs/en.json';
import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";

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

  // clone the fantasyScores object which we'll use to see if there's any new drivers
  const clonedDriverScores = { ...fantasyScores };
  // remove all constructor scores
  Object.keys(clonedDriverScores).forEach((key) => {
    if (!(clonedDriverScores[key] as iDriverFantasyScore).driverId) {
      delete clonedDriverScores[key];
    }
  });

  // update all driver cards in cards DB object
  driverCards.forEach((card: iDriverCard) => {
    let cardScores = fantasyScores[card.cardId] as iDriverFantasyScore;

    if (cardScores) {
      // remove the score from the cloned obj so we can check for any new drivers at the end
      delete clonedDriverScores[card.cardId];

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

  if (Object.keys(clonedDriverScores).length > 0) {
    logger.info('There are new drivers that we dont have cards for, creating new cards for them...');
    logger.log(clonedDriverScores);

    for (const cardId in clonedDriverScores) {
      const cardScores = clonedDriverScores[cardId] as iDriverFantasyScore;

      // get new drivers nationality
      const driverResponse = await axios(`https://api.jolpi.ca/ergast/f1/drivers/${cardId}/`);
      const driverData = driverResponse.data.MRData.DriverTable.Drivers[0];
      let driverLocaleCode, driverCountry = '';
      let homeRaces: iRace[] = [];

      if (driverData) {
        nationalities.registerLocale(enLocale);
        driverLocaleCode = nationalities.getAlpha2Code(driverData.nationality, 'en');

        if (!driverLocaleCode) {
          // manual fixes
          // colapinto
          if (driverData.nationality === 'Argentine') driverLocaleCode = 'AR';
          // leclerc
          if (driverData.nationality === 'Monegasque') driverLocaleCode = 'MC';
        }

        if (driverLocaleCode) {
          const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
          driverCountry = regionNames.of(driverLocaleCode) || '';
        }
      }

      if (driverLocaleCode && driverCountry) {
        logger.info(`Nationality info found for ${cardScores.driverName}: ${driverLocaleCode}: ${driverCountry}`);
        logger.info('Getting schedule data to find home races...');
        const scheduleRef = await firestore.collection('schedule').get();
        const scheduleData = scheduleRef.docs.map((d) => d.data() as iRace);
        homeRaces = scheduleData.filter((race) => race.locationCountry === driverCountry?.toLowerCase());
      } else {
        logger.warn(`Couldn't find nationality info for ${cardScores.driverName}, setting to empty string`);
      }

      const newCard: iDriverCard = {
        cardId,
        cardName: cardScores.driverName,
        enabled: true,
        teamId: cardScores.constructor,
        teamName: cardScores.constructorName,
        nationality: driverCountry,
        nationalityCode: driverLocaleCode || '',
        homeRaces,
        type: CardType.DRIVER,
        stats: {
          currentFantasyPoints: cardScores.totalFantasyPoints,
          averageFantasyPoints: cardScores.totalFantasyPoints,
          numberOfDNFs: cardScores.dnf ? 1 : 0,
          averageQualifyingPosition: cardScores.raceStartPosition,
          averageRacePosition: cardScores.raceEndPosition
        }
      }

      logger.info(`Creating new card for ${cardScores.driverName} with ID ${cardId}`);

      const newCardRef = firestore.collection('cards').doc(cardId);
      writeBatch.set(newCardRef, newCard);
      driverCards.push(newCard);
    }
  }

  // update all constructor cards in cards DB object
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

  return [...driverCards, ...constructorCards];
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