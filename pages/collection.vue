<template>
  <div>
    <PageHeader class="mb-4"> My Collection </PageHeader>

    <div v-if="userFromStore" class="my-2 space-y-2">
      <p class="text-center font-f1 text-lg">
        Cards collected: {{ userFromStore.cardsInCollection }} / {{ totalNumberOfCards }}
      </p>
      <span
        aria-labelledby="ProgressLabel"
        :aria-valuenow="userFromStore.collectionCompletion"
        class="block rounded-full bg-gray-200 overflow-hidden"
      >
        <span 
          class="block h-4  bg-green-600 anim-width"
          :style="`width: 0; width: ${userFromStore.collectionCompletion}%`"
          />
      </span>
      <p class="text-center text-sm">Current score bonus: {{ userFromStore.collectionCompletion }}%</p>
    </div>

    <div class="mt-6 space-y-6">
      <div
        v-for="team in cardsGroupedByTeam"
        :key="team.teamId"
        class="border border-gray-300 rounded-md "
        :class="{ 'border-green-500' : team.cardsCollected === team.totalCards }"
      >
        <button 
          class="w-full relative" 
          @click="revealTeamCards(team.teamId)"
        >
          <div
            class="absolute left-0 h-full w-10 bg-green-600"
            :style="{ width: `${team.cardsCollected * (100 / team.totalCards)}%`}" 
          />
          <div class="relative z-20 flex justify-between items-center px-4 py-2 font-f1">
            <div class="flex items-center space-x-2">
              <img :src="`/img/teams/${team.teamId}.avif`" class="w-10 h-10">
              <p>{{ team.teamName }}</p>
            </div>
            <div class="flex items-center space-x-4">
              <p>{{ team.cardsCollected }} / {{ team.totalCards }}</p>
            </div>
          </div>
        </button>
        <div v-if="teamRevealStatus[team.teamId]" class="px-4 py-2">
          <TeamCollection :team="team" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Types
import type { iCollectionGroup, iCardWithCollected } from "~/types/card";
import { CardType } from "~/types/card";

const userStore = useUserStore();
const collectionStore = useCollectionStore();
const appDataStore = useAppDataStore();

definePageMeta({
  middleware: "authenticated",
  layout: 'auth'
});

const {
  totalNumberOfCards,
} = storeToRefs(appDataStore);

const userFromStore = computed(() => {
  return userStore.userFromStore;
});

const cardsGroupedByTeam = computed(() => {
  const tmpObj: Record<string, iCollectionGroup> = {};

  for (const card of collectionStore.collectionCards) {
    let teamObj = tmpObj[card.teamId];

    // only add card into collection view if it's enabled or the user has already collected it
    if (card.enabled || card.collectedOn) {
      if (!teamObj) {
        teamObj = {
          teamId: card.teamId,
          teamName: card.teamName,
          car: {} as iCardWithCollected,
          teamPrinciple: [],
          drivers: [],
          cardsCollected: card.collectedOn ? 1 : 0,
          totalCards: 1
        };
      } else {
        teamObj.totalCards += 1;

        if (card.collectedOn) {
          teamObj.cardsCollected += 1;
        }
      }

      switch (card.type) {
        case CardType.CAR:
          teamObj.car = card;
          break;
        case CardType.TEAMPRINCIPLE:
          teamObj.teamPrinciple.push(card);
          break;
        case CardType.DRIVER:
          teamObj.drivers.push(card);
          break;
      }

      tmpObj[card.teamId] = teamObj;
    }
  }

  return tmpObj;
})

const teamRevealStatus = ref<Record<string, boolean>>({});

for (const card of collectionStore.collectionCards) {
  teamRevealStatus.value[card.teamId] = false;
}

const revealTeamCards = (teamId: string) => {
  teamRevealStatus.value[teamId] = !teamRevealStatus.value[teamId];
}
</script>

<style lang="scss" scoped>
@keyframes progress-bar {
  0% { width: 0; }
}

.anim-width {
  animation: progress-bar 1.8s ease-in-out;
}
</style>
