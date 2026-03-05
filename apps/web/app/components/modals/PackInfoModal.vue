<template>
  <VueFinalModal
    class="flex justify-center items-center"
    :overlay-style="{ backgroundColor: 'rgba(0,0,0,0.97)' }"
    content-class="text-gray-200 modal-container"
  >
    <div v-if="pack">
      <button class="absolute top-1 right-1" @click="close">
        <Icon name="ic:outline-close" color="white" class="text-4xl" />
      </button>
      <p class="font-f1 text-2xl font-bold text-center">{{ pack.packName }}</p>
      <p class="mb-2 text-center italic text-sm">Includes {{ pack.cardsIncluded }} card{{ pack.cardsIncluded > 1 ? 's' : ''}}
      </p>
      <div v-for="(slot, i) in pack.slots" :key="i" class="text-sm gap-1 rarity-grid">
        <div class="w-14">
          <p class="font-semibold">Card {{ i }}:</p>
        </div>
        <div>
          <p v-if="slot.forcedRarity" :class="{
            'text-common': slot.forcedRarity === iCardRarity.COMMON,
            'text-uncommon': slot.forcedRarity === iCardRarity.UNCOMMON,
            'text-rare': slot.forcedRarity === iCardRarity.RARE,
            'text-legendary': slot.forcedRarity === iCardRarity.LEGENDARY,
          }">
            {{ toCamel(slot.forcedRarity) }}
          </p>
          <p v-else class="flex space-x-2">
            <span v-if="slot.rarityChances[iCardRarity.COMMON]" class="text-common">{{ slot.rarityChances[iCardRarity.COMMON] }}% Common</span>
            <span v-if="slot.rarityChances[iCardRarity.UNCOMMON]" class="text-uncommon">{{ slot.rarityChances[iCardRarity.UNCOMMON] }}% Uncommon</span>
            <span v-if="slot.rarityChances[iCardRarity.RARE]" class="text-rare">{{ slot.rarityChances[iCardRarity.RARE] }}% Rare</span>
            <span v-if="slot.rarityChances[iCardRarity.LEGENDARY]" class="text-legendary">{{ slot.rarityChances[iCardRarity.LEGENDARY] }}% Legendary</span>
          </p>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from "vue-final-modal";
import type { iPack } from "@f1pick6/shared";
import { iCardRarity } from '@f1pick6/shared';


const props = defineProps<{
  pack?: iPack | null;
  close?: () => void;
}>();


</script>

<style scoped></style>

<style lang="scss" scoped>
.rarity-grid {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
}

</style>
