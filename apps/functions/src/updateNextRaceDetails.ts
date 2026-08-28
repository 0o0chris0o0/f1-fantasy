import { iRace } from "@f1pick6/shared/types";
import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";

export async function updateNextRaceDetails(completedRound: number) {
  const firestore = getFirestore();
  const roundInfoRef = firestore.doc("appData/roundInfo");
  const nextRound = completedRound + 1;

  const nextScheduleSnap = await firestore
    .doc(`schedule/round${nextRound}`)
    .get();
  const nextScheduleData = nextScheduleSnap.data() as iRace;

  if (nextScheduleSnap.exists && nextScheduleData) {
    await roundInfoRef.set(
      {
        currentRound: nextRound,
        nextRaceName: nextScheduleData.raceName,
        nextRaceStart: nextScheduleData.raceStart,
        teamEditCutoff: nextScheduleData.firstPractice,
      },
      { merge: true },
    );
  } else {
    await roundInfoRef.set({ currentRound: nextRound }, { merge: true });
    logger.warn(
      "No next race found; advanced the current round to prevent reprocessing",
    );
  }
}
