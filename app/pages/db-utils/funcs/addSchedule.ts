import { doc, Firestore, Timestamp, writeBatch } from "firebase/firestore";
import type { JolpicaRace, JolpicaScheduleResponse } from "~/types/jolpica/schedule";
import type { iRace } from "~/types/race";

const currentYear = 2026;

export const addSchedule = async (db: Firestore) => {
  const batch = writeBatch(db);
  
  const scheduleResponse = await fetch(
    `https://api.jolpi.ca/ergast/f1/${currentYear - 1}.json`
  );
  const scheduleData: JolpicaScheduleResponse = await scheduleResponse.json();
  const schedule = scheduleData.MRData.RaceTable.Races;
  
  if (!scheduleData) return;

  const formattedSchedule: iRace[] = [];
  
  // build drivers cards data
  schedule.forEach((race: JolpicaRace) => {
    const newObj: iRace = {
      raceName: race.raceName,
      round: Number(race.round),
      raceStart: Timestamp.fromDate(new Date(`${race.date}T${race.time}`)),
      locationCountry: race.Circuit.Location.country.toLowerCase()
    };

    formattedSchedule.push(newObj);
  });

  // add schedule to DB
  formattedSchedule.forEach((race, i) => {
    const newRef = doc(db, "schedule", `round${i + 1}`);
    batch.set(newRef, race);
  })
 
  await batch.commit();
}