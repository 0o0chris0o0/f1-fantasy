<template>
  <div>
    <h2 class="text-center mb-6 text-lg">My Cards</h2>

    <template v-if="pending">
      <Loader />
    </template>
    <template v-else>
      <div>
        <h3 class="text-lg mb-2">Drivers</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-3 mb-6">
          <div v-for="card in cardsStore.driverCards" :key="card.cardId">
            <button class="block w-full">
              <Card :card="card" />
            </button>
          </div>
        </div>

        <h3 class="text-lg mb-2">Cars</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-3 mb-6">
          <div v-for="card in cardsStore.carCards" :key="card.cardId">
            <button class="block w-full">
              <Card :card="card" />
            </button>
          </div>
        </div>

        <h3 class="text-lg mb-2">Team Principles</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-3 mb-6">
          <div v-for="card in cardsStore.tpCards" :key="card.cardId">
            <button class="block w-full">
              <Card :card="card" />
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
// Components
import Loader from "~/components/Loader.vue";
import type { iCard } from "~/types/card";

// Stores
const cardsStore = useCardsStore();

definePageMeta({
  middleware: "auth",
});

const { pending } = await useAsyncData("cards", cardsStore.getAllCards);

const selectedCard = ref<iCard | null>(null);
</script>

<style lang="scss" scoped></style>
