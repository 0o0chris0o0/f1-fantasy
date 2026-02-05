<template>
  <VueFinalModal
    class="flex justify-center items-center"
    :overlay-style="{ backgroundColor: 'rgba(0,0,0,0.96)' }"
    content-class="flex flex-col p-10 space-y-4 modal-container"
  >
    <div v-if="pack">
      <div class="mb-6">
        <ClientOnly>
          <img 
            :src="`/img/pack-${pack.packId}.png`"
            class="" 
            @error="loadFallbackPackImage($event)"
          >
        </ClientOnly>
      </div>
      <p class="font-f1 text-2xl font-bold text-center text-gray-200 mb-4">{{ pack.packName }}</p>
      <div class="grid grid-cols-1 text-center gap-4">
        <div>
          <NuxtLink :to="`/open-pack?packId=${pack.packId}`">
            <Button @click="props.close" version="green">Open Now</Button>
          </NuxtLink>
        </div>
        <div>
          <Button @click="props.close" size="small">Close</Button>
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
</style>
