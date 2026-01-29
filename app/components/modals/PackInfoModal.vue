<template>
  <VueFinalModal
    class="flex justify-center items-center"
    :overlay-style="{ backgroundColor: 'rgba(0,0,0,0.9)' }"
    content-class="flex flex-col p-6 bg-gray-600 shadow-inner-custom rounded-lg space-y-4 modal-container"
  >
    <div v-if="pack">
      <p class="font-f1 text-2xl font-bold text-center text-gray-200">{{ pack.packName }}</p>
      <p class="mb-2 text-center italic">Includes {{ pack.cardsIncluded }} card{{ pack.cardsIncluded > 1 ? 's' : ''}}
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
            <span v-if="slot.rarityChances[iCardRarity.COMMON]" class="text-common">Common: {{ slot.rarityChances[iCardRarity.COMMON] }}%</span>
            <span v-if="slot.rarityChances[iCardRarity.UNCOMMON]" class="text-uncommon">Uncommon: {{ slot.rarityChances[iCardRarity.UNCOMMON] }}%</span>
            <span v-if="slot.rarityChances[iCardRarity.RARE]" class="text-rare">Rare: {{ slot.rarityChances[iCardRarity.RARE] }}%</span>
            <span v-if="slot.rarityChances[iCardRarity.LEGENDARY]" class="text-legendary">Legendary: {{ slot.rarityChances[iCardRarity.LEGENDARY] }}%</span>
          </p>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from "vue-final-modal";
import type { iPack } from "~/types/pack";
import { iCardRarity } from '~/types/card';


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
