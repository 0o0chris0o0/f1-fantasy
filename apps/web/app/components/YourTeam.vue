<template>
  <div v-if="userObj" class="text-center">
    <h2 class="text-lg mb-3 font-semibold font-f1">Your Team</h2>
    <div
      class="glass-panel rounded-lg p-3 mb-6 border-primary-container flex items-center gap-3"
      :class="{
        'bg-primary-container/40': teamCount !== 6,
        'bg-tertiary/40': teamCount === 6,
      }"
    >
      <Icon name="bi:info-circle" class="text-lg text-white" />
      <p class="font-headline text-xs text-white">
        <template v-if="teamCount === 6">Your team is ready!</template>
        <template v-else
          >Your team is still incomplete. {{ teamCount }}/6 cards
          selected.</template
        >
      </p>
    </div>

    <div class="grid grid-cols-6 gap-2">
      <div v-for="(card, key) in cards" :key="key">
        <div v-if="card">
          <Card
            :card="card.cardData"
            :rarity="card.rarity"
            :userDetails="{
              level: card.level,
              xp: card.xp,
              quantity: card.quantity,
              inCollection: card.inCollection,
              inTeam: true,
            }"
            hide-card-score
          />
        </div>
        <BlankCard v-else class="opacity-25" />
      </div>
    </div>
    <div class="mt-1">
      <NuxtLink
        to="/my-team"
        class="block underline py-2 font-headline font-bold text-secondary"
        >Edit Team</NuxtLink
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { iCardInUsersCards, iCurrentTeam } from "@f1pick6/shared/types";

const userStore = useUserStore();

const { userObj } = storeToRefs(userStore);

const cards = computed(() => {
  let returnObj: (iCardInUsersCards | null)[] = [];

  const slotKeys: (keyof iCurrentTeam)[] = [
    "legendarySlot_a",
    "legendarySlot_b",
    "rareSlot_a",
    "rareSlot_b",
    "uncommonSlot_a",
    "uncommonSlot_b",
  ];

  for (const key of slotKeys) {
    const card = userObj.value?.currentTeam[key];
    returnObj.push(card || null);
  }

  return returnObj;
});

const teamCount = computed(() => cards.value.filter(Boolean).length);
</script>

<style scoped></style>
