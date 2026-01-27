import { doc, Firestore, writeBatch } from "firebase/firestore";
import nationalities from 'i18n-nationality';
import enLocale from 'i18n-nationality/langs/en.json';
import { CardType, type iDriverCard, type iConstructorCard } from "~/types/card";
import type { JolpicaConstructor, JolpicaConstructorsResponse } from "~/types/jolpica/constructors";
import type { JolpicaConstructorStanding, JolpicaConstructorStandingsResponse } from "~/types/jolpica/constructorStandings";
import type { JolpicaDriver, JolpicaDriversResponse } from "~/types/jolpica/drivers";
import type { JolppicaDriverStanding, JolpicaDriverStandingsResponse } from "~/types/jolpica/driverStandings";

const currentYear = 2026;

nationalities.registerLocale(enLocale);

export const addAllCards = async (db: Firestore) => {
  const batch = writeBatch(db);

  // get all drivers standings from the previous year for matching teams
  const driverStandingsResponse = await fetch(
    `https://api.jolpi.ca/ergast/f1/${currentYear - 1}/driverStandings.json`
  );
  const driverStandingsData: JolpicaDriverStandingsResponse = await driverStandingsResponse.json();
  const allDriversStandings = driverStandingsData.MRData.StandingsTable.StandingsLists[0]?.DriverStandings;

  const driverResponse = await fetch(`https://api.jolpi.ca/ergast/f1/${currentYear}/drivers/`);
  const driverData: JolpicaDriversResponse = await driverResponse.json();
  const allDrivers = driverData.MRData.DriverTable.Drivers;

  if (!allDrivers) return;

  const formattedDrivers: iDriverCard[] = [];

  // build drivers cards data
  allDrivers.forEach((driver: JolpicaDriver) => {

    const driverLocaleCode = nationalities.getAlpha2Code(driver.nationality, 'en');
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    const driverCountry = driverLocaleCode ? regionNames.of(driverLocaleCode) : '';

    const driverStanding = allDriversStandings?.find((ds => ds.Driver.driverId === driver.driverId));

    const newObj: iDriverCard = {
      cardId: driver.driverId,
      cardName: `${driver.givenName} ${driver.familyName}`,
      enabled: true,
      teamId: driverStanding?.Constructors[0]?.constructorId || '',
      teamName: driverStanding?.Constructors[0]?.name || '',
      type: CardType.DRIVER,
      nationality: driverCountry || '',
      nationalityCode: driverLocaleCode || '',
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
  // const constructorResponse = await fetch(
  //   `https://api.jolpi.ca/ergast/f1/${currentYear}/constructorStandings.json`
  // );

  const constructorResponse = await fetch(`https://api.jolpi.ca/ergast/f1/${currentYear}/constructors/`)

  const constructorData: JolpicaConstructorsResponse = await constructorResponse.json();
  const allConstructors = constructorData.MRData.ConstructorTable.Constructors;

  if (!allConstructors) return;

  const formattedConstructors: iConstructorCard[] = [];

  // build constructor cards data
  allConstructors.forEach((constructor: JolpicaConstructor) => {

    const constructorLocaleCode = nationalities.getAlpha2Code(constructor.nationality, 'en');
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    const constructorCountry = constructorLocaleCode ? regionNames.of(constructorLocaleCode) : '';

    const constructorDrivers = formattedDrivers.filter(driver => driver.teamId === constructor.constructorId);

    const newObj: iConstructorCard = {
      cardId: constructor.constructorId,
      cardName: constructor.name,
      enabled: true,
      teamId: constructor.constructorId,
      teamName: constructor.name,
      type: CardType.CONSTRUCTOR,
      nationality: constructorCountry || '',
      nationalityCode: constructorLocaleCode || '',
      homeRaceLocationId: null,
      homeRaces: [],
      drivers: constructorDrivers,
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