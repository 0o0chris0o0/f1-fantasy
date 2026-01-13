import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import isBetween from "dayjs/plugin/isBetween";
import advancedFormat from 'dayjs/plugin/advancedFormat';

import { collection, doc, getDoc, type Timestamp } from "firebase/firestore";
import type { iRoundInfo } from "~/types/appData";
import type { FirebaseError } from "firebase/app";

dayjs.extend(relativeTime, {
  thresholds: [
    { l: "s", r: 1 },
    { l: "m", r: 1 },
    { l: "mm", r: 59, d: "minute" },
    { l: "h", r: 1 },
    { l: "hh", r: 23, d: "hour" },
    { l: "d", r: 1 },
    { l: "dd", r: 29, d: "day" },
    { l: "M", r: 1 },
    { l: "MM", r: 11, d: "month" },
    { l: "y", r: 1 },
    { l: "yy", d: "year" },
  ],
});
dayjs.extend(updateLocale);
dayjs.extend(isBetween);
dayjs.extend(advancedFormat);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "%s",
    past: "%s ago",
    s: "a few seconds",
    m: "1 minute",
    mm: "%d minutes",
    h: "1 hour",
    hh: "%d hours",
    d: "1 day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years",
  },
});

export const useAppDataStore = defineStore('appData', () => {
  const roundInfo = ref<iRoundInfo | undefined>(undefined)
  const totalNumberOfCards = ref<number>(0);

  const getAppData = async () => {
    const db = useFirestore();
    const appDataRef = collection(db, "appData");

    if (!roundInfo.value) {
      try {
        const roundInfoSnap = await getDoc(doc(appDataRef, 'roundInfo'));
        roundInfo.value = roundInfoSnap.data() as iRoundInfo;
      } catch (e: FirebaseError | any) {
        const error = new Error(e);
        throw error;
      }
    }
  }

  const timeToEdit = computed(() => {
    if (roundInfo.value) {
      const toEdit: Timestamp = roundInfo.value.teamEditCutoff;
      return dayjs().to(dayjs(toEdit.toDate()));
    }
  })

  const raceTime = computed(() => {
    if (roundInfo.value) {
      const toRaceStart: Timestamp = roundInfo.value.nextRaceStart;
      return dayjs(toRaceStart.toDate()).format('ddd Do MMM - HH:mm')
    }
  })

  const isEditingClosed = computed(() => {
    if (roundInfo.value) {
      const toEdit: Timestamp = roundInfo.value.teamEditCutoff;
      const toRaceEnd: Timestamp = roundInfo.value.nextRaceStart;
      const toRaceEndPlus = dayjs(toRaceEnd.toDate()).add(12, 'hours')

      return dayjs().isBetween(dayjs(toEdit.toDate()), toRaceEndPlus);
    }
  });

  return { getAppData, totalNumberOfCards, timeToEdit, raceTime, isEditingClosed, roundInfo }
});