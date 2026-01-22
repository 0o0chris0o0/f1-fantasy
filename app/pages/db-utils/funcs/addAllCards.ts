import { doc, Firestore, writeBatch } from "firebase/firestore";
import { CardType, type iCard } from "~/types/card";
import type { JolpicaConstructorStanding, JolpicaConstructorStandingsResponse } from "~/types/jolpica/constructorStandings";
import type { JolppicaDriverStanding, JolpicaDriverStandingsResponse } from "~/types/jolpica/driverStandings";

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
  driverStandings.forEach((driver: JolppicaDriverStanding) => {
    const newObj: iCard = {
      cardId: driver.Driver.driverId,
      cardName: `${driver.Driver.givenName} ${driver.Driver.familyName}`,
      enabled: true,
      teamId: driver.Constructors[0]?.constructorId || '',
      teamName: driver.Constructors[0]?.name || '',
      type: CardType.DRIVER,
      nationality: driver.Driver.nationality,
      homeRaceLocationId: null,
      homeRaces: [],
      stats: {
        currentFantasyPoints: 0,
        averageQualifyingPosition: 0,
        averageRacePosition: 0,
        numberOfDNFs: 0,
      },
    };

    formattedDrivers.push(newObj);
  });

  // add cards to DB
  formattedDrivers.forEach((card) => {
    const newRef = doc(db, "cards", card.cardId);
    batch.set(newRef, card);
  });

  // get all constructors
  const constructorResponse = await fetch(
    `https://api.jolpi.ca/ergast/f1/${currentYear - 1}/constructorStandings.json`
  );

  const constructorData: JolpicaConstructorStandingsResponse = await constructorResponse.json();
  const constructorStandings =
  constructorData.MRData.StandingsTable?.StandingsLists[0]?.ConstructorStandings;

  if (!constructorStandings) return;

  const formattedConstructors: iCard[] = [];

  // build constructor cards data
  constructorStandings.forEach((constructor: JolpicaConstructorStanding) => {
    const newObj: iCard = {
      cardId: constructor.Constructor.constructorId,
      cardName: constructor.Constructor.name,
      enabled: true,
      teamId: constructor.Constructor.constructorId,
      teamName: constructor.Constructor.name,
      type: CardType.CONSTRUCTOR,
      nationality: constructor.Constructor.nationality,
      homeRaceLocationId: null,
      homeRaces: [],
      stats: {
        currentFantasyPoints: 0,
        averageQualifyingPosition: 0,
        averageRacePosition: 0,
        numberOfDNFs: 0,
      },
    };

    formattedConstructors.push(newObj);
  });

  formattedConstructors.forEach((card) => {
    const newRef = doc(db, "cards", card.cardId);
    batch.set(newRef, card);
  });

  await batch.commit();
};