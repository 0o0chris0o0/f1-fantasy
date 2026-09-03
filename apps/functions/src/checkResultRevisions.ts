import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import {
  CardType,
  iCardInUsersCards,
  iConstructorCard,
  iConstructorFantasyScore,
  iCurrentTeam,
  iCurrentTeamScores,
  iDriverCard,
  iDriverFantasyScore,
  iLeaderboardScore,
  iResult,
  iRoundInfo,
} from "@f1pick6/shared/types";
import getResults from "./getResults";
import { generateFantasyScores } from "./generateFantasyScores";
import { generatePlayerScores } from "./generatePlayerScores";
import { updateLeaderboard } from "./updateLeaderboard";
import { mergeUpdatedCards } from "./updateAllCards";

interface iResultChange {
  cardId: string;
  name: string;
  isConstructor: boolean;
  oldPoints: number;
  newPoints: number;
  delta: number;
  oldFinishingStatus?: string;
  newFinishingStatus?: string;
}

export async function checkResultRevisions() {
  const firestore = getFirestore();

  const roundInfoSnap = await firestore.doc("appData/roundInfo").get();
  const roundData = roundInfoSnap.data() as iRoundInfo;
  const round = roundData.currentRound - 1;

  if (round < 1) {
    logger.info("No previous round to check for revisions yet");
    return;
  }

  const snapshotRef = firestore.doc(`raceResultSnapshots/${round}`);
  const snapshotSnap = await snapshotRef.get();

  if (!snapshotSnap.exists) {
    logger.warn(`No stored result snapshot found for round ${round}`);
    return;
  }

  const storedFantasyScores = snapshotSnap.get("fantasyScores") as Record<
    string,
    iDriverFantasyScore | iConstructorFantasyScore
  >;

  // re-fetch the official results and recompute scores from scratch
  const { raceResults } = await getResults(String(round));

  if (!raceResults) {
    logger.warn(
      `Couldn't re-fetch results for round ${round}, skipping revision check`,
    );
    return;
  }

  const freshFantasyScores = generateFantasyScores(raceResults);

  const changes = findScoreChanges(storedFantasyScores, freshFantasyScores);

  if (changes.length === 0) {
    logger.info(`No result revisions found for round ${round}`);
    return;
  }

  logger.info(
    `Found ${changes.length} revised score(s) for round ${round}`,
    changes,
  );

  const changedCardIds = new Set(changes.map((change) => change.cardId));
  const writeBatch = firestore.batch();

  const updatedCards = await applyCardCorrections(
    firestore,
    writeBatch,
    changes,
    round,
  );

  const { leaderboardDeltas, affectedPlayerCount } =
    await applyPlayerCorrections(
      firestore,
      writeBatch,
      changedCardIds,
      freshFantasyScores,
      round,
      updatedCards,
    );

  await writeBatch.commit();

  if (Object.keys(leaderboardDeltas).length > 0) {
    await updateLeaderboard(leaderboardDeltas);
  }

  // keep the snapshot in sync so a re-run of this function is a no-op
  await snapshotRef.update({
    raceResults,
    fantasyScores: freshFantasyScores,
    revisedAt: FieldValue.serverTimestamp(),
  });

  await firestore.collection("resultRevisions").add({
    round,
    detectedAt: FieldValue.serverTimestamp(),
    changes,
    affectedPlayerCount,
  });

  logger.info(
    `Applied corrections for round ${round}, ${affectedPlayerCount} player(s) affected`,
  );
}

function findScoreChanges(
  oldScores: Record<string, iDriverFantasyScore | iConstructorFantasyScore>,
  newScores: Record<string, iDriverFantasyScore | iConstructorFantasyScore>,
): iResultChange[] {
  const changes: iResultChange[] = [];

  for (const cardId of Object.keys(newScores)) {
    const oldScore = oldScores[cardId];
    const newScore = newScores[cardId];

    if (!oldScore || !newScore) continue;
    if (oldScore.totalFantasyPoints === newScore.totalFantasyPoints) continue;

    const isConstructor = !("driverId" in newScore);

    changes.push({
      cardId,
      name: isConstructor
        ? cardId
        : (newScore as iDriverFantasyScore).driverName,
      isConstructor,
      oldPoints: oldScore.totalFantasyPoints,
      newPoints: newScore.totalFantasyPoints,
      delta: newScore.totalFantasyPoints - oldScore.totalFantasyPoints,
      oldFinishingStatus: isConstructor
        ? undefined
        : (oldScore as iDriverFantasyScore).finishingStatus,
      newFinishingStatus: isConstructor
        ? undefined
        : (newScore as iDriverFantasyScore).finishingStatus,
    });
  }

  return changes;
}

