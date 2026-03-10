import { iLeaderBoard, iLeaderboardScore } from "@f1pick6/shared/types";
import { getFirestore } from "firebase-admin/firestore";

export async function updateLeaderboard(playerResultsForLeaderboard: Record<string, Omit<iLeaderboardScore, 'currentRank' | 'prevRank'>>) {
  const firestore = getFirestore();

  const leaderboardObj: iLeaderBoard = {};

  // get current leaderboard DB object for previous rankings
  const leaderboardSnap = await firestore.doc('appData.leaderboard').get();
  const leaderboardData = leaderboardSnap.data();

  // sort leaderboard by score
  const sortedLeaderboard = Object.values(playerResultsForLeaderboard).sort((a, b) => a.currentScore > b.currentScore ? 1 : -1);

  // use the index when looping to set the new rank
  sortedLeaderboard.forEach((player, index) => {
    const playerId: string = player.playerId;
    const prevRank = leaderboardData ? leaderboardData[playerId].prevRank : 1;

    leaderboardObj[player.playerName] = {
      ...player,
      currentRank: index,
      prevRank
    }
  })
}