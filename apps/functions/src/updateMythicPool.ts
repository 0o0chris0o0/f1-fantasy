import { iJolpicaResult } from "@f1pick6/shared/types";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";

export async function updateMythicPool(raceResults: iJolpicaResult[]) {
  const firestore = getFirestore();

  const appDataRef = firestore.doc('appData/misc');
  const appDataSnap = await appDataRef.get();
  const mythicPool = appDataSnap.get('mythicPool') || [];

  // get the race winner by checking the fantasy scores
  const winner = raceResults.find(result => result.position === '1');
  const winnerId = winner?.Driver.driverId;

  if (!winnerId) {
    logger.error('No winner found');
    return;
  }

  logger.info(`Race winner is ${winnerId}`);

  const isWinnerInMythicPool = mythicPool.includes(winnerId);
  
  if (isWinnerInMythicPool) {
    logger.info('Winner is already in the mythic pool, no update needed');
    return;
  } else {
    appDataRef.update({
      mythicPool: FieldValue.arrayUnion(winnerId)
    });
    logger.info(`Added ${winnerId} to the mythic pool`);
  }
}