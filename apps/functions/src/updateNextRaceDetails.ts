import { iRace } from "@f1pick6/shared/types";
import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";

export async function updateNextRaceDetails(completedRound: number) {
  const firestore = getFirestore();

  const nextScheduleRef = await firestore.doc(`schedule/round${completedRound + 1}`).get()
  const nextScheduleData = nextScheduleRef.data() as iRace;

  if (nextScheduleRef.exists && nextScheduleData) {
    const roundInfoRef = firestore.doc('appData/roundInfo');
    await roundInfoRef.update({
      currentRound: completedRound + 1,
      nextRaceName: nextScheduleData.raceName,
      nextRaceStart: nextScheduleData.raceStart,
      teamEditCutoff: nextScheduleData.firstPractice
    })
  } else {
    logger.warn('No next race found!')
  }

}