import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { generatePlayerScores } from "./generatePlayerScores";
import { iConstructorFantasyScore, iCurrentTeam, iDriverFantasyScore } from "@f1pick6/shared/types";

export async function updatePlayerScores(fantasyScores: Record<string, iDriverFantasyScore | iConstructorFantasyScore>, round: number) {
  const firestore = getFirestore();
  // const writeBatch = firestore.batch();

  // get all players
  const playersSnap = await firestore.collection("players").get();
  
  // update each player's score based on the fantasy scores
  playersSnap.docs.forEach((player) => {
    // get the players team
    const playerTeam = player.get('currentTeam') as iCurrentTeam

    // generate the players score object
    generatePlayerScores(playerTeam, fantasyScores, round);

    // update overall score



    // logger.log(playerTeam);

  // loop through players and update their scores based on the fantasyScores object
  // this will involve:
  // - calculating the points for each player based on their selected drivers/constructors and the fantasy scores
  // - updating the player's total score in the database
  // - keeping track of any changes to the player's score for leaderboard updates
  })
};