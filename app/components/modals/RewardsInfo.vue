<template>
  <VueFinalModal
    class="flex justify-center items-center"
    :overlay-style="{ backgroundColor: 'rgba(0,0,0,0.97)' }"
    content-class="modal-container"
  >
    <div v-if="rewardObj" class="text-white">
      <p>
        You have received: 
        <span v-if="rewardObj.rewardType === RewardType.COINS">
          {{ rewardObj.key }} Coins
        </span>
        <span v-else-if="rewardObj.rewardType === RewardType.PACK">
          1x {{ rewardObj.key }} pack
        </span>
        <span v-else>
          1x {{ rewardObj.key }} Driver & Constructor card
        </span>
      </p>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from "vue-final-modal";
import { RewardType, type iReward } from "~/types/reward";

const props = defineProps<{
  rewardObj?: iReward
  close?: () => void;
}>();

</script>

<style scoped></style>

<style lang="scss">
</style>
