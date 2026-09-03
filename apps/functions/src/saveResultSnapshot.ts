import { getFirestore, FieldValue } from "firebase-admin/firestore";
import {
  iConstructorFantasyScore,
  iDriverFantasyScore,
  iJolpicaResult,
} from "@f1pick6/shared/types";

/**
 * Stores the raw results + computed fantasy scores for a round so a later
 * revision check can diff against them if the official results change.
 */
export async function saveResultSnapshot(
  round: number,
  raceResults: iJolpicaResult[],
  fantasyScores: Record<string, iDriverFantasyScore | iConstructorFantasyScore>,
) {
  const firestore = getFirestore();

  await firestore.doc(`raceResultSnapshots/${round}`).set({
    round,
    raceResults,
    fantasyScores,
    createdAt: FieldValue.serverTimestamp(),
  });
}
