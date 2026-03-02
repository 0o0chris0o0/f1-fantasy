import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import isBetween from "dayjs/plugin/isBetween";
import advancedFormat from 'dayjs/plugin/advancedFormat';
import type { Timestamp } from "firebase/firestore";

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

export const prettyRaceDate = (date: Timestamp) => {
  const jsDate = dayjs(date.toDate())
  return jsDate.format('DD/MM/YYYY - HH:mm')
}

export const raceDateV2 = (date: Timestamp) => {
  const jsDate = dayjs(date.toDate())
  return jsDate.format('dddd, Do MMM, YYYY - HH:mm')
}

export const timeToEdit = (editCutoff: Timestamp) => {
  return dayjs().to(dayjs(editCutoff.toDate()));
}

export const isEditingClosed = (editCutoff: Timestamp, raceStart: Timestamp) => {
  // editing is closed between first practice (editCutoff) and race end (raceStart + 12 hours)
  
  // add 12 hours to ensure race has finished
  const toRaceEnd= dayjs(raceStart.toDate()).add(12, 'hours')

  return dayjs().isBetween(dayjs(editCutoff.toDate()), toRaceEnd);
}