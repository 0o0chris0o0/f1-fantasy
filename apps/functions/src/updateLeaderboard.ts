import { iLeaderBoard, iLeaderboardScore } from "@f1pick6/shared/types";
import { getFirestore } from "firebase-admin/firestore";

export async function updateLeaderboard(playerResultsForLeaderboard: Record<string, Omit<iLeaderboardScore, 'currentRank' | 'prevRank'>>) {
  const firestore = getFirestore();
  const writeBatch = firestore.batch();

  const newLeaderboard: iLeaderBoard = {};

  // sort leaderboard by score
  const sortedLeaderboard = Object.values(playerResultsForLeaderboard).sort((a, b) => a.currentScore > b.currentScore ? -1 : 1);

  // get current leaderboard DB values
  const leaderboardSnap = await firestore.collection('leaderboard').get();
  const leaderboardDocs = leaderboardSnap.docs;
  
  // create a new leaderboard object with all players before editing the ranks
  leaderboardDocs.forEach((doc) => {
    const data = doc.data() as iLeaderboardScore;
    newLeaderboard[data.playerId] = data;
  })

  // use the index when looping to set the new ranks
  sortedLeaderboard.forEach((player, index) => {
    const prevRank = newLeaderboard[player.playerId].currentRank;

    newLeaderboard[player.playerId] = {
      ...player,
      currentRank: index + 1,
      prevRank
    }
  })

  // loop through and update each doc in the DB
  leaderboardDocs.forEach((doc) => {
    writeBatch.update(doc.ref, {
      ...newLeaderboard[doc.id]
    })
  })

  await writeBatch.commit();

  return newLeaderboard;
}