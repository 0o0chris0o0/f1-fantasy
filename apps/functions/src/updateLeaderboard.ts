import { iLeaderBoard, iLeaderboardScore } from "@f1pick6/shared/types";
import { getFirestore } from "firebase-admin/firestore";

export async function updateLeaderboard(
  playerResultsForLeaderboard: Record<
    string,
    Omit<iLeaderboardScore, "currentRank" | "prevRank">
  >,
) {
  const firestore = getFirestore();
  const writeBatch = firestore.batch();

  const newLeaderboard: iLeaderBoard = {};

  // get current leaderboard DB values
  const leaderboardSnap = await firestore.collection("leaderboard").get();
  const leaderboardDocs = leaderboardSnap.docs;
  const leaderboardDocsByPlayerId = new Map<
    string,
    (typeof leaderboardDocs)[number]
  >();

  // create a new leaderboard object with all players before editing the ranks
  leaderboardDocs.forEach((doc) => {
    const data = doc.data() as iLeaderboardScore;
    newLeaderboard[data.playerId] = data;
    leaderboardDocsByPlayerId.set(data.playerId, doc);
  });

  Object.values(playerResultsForLeaderboard).forEach((player) => {
    const existingPlayer = newLeaderboard[player.playerId];

    newLeaderboard[player.playerId] = {
      ...player,
      currentScore: (existingPlayer?.currentScore ?? 0) + player.currentScore,
      currentRank: existingPlayer?.currentRank ?? 0,
      prevRank: existingPlayer?.currentRank ?? 0,
    };
  });

  const sortedLeaderboard = Object.values(newLeaderboard).sort(
    (a, b) =>
      b.currentScore - a.currentScore || a.playerId.localeCompare(b.playerId),
  );

  sortedLeaderboard.forEach((player, index) => {
    newLeaderboard[player.playerId] = {
      ...player,
      currentRank: index + 1,
      prevRank: player.currentRank || index + 1,
    };
  });

  // loop through and update each doc in the DB
  Object.entries(newLeaderboard).forEach(([playerId, player]) => {
    const leaderboardDoc = leaderboardDocsByPlayerId.get(playerId);

    if (leaderboardDoc) {
      writeBatch.update(leaderboardDoc.ref, { ...player });
    } else {
      writeBatch.set(firestore.collection("leaderboard").doc(playerId), player);
    }
  });

  await writeBatch.commit();

  return newLeaderboard;
}
