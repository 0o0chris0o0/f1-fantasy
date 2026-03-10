// import axios from "axios";
import * as logger from "firebase-functions/logger";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import axios from 'axios';

import type { iJolpicaResult, iRoundInfo } from "@f1pick6/shared/types";

export default async function getResults(forceRound?: string) {
  try {
    const currentYear = 2025;
    let roundData: iRoundInfo = {} as iRoundInfo;
    
    if (!forceRound) {
      // get current week from DB
      const firestore = getFirestore();
      const docSnap = await firestore.doc("appData/roundInfo").get();
      const roundDataFromDb = docSnap.data() as iRoundInfo;

      roundData = roundDataFromDb;

      logger.info(`No round provided, using DB value: ${roundData.currentRound}`);
    } else {
      roundData.currentRound = parseInt(forceRound);
      logger.info(`Getting results for round ${forceRound}...`);
    }

    // get results
    const resultResponse = await axios(`https://api.jolpi.ca/ergast/f1/${currentYear}/${roundData.currentRound}/results/`);
    const raceData = resultResponse.data.MRData.RaceTable;
    const raceResults: iJolpicaResult[] = raceData.Races[0].Results;

    // check if theres been a new race
    if (raceResults) {
      logger.info("Race results found...");
      return { raceResults, roundData };
    } else {
      logger.info(`No race results found, maybe the race hasn't happened yet?`);
      return {};
    }
  } catch (error: any) {
    logger.error(`Couldn't get latest results. Error msg: ${error.message}`);
    return {};
  }
}
