// import axios from "axios";
import * as logger from "firebase-functions/logger";
import { getFirestore } from "firebase-admin/firestore";
import axios from 'axios';

import type { iRoundInfo } from "@shared/types/appData";
import type { iJolpicaResult } from "../types/jolpicaResults";

export default async function getResults(forceRound?: string) {
  try {
    const currentYear = 2025;
    let round = forceRound || '';
    
    if (!forceRound) {
      // get current week from DB
      const firestore = getFirestore();
      const docSnap = await firestore.doc("appData/roundInfo").get();
      const roundData = docSnap.data() as iRoundInfo;

      round = `${roundData.currentRound}`;
      logger.info(`No round provided, using DB value: ${round}`);
    } else {
      logger.info(`Getting results for round ${round}...`);
    }

    // get results
    const resultResponse = await axios(`https://api.jolpi.ca/ergast/f1/${currentYear}/${round}/results/`);
    const raceData = resultResponse.data.MRData.RaceTable;
    const raceResults: iJolpicaResult[] = raceData.Races[0].Results;

    // check if theres been a new race
    if (raceResults) {
      logger.info("Race results found...");
      return { raceResults, round: parseInt(round) };
    } else {
      logger.info(`No race results found, maybe the race hasn't happened yet?`);
      return {};
    }
  } catch (error: any) {
    logger.error(`Couldn't get latest results. Error msg: ${error.message}`);
    return {};
  }
}
