/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import getResults from "./getResults";
import { generateFantasyScores } from "./generateFantasyScores";
import { updatePlayerScores } from "./updatePlayerScores";
import { iConstructorFantasyScore, iDriverFantasyScore, iLeaderBoard, iLeaderboardScore } from "@f1pick6/shared/types";
import { updateLeaderboard } from "./updateLeaderboard";
import { updateAllCards } from "./updateAllCards";
import { updateNextRaceDetails } from "./updateNextRaceDetails";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

initializeApp();

if (process.env.FUNCTIONS_EMULATOR) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const performUpdate = async (round?: string): Promise<string> => {
  // get latest results
  const { raceResults, roundData } = await getResults(round);

  if (raceResults && roundData) {
    // generate fantasy scores based on results
    // no modifiers are applied here
    const fantasyScores: { [key: string]: iDriverFantasyScore | iConstructorFantasyScore } = generateFantasyScores(raceResults);

    logger.info("Fantasy Scores Generated");
    logger.log(fantasyScores);

    // Update all players scores
    // remove used cards for each player
    // update each players card history object & xp values
    // update each players money
    // update each players results
    const playerResultsForLeaderboard: Record<string, Omit<iLeaderboardScore, 'currentRank' | 'prevRank'>> = await updatePlayerScores(fantasyScores, roundData);

    // Update the leaderboard
    const newLeaderboard = await updateLeaderboard(playerResultsForLeaderboard);
    
    logger.info("Leaderboard updated:");
    logger.log(newLeaderboard)

    // update all cards including those in the players objs
    await updateAllCards(fantasyScores, roundData.currentRound);

    // Update the next race details & round number
    await updateNextRaceDetails(roundData.currentRound);
    logger.info('Next race details updated')


    return `Update performed for round ${round || "latest"}`;
  } else {
    return 'No update performed - no results found for the specified round';
  }
};

export const run = onRequest(async (request, response) => {
  let result;

  if (request.query.round && typeof request.query.round === "string") {
    result = await performUpdate(request.query.round);
  } else {
    result = await performUpdate();
  }

  logger.info(result);
  response.send(result);
});
