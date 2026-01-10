<template>
  <div>
    <slot v-if="canRender"/>
    <Loader v-else />
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const cardStore = useCardsStore();
const appDataStore = useAppDataStore();

await cardStore.getAllCards();
const { status: appDataStatus } = useAsyncData(appDataStore.getAppData);

const canRender = computed(() => {
  // ensures we have:
  // - all cards
  // - a user
  // - the app data
  const doWeHaveAllCards = !!cardStore.allCards.length;
  const doWeHaveAUserObj = !!userStore.userFromStore;
  const doWeHaveAppData = appDataStatus.value === 'success';

  return doWeHaveAllCards && doWeHaveAUserObj && doWeHaveAppData
});
</script>

<style scoped></style>
