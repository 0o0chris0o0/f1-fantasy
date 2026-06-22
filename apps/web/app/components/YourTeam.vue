<template>
  <div class="text-center">
    <h2 class="text-lg mb-3 font-semibold font-f1">Your Team</h2>
    <NuxtLink to="/my-team">
      <div class="grid grid-cols-3 gap-2">
        <div v-for="(card, key) in cards" :key="key">
          <div v-if="card">
            <Card :card="card.cardData" :rarity="card.rarity" disable-modal />
          </div>
          <BlankCard v-else class="opacity-25" />
          <!-- <p>{{ key }}: {{ card?.cardData.cardName || 'Empty Slot' }}</p> -->
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { iCardInUsersCards, iCurrentTeam } from "@f1pick6/shared/types";

const userStore = useUserStore();

const { userObj } = storeToRefs(userStore);

const cards = computed(() => {
  const keys = ["uncommon", "rare", "legendary"];
  let returnObj: Record<string, iCardInUsersCards | null | undefined> = {};

  keys.forEach((k) => {
    const realKey = `${k}Driver` as keyof iCurrentTeam;

    returnObj[`${k}Driver`] = userObj.value?.currentTeam[realKey];
  });

  keys.forEach((k) => {
    const realKey = `${k}Constructor` as keyof iCurrentTeam;

    returnObj[`${k}Constructor`] = userObj.value?.currentTeam[realKey];
  });

  return returnObj;
});
</script>

<style scoped></style>
