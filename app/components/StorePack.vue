<template>
  <div>
    <div 
      class="relative flex shadow-inner-custom border border-gray-700 rounded-lg rotate-"
    >
      <img 
        :src="`/img/pack-${pack.packId}.png`"
        class="absolute top-1/2 w-28 -translate-y-1/2" 
        :class="{
          '-rotate-6': pack.packId === 'normal',
          'rotate-3': pack.packId === 'premium'
        }"
        @error="loadFallbackPackImage($event)"
      >
      <div class="ml-28 w-full p-4">
        <div class="mb-2">
          <div class="font-f1 font-semibold flex justify-between">
            <p>{{ pack.packName }}</p>
            <div class="flex items-center justify-between">
              <img src="/img/coin.svg" >
              <p class="text-yellow-500 ml-1">{{ pack.cost }}</p>
            </div>
          </div>
          <p class="text-sm">Includes <span class="font-semibold text-base">{{ pack.cardsIncluded }}</span> card{{ pack.cardsIncluded > 1 ? 's' : ''}}</p>
        </div>
        <Button
          v-if="userFromStore"
          version="green"
          text-color-class="text-white text-sm"
          :disabled="userFromStore.money < pack.cost"
        >
          Buy pack
        </Button>
      </div>
      <div class="absolute right-2 bottom-2">
        <button @click="openInfo">
          <img src="/img/info.svg" class="w-5">
        </button>
      </div>
    </div>
    <div v-if="infoIsOpen" class="border border-t-0 border-gray-800 mx-4 p-4">
      <div v-for="(slot, i) in pack.slots" :key="i" class="flex space-x-2 text-sm">
        <p class="font-semibold">Card {{ i }}:</p>
        <p v-if="slot.forcedRarity">{{ rarityToStr(slot.forcedRarity) }}</p>
        <p v-else class="flex space-x-2">
          <span v-if="slot.rarityChances[iCardRarity.COMMON]" class="text-gray-500">Common: {{ slot.rarityChances[iCardRarity.COMMON] }}%</span>
          <span v-if="slot.rarityChances[iCardRarity.UNCOMMON]" class="text-blue-300">Uncommon: {{ slot.rarityChances[iCardRarity.UNCOMMON] }}%</span>
          <span v-if="slot.rarityChances[iCardRarity.RARE]" class="text-indigo-600">Rare: {{ slot.rarityChances[iCardRarity.RARE] }}%</span>
          <span v-if="slot.rarityChances[iCardRarity.LEGENDARY]" class="text-amber-400">Legendary: {{ slot.rarityChances[iCardRarity.LEGENDARY] }}%</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { iCardRarity } from '~/types/card';
import type { iPack } from '~/types/pack';
import { loadFallbackPackImage } from "~/utils/loadDefaultImage";

const props = defineProps<{
  pack: iPack;
}>();

const userStore = useUserStore();

const {
  userFromStore,
} = storeToRefs(userStore);
const infoIsOpen = ref(false);

const enumToCamel = <T>(enumObj: T, value: string | number): string => {
  const label = typeof value === 'number' ? (enumObj as any)[value] : value;
  if (!label) return '';
  return String(label).toLowerCase().replace(/^./, c => c.toUpperCase());
};

const rarityToStr = (v: iCardRarity) => enumToCamel(iCardRarity, v);

const openInfo = () => {
  infoIsOpen.value = !infoIsOpen.value;
}

</script>

<style scoped>

</style>