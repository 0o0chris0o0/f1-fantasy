<template>
  <div>
    <h2 class="text-center mb-6 text-lg">My Cards</h2>

    <div>
      ...filters...
    </div>

    <div>
      <h3 class="text-lg mb-2">Drivers</h3>
      <p v-if="!cardsStore.userDriverCards?.length" class="italic opacity-50">
        No cards...
      </p>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-3 mb-6">
        <div v-for="card in cardsStore.userDriverCards" :key="card.cardId">
          <button class="w-full">
            <Card
              :card="card"
              :quantity="card.quantity"
              show-collection-tag
              show-team-tag
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Components
import type { iCard } from "~/types/card";

const cardsStore = useCardsStore();
const userStore = useUserStore();

definePageMeta({
  middleware: "auth",
});

const selectedCard = ref<iCard | null>(null);
const cardsInView = ref<iCard[]>([]);
</script>

<style lang="scss" scoped>
</style>
