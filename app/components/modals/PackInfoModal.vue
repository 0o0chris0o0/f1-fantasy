<template>
  <VueFinalModal
    class="flex justify-center items-center"
    :overlay-style="{ backgroundColor: 'rgba(0,0,0,0.9)' }"
    content-class="flex flex-col py-4 px-4 bg-gray-200 shadow-inner-custom rounded-lg space-y-4 modal-container"
  >
    <div v-if="pack">
      <p class="font-f1 text-lg">{{ pack.packName }}</p>
      <p class="mb-2">Includes {{ pack.cardsIncluded }} card{{ pack.cardsIncluded > 1 ? 's' : ''}}
      </p>
      <div v-for="(slot, i) in pack.slots" :key="i" class="flex space-x-2 text-sm">
        <p class="font-semibold">Card {{ i }}:</p>
        <p v-if="slot.forcedRarity">{{ toCamel(enumToText(iCardRarity, slot.forcedRarity)) }}</p>
        <p v-else class="flex space-x-2">
          <span v-if="slot.rarityChances[iCardRarity.COMMON]" class="text-gray-500">Common: {{ slot.rarityChances[iCardRarity.COMMON] }}%</span>
          <span v-if="slot.rarityChances[iCardRarity.UNCOMMON]" class="text-blue-300">Uncommon: {{ slot.rarityChances[iCardRarity.UNCOMMON] }}%</span>
          <span v-if="slot.rarityChances[iCardRarity.RARE]" class="text-indigo-600">Rare: {{ slot.rarityChances[iCardRarity.RARE] }}%</span>
          <span v-if="slot.rarityChances[iCardRarity.LEGENDARY]" class="text-amber-400">Legendary: {{ slot.rarityChances[iCardRarity.LEGENDARY] }}%</span>
        </p>
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

<style lang="scss" scoped></style>
