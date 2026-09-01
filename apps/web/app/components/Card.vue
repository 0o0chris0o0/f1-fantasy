<template>
  <CardInfoModal
    v-if="!disableModal"
    :card="card"
    :rarity="rarity"
    :userDetails="userDetails"
    :hide-card-score="hideCardScore"
  />
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
import CardInfoModal from "./modals/CardInfoModal.vue";

const {
  card,
  rarity = iCardRarity.COMMON,
  disableModal = false,
  hideCardScore = false,
  userDetails = {},
} = defineProps<{
  card: iDriverCard | iConstructorCard;
  rarity?: iCardRarity;
  userDetails?: {
    level?: number;
    xp?: number;
    quantity?: number;
    inCollection?: boolean;
    inTeam?: boolean;
  };
  hideCardScore?: boolean;
  disableModal?: boolean;
}>();
</script>
