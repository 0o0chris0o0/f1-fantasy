<template>
  <UModal
    v-if="!disableModal"
    class="cursor-pointer"
    :ui="{
      overlay: 'bg-gray-900',
      content: 'w-auto',
    }"
  >
    <CardFace :card="card" :rarity="rarity" :hide-card-score="hideCardScore" />
    <template #content>
      <div class="w-96">
        <CardFace
          :card="card"
          :rarity="rarity"
          :hide-card-score="hideCardScore"
        />
      </div>
    </template>
  </UModal>
  <CardFace
    v-else
    :card="card"
    :rarity="rarity"
    :hide-card-score="hideCardScore"
  />
</template>

<script setup lang="ts">
import { iCardRarity } from "@f1pick6/shared/types";
import type { iConstructorCard, iDriverCard } from "@f1pick6/shared/types";

const { rarity = iCardRarity.COMMON, disableModal = false } = defineProps<{
  card: iDriverCard | iConstructorCard;
  rarity?: iCardRarity;
  hideCardScore?: boolean;
  disableModal?: boolean;
}>();
</script>
