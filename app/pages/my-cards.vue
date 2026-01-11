<template>
  <div>
    <h2 class="text-center mb-6 text-lg">My Cards</h2>

    <div>
      <h3 class="text-lg mb-2">Tyres</h3>
      <div v-if="userStore.userTyres" class="grid grid-cols-3 gap-6 mb-6">
        <div v-for="tyreType in ['hard', 'medium', 'soft']" :key="tyreType" class="relative">
          <div
            :class="{
              'opacity-25': !userStore.userTyres[tyreType as TyreType]
            }"
          >
            <p class="text-sm text-center mb-2">{{formattedTyreType(tyreType)}}s</p>
            <img
              :alt="`${tyreType} tyre`"
              :src="`/img/tyres/${tyreType}.svg`"
              class="w-full" 
            >
            <p
              v-if="userStore.userTyres[tyreType as TyreType]"
              class="absolute bg-gray-600 rounded-full p-2 font-f1 tyre-quantity"
            >
              x{{ userStore.userTyres[tyreType as TyreType] }}
            </p>
          </div>
        </div>
      </div>
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

      <h3 class="text-lg mb-2">Cars</h3>
      <p v-if="!cardsStore.userCarCards?.length" class="italic opacity-50">
        No cards...
      </p>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-3 mb-6">
        <div v-for="card in cardsStore.userCarCards" :key="card.cardId">
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

      <h3 class="text-lg mb-2">Team Principles</h3>
      <p v-if="!cardsStore.userTpCards?.length" class="italic opacity-50">
        No cards...
      </p>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-3 mb-6">
        <div v-for="card in cardsStore.userTpCards" :key="card.cardId">
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
import type { TyreType } from "~/types/pack";

const cardsStore = useCardsStore();
const userStore = useUserStore();

definePageMeta({
  middleware: "auth",
});

const selectedCard = ref<iCard | null>(null);

const formattedTyreType = (tyreType: string) => {
  return tyreType.charAt(0).toUpperCase() + tyreType.slice(1).toLowerCase();
}
</script>

<style lang="scss" scoped>
.tyre-quantity {
  bottom: 0;
  right: 0;
  transform: rotate(-5deg);
}
</style>
