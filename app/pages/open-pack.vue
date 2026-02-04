<template>
  <div>
    <Loader v-if="isLoading" />
    <p>{{ packId }}</p>
    <p v-for="card in loot"> {{ card.cardData.cardId }}</p>
  </div>
</template>

<script setup lang="ts">
import type { iCardInUsersCards } from '~/types/card';

  definePageMeta({
    middleware: "auth",
  });

  const route = useRoute();
  const cardsStore = useCardsStore();

  const { allCards } = storeToRefs(cardsStore);

  await callOnce('all-cards', () => cardsStore.getAllCards());

  const packId = route.query.packId as string;
  const isLoading = ref(true);
  const loot = ref<iCardInUsersCards[]>([]);

  onMounted(async () => {
    try {
      loot.value = await openPack(packId);
    } catch (error) {
      navigateTo('/packs');
    } finally {
      isLoading.value = false;
    }
 
  })
</script>

<style lang="scss">
</style>
