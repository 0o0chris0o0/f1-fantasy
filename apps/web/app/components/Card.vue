<template>
  <UModal
    v-if="!disableModal"
    class="cursor-pointer"
    :ui="{
      content: 'border-0 ring-0 bg-transparent',
    }"
  >
    <CardFace :card="card" :rarity="rarity" :hide-card-score="hideCardScore" />
    <template #content>
      <div
        class="max-w-full"
        :class="{
          'w-96': !userDetails,
          'w-80': userDetails,
        }"
      >
        <CardFace
          :card="card"
          :rarity="rarity"
          :hide-card-score="hideCardScore"
        />
      </div>
      <div
        v-if="userDetails"
        class="p-4 bg-surface-container-highest rounded-lg mt-2 text-white"
      >
        <div class="grid grid-cols-2">
          <div>
            <p>Average Fantasy Points: {{ card.stats.averageFantasyPoints }}</p>
            <p>DNF's: {{ card.stats.numberOfDNFs }}</p>
          </div>
          <div>
            <p>Quantity: {{ userDetails.quantity || 0 }}</p>
            <p>Level: {{ userDetails.level || 0 }}</p>
            <p>In Collection: {{ userDetails.inCollection ? "Yes" : "No" }}</p>
            <p>In Team: {{ userDetails.inTeam ? "Yes" : "No" }}</p>
          </div>
        </div>
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
import CardFace from "./CardFace.vue";

const {
  rarity = iCardRarity.COMMON,
  disableModal = false,
  hideCardScore = false,
  userDetails = {},
} = defineProps<{
  card: iDriverCard | iConstructorCard;
  rarity?: iCardRarity;
  userDetails?: {
    level?: number;
    quantity?: number;
    inCollection?: boolean;
    inTeam?: boolean;
  };
  hideCardScore?: boolean;
  disableModal?: boolean;
}>();

const customizeIcon = (content: string) => {
  return content
    .replace(/fill="[^"]*"/g, `fill="#84cc16"`) // Change fill color to red
    .replace(/stroke="[^"]*"/g, `stroke="#84cc16"`); // Change stroke color to red
};
</script>
