<template>
  <div>
    <h1 class="text-center text-xl">Database Utils</h1>

    <div class="grid grid-flow-col gap-1 my-4 pb-2 text-center underline">
      <NuxtLink to="/db-utils/all-cards"> View all Cards </NuxtLink>
      <NuxtLink to="/db-utils/packs"> View all Packs </NuxtLink>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div><Button textColorClass="text-white" @click="performAddAllCards">Add All Cards</Button></div>
    </div>

    <Loader v-if="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { addAllCards } from "./funcs/addAllCards";

const isLoading = ref(false);
const db = useFirestore();

const performAddAllCards = async () => {
  isLoading.value = true;
  await addAllCards(db);
  isLoading.value = false;
};

// const resetAllCards = async () => {
//   const batch = writeBatch(db);

//   isLoading.value = true;

//   const querySnapshot = await getDocs(collection(db, "cards"));
//   querySnapshot.forEach((doc) => {
//     const { type } = doc.data();

//     batch.update(doc.ref, {
//       currentPoints: 0,
//       stats: {
//         averagePointsPerRace: 0,
//         bestQualifyingPosition: 0,
//         bestRacePosition: 0,
//         numberOfDNFs: 0,
//         qualificationPoints: 0,
//         racePoints: 0,
//         rankAmoungPiers: `1/${type === CardType.DRIVER ? "20" : "10"}`,
//       },
//     });
//   });

//   await batch.commit();

//   isLoading.value = false;
// };

// const resetUser = async () => {
//   isLoading.value = true;

//   const docRef = doc(db, "players", "vaduD5it6NMicXS3uEAGjkcxhxzF");

//   await updateDoc(docRef, { ...newPlayerStarterObj, displayName: "Test" });

//   isLoading.value = false;
// };

// const setTotalNumberOfCards = async () => {
//   isLoading.value = true;

//   const querySnapshot = await getDocs(collection(db, "cards"));
//   const numberOfCards = querySnapshot.size;

//   const docRef = doc(db, "appData", "misc");
//   await updateDoc(docRef, {
//     totalNumberOfCards: numberOfCards,
//   });

//   isLoading.value = false;
// };

// const resetPacks = async () => {
//   const batch = writeBatch(db);

//   isLoading.value = true;

//   initialPacks.forEach((pack) => {
//     const newRef = doc(db, "packs", pack.packId);
//     batch.set(newRef, pack);
//   });

//   await batch.commit();

//   isLoading.value = false;
// }

// const resetSeason = async () => {
//   isLoading.value = true;
  
//   const scheduleResponse = await fetch(
//     `https://api.jolpi.ca/ergast/f1/${currentYear}/1.json`
//   );
//   const firstRaceDetailsObj = await scheduleResponse.json();

//   const firstRaceDetails = firstRaceDetailsObj.MRData.RaceTable.Races[0];

//   const newMiscObj: any = {
//     currentRound: 1,
//     raceName: firstRaceDetails.raceName,
//   };

//   if (firstRaceDetails.time) {
//     newMiscObj.raceStart = Timestamp.fromDate(
//       new Date(`${firstRaceDetails.date}T${firstRaceDetails.time}`)
//     ),
//     newMiscObj.teamEditCutoff= Timestamp.fromDate(
//       new Date(`${firstRaceDetails.FirstPractice.date}T${firstRaceDetails.FirstPractice.time}`)
//     )
//   } else {
//     console.log('start times not released yet!');
//   }

//   const docRef = doc(db, "appData", "roundInfo");
//   await updateDoc(docRef, newMiscObj);

//   await addAllCards();
//   await resetUser();
//   await setTotalNumberOfCards();
// };
</script>

<style scoped></style>
