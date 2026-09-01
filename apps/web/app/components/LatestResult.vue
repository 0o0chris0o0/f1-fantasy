<template>
  <div
    class="relative font-headline py-2 px-3 rounded-lg text-center bg-surface-container-low shadow-xl ring ring-secondary/50"
  >
    <p class="text-xl font-semibold text-on-surface">Latest Result</p>
    <div class="flex gap-2 justify-center items-center mb-2">
      <p class="font-f1 font-bold">{{ latestResult.raceName }}:</p>
      <p
        class="flex items-baseline justify-center font-bold text-2xl text-primary"
      >
        <span>{{ latestResult.totalModifiedScore }}</span>
        <span class="text-[12px]">&nbsp;PTS</span>
      </p>
    </div>

    <NuxtLink :to="`/results/${user?.uid}`" class="text-xs underline"
      >More info</NuxtLink
    >

    <button
      class="absolute -top-3 -right-2 bg-error p-1.5 rounded-full"
      @click="clearLatestResult"
    >
      <Icon name="material-symbols:close" class="text-xl" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { iResult } from "@f1pick6/shared";
import { doc, updateDoc } from "firebase/firestore";

const db = useFirestore();
const user = useCurrentUser();

defineProps<{
  latestResult: iResult;
}>();

const clearLatestResult = () => {
  if (user.value?.uid) {
    const playerRef = doc(db, "players", user.value?.uid);
    updateDoc(playerRef, {
      latestResultCleared: true,
    });
  }
};
</script>

<style lang="scss" scoped></style>
