import { doc, Firestore, writeBatch } from "firebase/firestore";
import { CardType, iCardRarity, type iCard } from "~/types/card";
import type { DriverStanding, JolpicaDriverStandingsResponse } from "~/types/jolpica/driverStandings";

const currentYear = 2026;

export const addAllCards = async (db: Firestore) => {
  const batch = writeBatch(db);

  // get all drivers standings from the previous year
  const driverResponse = await fetch(
    `https://api.jolpi.ca/ergast/f1/${currentYear - 1}/driverStandings.json`
  );
  const driverData: JolpicaDriverStandingsResponse = await driverResponse.json();
  const driverStandings =
  driverData.MRData.StandingsTable?.StandingsLists[0]?.DriverStandings;

  if (!driverStandings) return;

  const formattedDrivers: iCard[] = [];

  // build drivers cards data
  driverStandings.forEach((driver: DriverStanding) => {
    const newObj: iCard = {
      cardId: driver.Driver.driverId,
      cardName: `${driver.Driver.givenName} ${driver.Driver.familyName}`,
      enabled: true,
      teamId: driver.Constructors[0]?.constructorId || '',
      teamName: driver.Constructors[0]?.name || '',
      type: CardType.DRIVER,
      stats: {
        averageQualifyingPosition: 0,
        averageRacePosition: 0,
        numberOfDNFs: 0,
      },
    };

    formattedDrivers.push(newObj);
  });

  debugger;

  // add cards to DB
  formattedDrivers.forEach((card) => {
    const newRef = doc(db, "cards", card.cardId);
    batch.set(newRef, card);
  });

  // // get all constructors
  // const prevConstructorResponse = await fetch(
  //   `https://api.jolpi.ca/ergast/f1/${currentYear - 1}/constructorStandings.json`
  // );
  // const prevConstructorData = await prevConstructorResponse.json();
  // const prevConstructorStandings =
  // prevConstructorData.MRData.StandingsTable.StandingsLists[0]
  //     .ConstructorStandings;
  // const prevConstructorPositions: Record<string, string> = {};
  //   prevConstructorStandings.forEach((data: any) => {
  //     prevConstructorPositions[data.Constructor.constructorId] = data.position;
  // });

  // const currentConstructorResponse = await fetch(
  //   `https://api.jolpi.ca/ergast/f1/${currentYear}/constructorStandings.json`
  // );
  // const currentConstructorData = await currentConstructorResponse.json();
  // let currentConstructorStandings = []

  // if (currentConstructorData.MRData.StandingsTable.StandingsLists.length) {
  //   currentConstructorStandings = currentConstructorData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings
  // } else {
  //   currentConstructorStandings = prevDriverStandings;
  // }

  // const formattedConstructors: iCard[] = [];

  // // build car cards data
  // currentConstructorStandings.forEach((constructor: any) => {
  //   const constructorRank = parseFloat(prevConstructorPositions[constructor.Constructor.constructorId]) || currentConstructorStandings.length;

  //   const newObj: iCard = {
  //     cardId: constructor.Constructor.constructorId,
  //     cardName: constructor.Constructor.name,
  //     currentPoints: 0,
  //     currentRank: constructorRank,
  //     previousRank: constructorRank,
  //     previousTier: getConstructorTier(constructorRank),
  //     currentTier: getConstructorTier(constructorRank),
  //     enabled: true,
  //     teamId: constructor.Constructor.constructorId,
  //     teamName: constructor.Constructor.name,
  //     type: CardType.CAR,
  //     variant: false,
  //     stats: {
  //       racePoints: 0,
  //       qualificationPoints: 0,
  //       bestRacePosition: 11,
  //       bestQualifyingPosition: 11,
  //       averagePointsPerRace: 0,
  //       rankAmoungPiers: `${constructorRank}/${currentConstructorStandings.length}`,
  //       numberOfDNFs: 0,
  //     },
  //   };
  //   formattedConstructors.push(newObj);
  // });

  // formattedConstructors.forEach((card) => {
  //   const newRef = doc(db, "cards", card.cardId);
  //   batch.set(newRef, card);
  // });

  // // build Team Principle cards data
  // tpData.forEach((card) => {
  //   const constructorRank = parseFloat(prevConstructorPositions[card.teamId]) || currentConstructorStandings.length;

  //   const newRef = doc(db, "cards", card.cardId);

  //   batch.set(newRef, {
  //     ...card,
  //     currentRank: constructorRank,
  //     previousRank: constructorRank,
  //     previousTier: getConstructorTier(constructorRank),
  //     currentTier: getConstructorTier(constructorRank),
  //     stats: {
  //       racePoints: 0,
  //       qualificationPoints: 0,
  //       bestRacePosition: 11,
  //       bestQualifyingPosition: 11,
  //       averagePointsPerRace: 0,
  //       rankAmoungPiers: `${constructorRank}/${tpData.length}`,
  //       numberOfDNFs: 0,
  //     },
  //   });
  // });

  debugger;

  await batch.commit();
};