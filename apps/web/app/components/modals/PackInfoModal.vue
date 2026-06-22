<template>
  <UModal
    :ui="{
      overlay: 'bg-gray-900/75',
    }"
  >
    <template #content>
      <div v-if="pack" class="p-6 bg-gray-800 text-white">
        <p class="font-f1 text-2xl font-bold text-center">
          {{ pack.packName }}
        </p>
        <p class="mb-2 text-center italic text-sm">
          Includes {{ pack.cardsIncluded }} card{{
            pack.cardsIncluded > 1 ? "s" : ""
          }}
        </p>
        <div
          v-for="(slot, i) in pack.slots"
          :key="i"
          class="text-sm gap-1 rarity-grid"
        >
          <div class="w-14">
            <p class="font-semibold">Card {{ i }}:</p>
          </div>
          <div>
            <p
              v-if="slot.forcedRarity"
              :class="{
                'text-common': slot.forcedRarity === iCardRarity.COMMON,
                'text-uncommon': slot.forcedRarity === iCardRarity.UNCOMMON,
                'text-rare': slot.forcedRarity === iCardRarity.RARE,
                'text-legendary': slot.forcedRarity === iCardRarity.LEGENDARY,
              }"
            >
              {{ toCamel(slot.forcedRarity) }}
            </p>
            <p v-else class="flex space-x-2">
              <span
                v-if="slot.rarityChances[iCardRarity.COMMON]"
                class="text-common"
                >{{ slot.rarityChances[iCardRarity.COMMON] }}% Common</span
              >
              <span
                v-if="slot.rarityChances[iCardRarity.UNCOMMON]"
                class="text-uncommon"
                >{{ slot.rarityChances[iCardRarity.UNCOMMON] }}% Uncommon</span
              >
              <span
                v-if="slot.rarityChances[iCardRarity.RARE]"
                class="text-rare"
                >{{ slot.rarityChances[iCardRarity.RARE] }}% Rare</span
              >
              <span
                v-if="slot.rarityChances[iCardRarity.LEGENDARY]"
                class="text-legendary"
                >{{ slot.rarityChances[iCardRarity.LEGENDARY] }}%
                Legendary</span
              >
            </p>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { iPack } from "@f1pick6/shared/types";
import { iCardRarity } from "@f1pick6/shared/types";

const props = defineProps<{
  pack?: iPack | null;
}>();
</script>

<style scoped></style>

<style lang="scss" scoped>
.rarity-grid {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
}
</style>
