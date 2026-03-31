<template>
  <VueFinalModal
    class="flex justify-center items-center"
    :overlay-style="{ backgroundColor: 'rgba(0,0,0,0.96)' }"
    content-class="flex flex-col p-10 space-y-4 modal-container"
  >
    <div v-if="card && rarity && props.confirm" class="max-w-md px-4">
      <div class="mb-6 w-52 mx-auto text-white">
        <UserCard :card="card.cardData" :rarity="rarity" :level="card.level" :quantity="card.quantity" />
      </div>
      <p class="font-f1 text-xl text-center text-gray-200 mb-4 px-4">
        Adding <span :class="['font-bold', `text-${enumToText(iCardRarity, card.rarity)}`]">{{ card.cardData.cardName }} - {{ toCamel(enumToText(iCardRarity, rarity)) }}</span> to your collection
      </p>
      <div v-if="userStore.isXCardInUsersCurrentTeam(card.cardData.cardId, card.rarity) && card.quantity === 1" class="mb-4">
        <p class="italic text-sm text-orange-500 text-center">
          This card is currently in your team. If you add it to your collection it will also be removed from your team.
        </p>
      </div>
      <div class="flex justify-center items-center text-center gap-4">
        <div>
          <Button @click="props.close" size="small">Cancel</Button>
        </div>
        <div>
          <Button @click="props.confirm(card.cardData.cardId, rarity)" version="green">Confirm</Button>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from "vue-final-modal";
import { iCardRarity, type iCardInUsersCards } from '@f1pick6/shared/types';

const userStore = useUserStore();

const props = defineProps<{
  card?: iCardInUsersCards | null;
  rarity?: iCardRarity;
  close?: () => void;
  confirm?: (cardId: string, rarity: iCardRarity) => void;
}>();
</script>

<style scoped></style>

<style lang="scss" scoped>
</style>
