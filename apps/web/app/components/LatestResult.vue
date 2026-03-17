<template>  
  <div class="relative font-f1 border-2 border-yellow-500 py-2 px-3 rounded-lg shadow-lg">
    <p class="text-xl text-center font-semibold">Latest Result</p>
    <div class="flex gap-1 justify-center items-center mb-2">
      <p class="text-center">{{ latestResult.raceName }}:</p>
      <p class="flex items-center tracking-tight">
        <span class="font-bold text-xl">{{ latestResult.totalModifiedScore }}</span>
        <span class="text-[12px]">&nbsp;PTS</span>
      </p>
    </div>
    <div class="text-center">
      <NuxtLink :to="`/results/${user?.uid}`" class="text-xs underline">More info</NuxtLink>
    </div>
    <button class="absolute -top-2 -right-2 bg-red-700 p-1 rounded-full" @click="clearLatestResult">
      <Icon name="material-symbols:close-rounded" class="text-2xl" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { iResult } from '@f1pick6/shared';
import { doc, updateDoc } from 'firebase/firestore';

const db = useFirestore();
const user = useCurrentUser();

defineProps<{
  latestResult: iResult
}>();

const clearLatestResult = () => {
  if (user.value?.uid) {
    const playerRef = doc(db, 'players', user.value?.uid)
    updateDoc(playerRef, {
      latestResultCleared: true
    })
  }
}
</script>

<style lang="scss" scoped></style>
