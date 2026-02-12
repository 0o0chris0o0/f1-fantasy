<template>
  <VueFinalModal
    class="flex justify-center items-center"
    :overlay-style="{ backgroundColor: 'rgba(0,0,0,0.96)' }"
    content-class="flex flex-col p-10 space-y-4 modal-container"
  >
    <div v-if="card && rarity && props.confirm">
      <div class="mb-6 w-52 mx-auto">
        <Card :card=card :rarity="rarity"/>
      </div>
      <p class="font-f1 text-xl font-semibold text-center text-gray-200 mb-4">Adding {{ card.cardName }} to your collection</p>
      <div class="grid grid-cols-1 text-center gap-4">
        <div>
          <Button @click="props.confirm(card.cardId, rarity)" version="green">Confirm</Button>
        </div>
        <div>
          <Button @click="props.close" size="small">Cancel</Button>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from "vue-final-modal";
import { iCardRarity, type iConstructorCard, type iDriverCard } from '~/types/card';

const props = defineProps<{
  card?: iDriverCard | iConstructorCard | null;
  rarity?: iCardRarity;
  close?: () => void;
  confirm?: (cardId: string, rarity: iCardRarity) => void;
}>();
</script>

<style scoped></style>

<style lang="scss" scoped>
</style>
