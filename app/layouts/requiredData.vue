<template>
  <div>
    <Loader v-if="!canRender"/>
    <slot v-else/>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const cardStore = useCardsStore();
const appDataStore = useAppDataStore();

// attempt to get all cards (won't run if we've already got em)
await cardStore.getAllCards();

// attempt to get the app data
await appDataStore.getAppData();

const canRender = computed(() => {
  // ensures we have:
  // - all cards
  // - a user
  // - the app data

  const doWeHaveAllCards = !!cardStore.allCards.length;
  // const doWeHaveAUserObj = !!userStore.userFromStore;
  const doWeHaveAppData = !!appDataStore.roundInfo;

  console.log('checking...');

  return doWeHaveAllCards && doWeHaveAppData;
});
</script>

<style scoped></style>
