<template>
  <div>
    <div class="grid grid-cols-12 mb-6">
      <div class="col-span-3 flex items-center">
        <NuxtLink to="/home">
          <Button class="text-xs" text-color-class="text-white">back</Button>
        </NuxtLink>
      </div>
      <PageHeader class="col-span-6 col-start-4">Latest Race Result</PageHeader>
    </div>

    <div v-if="latestResult" class="">
      <div class="mb-4 text-center">
        <p class="font-f1">{{ latestResult.raceName }}</p>
        <p class="text-sm opacity-75">{{ prettyDate(latestResult.raceStart) }}</p>
      </div>

      <div class="bg-gray-900 p-2 rounded mb-2">
        <p class="font-f1">Round Score: <span class="text-lg font-semibold">{{ latestResult.score }}</span></p>
        <p>Base round score: {{ latestResult.score - latestResult.cardCompletionBonus }}pts</p>
        <p>Collection completion bonus: {{ latestResult.cardCompletionBonus }}pts</p>
      </div>

      <div class="p-2">
        <p class="text-center font-f1 text-sm mb-4">
          Driver score: <span class="text-base font-semibold">{{ driversScore }}pts</span>
        </p>

        <div class="grid grid-cols-1 gap-6">
          <div v-for="driver in latestResult.drivers" :key="driver.cardId">
            <ScoreOverviewsDriverOverview :card="driver" />
          </div>
        </div>
      </div>


      <div class="p-2">
        <p class="text-center font-f1 text-sm">
          Car score: <span class="text-base font-semibold">{{ latestResult.car.fantasyRaceScore }}pts</span>
        </p>
        <p class="text-center italic text-sm mb-4">(Scores from the race)</p>
        <ScoreOverviewsCarOverview :card="latestResult.car" />
      </div>

      <div class="p-2">
        <p class="text-center font-f1 text-sm">
          TP score: <span class="text-base font-semibold">{{ latestResult.teamPrinciple.fantasyScore }}pts</span>
        </p>
        <p class="text-center italic text-sm mb-4">(Scores from qualifying)</p>
        <ScoreOverviewsTpOverview :card="latestResult.teamPrinciple" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import type { Timestamp } from 'firebase/firestore';

definePageMeta({
  middleware: "auth",
});

const userStore = useUserStore();

const { userFromStore } = storeToRefs(userStore);

const latestResult = userFromStore.value?.latestResult;

const prettyDate = (date: Timestamp) => {
  const jsDate = dayjs(date.toDate())
  return jsDate.format('dddd, Do MMM, YYYY - HH:mm')
}

const driversScore = computed(() => {
  let score = 0;

  if (latestResult) {
    score += latestResult.drivers['1'].totalFantasyScore;
    score += latestResult.drivers['2'].totalFantasyScore;
  }
  
  return score;
})
        
</script>

<style scoped></style>