async function applyCardCorrections(
  firestore: FirebaseFirestore.Firestore,
  writeBatch: FirebaseFirestore.WriteBatch,
  changes: iResultChange[],
  round: number,
) {
  const updatedCards: Record<string, iDriverCard | iConstructorCard> = {};

  for (const change of changes) {
    const cardRef = firestore.doc(`cards/${change.cardId}`);
    const cardSnap = await cardRef.get();

    if (!cardSnap.exists) {
      logger.warn(`Couldn't find card ${change.cardId} to apply correction`);
      continue;
    }

    const card = cardSnap.data() as iDriverCard | iConstructorCard;

    card.stats.currentFantasyPoints += change.delta;
    // Note: this is an approximation - the running average formula rounds at
    // every step, so reversing a single round's contribution exactly isn't
    // possible without a per-round history of raw values.
    card.stats.averageFantasyPoints = Math.round(
      card.stats.averageFantasyPoints + change.delta / round,
    );

    if (card.type === CardType.DRIVER && !change.isConstructor) {
      if (
        change.newFinishingStatus === "Disqualified" &&
        change.oldFinishingStatus !== "Disqualified"
      ) {
        card.stats.numberOfDNFs += 1;
      } else if (
        change.oldFinishingStatus === "Disqualified" &&
        change.newFinishingStatus !== "Disqualified"
      ) {
        card.stats.numberOfDNFs = Math.max(0, card.stats.numberOfDNFs - 1);
      }
    }

    writeBatch.update(cardRef, { stats: card.stats });
    updatedCards[change.cardId] = card;
  }

  return updatedCards;
}

async function applyPlayerCorrections(
  firestore: FirebaseFirestore.Firestore,
  writeBatch: FirebaseFirestore.WriteBatch,
  changedCardIds: Set<string>,
  freshFantasyScores: Record<
    string,
    iDriverFantasyScore | iConstructorFantasyScore
  >,
  round: number,
  updatedCards: Record<string, iDriverCard | iConstructorCard>,
) {
  const leaderboardDeltas: Record<
    string,
    Omit<iLeaderboardScore, "currentRank" | "prevRank">
  > = {};
  let affectedPlayerCount = 0;

  const playersSnap = await firestore.collection("players").get();

  playersSnap.docs.forEach((playerDoc) => {
    const results = (playerDoc.get("results") as iResult[]) || [];
    const resultIndex = results.findIndex((result) => result.round === round);

    if (resultIndex === -1) return;

    const originalResult = results[resultIndex];
    const hadChangedCard = Object.values(originalResult.cards).some(
      (slot) => slot && changedCardIds.has(slot.cardData.cardId),
    );

    if (!hadChangedCard) return;

    // rebuild the team as it was that round from the stored result snapshot
    const reconstructedTeam = originalResult.cards as unknown as iCurrentTeam;
    const correctedResult = generatePlayerScores(
      reconstructedTeam,
      freshFantasyScores,
      round,
    );

    const delta =
      correctedResult.totalModifiedScore - originalResult.totalModifiedScore;

    if (delta === 0) return;

    const updatedResult: iResult = {
      ...originalResult,
      cards: correctedResult.cards as iCurrentTeamScores,
      baseFantasyScore: correctedResult.baseFantasyScore,
      baseQualifyingScore: correctedResult.baseQualifyingScore,
      baseRaceScore: correctedResult.baseRaceScore,
      totalModifiedScore: correctedResult.totalModifiedScore,
    };

    const updatedResults = [...results];
    updatedResults[resultIndex] = updatedResult;

    const isLatestResult = playerDoc.get("latestResult")?.round === round;
    const playersCards = (playerDoc.get("cards") as iCardInUsersCards[]) || [];

    writeBatch.update(playerDoc.ref, {
      results: updatedResults,
      currentScore: FieldValue.increment(delta),
      money: FieldValue.increment(delta),
      cards: mergeUpdatedCards(playersCards, updatedCards),
      ...(isLatestResult
        ? { latestResult: updatedResult, latestResultCleared: false }
        : {}),
    });

    leaderboardDeltas[playerDoc.id] = {
      playerId: playerDoc.id,
      playerName: playerDoc.get("displayName"),
      currentScore: delta,
      qualifyingScore:
        correctedResult.baseQualifyingScore -
        originalResult.baseQualifyingScore,
      raceScore: correctedResult.baseRaceScore - originalResult.baseRaceScore,
      modifierScore:
        correctedResult.totalModifiedScore -
        correctedResult.baseFantasyScore -
        (originalResult.totalModifiedScore - originalResult.baseFantasyScore),
    };
    affectedPlayerCount += 1;
  });

  return { leaderboardDeltas, affectedPlayerCount };
}
