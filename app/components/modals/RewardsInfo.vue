<template>
  <VueFinalModal
    class="flex justify-center items-center"
    :overlay-style="{ backgroundColor: 'rgba(0,0,0,0.97)' }"
    content-class="modal-container"
  >
    <div v-if="rewardObj" class="text-white text-center px-6">
      <img 
        v-if="rewardObj.rewardType === RewardType.PACK"
        :src="`/img/pack-${rewardObj.key}.png`" class="w-32 mx-auto mb-6 rotate-card"
      />
      <div v-if="rewardObj.rewardType === RewardType.CARDS" class="grid grid-cols-2 gap-4 mb-6">
        <UserCard 
          v-for="card in rewardCards" 
          :card="card.loot.cardData" 
          :rarity="card.loot.rarity"
          :isNew="card.isNew"
          hide-user-data
          class="w-32 mx-auto" 
        />
      </div>
      <Icon 
        v-if="rewardObj.rewardType === RewardType.COINS" 
        name="bi:cash-coin" 
        class="text-yellow-500 w-14 h-14 mx-auto mb-4"
      />

      <p class="mb-6 font-f1 text-xl">
        You have received:<br/>
        <span 
          class="font-bold text-2xl"
          :class="{ 
            'text-amber-500': rewardObj.rewardType === RewardType.COINS || rewardObj.rewardType === RewardType.PACK,
            'text-uncommon': rewardObj.rewardType === RewardType.CARDS && rewardObj.key === iCardRarity.UNCOMMON,
            'text-rare': rewardObj.rewardType === RewardType.CARDS && rewardObj.key === iCardRarity.RARE,
            'text-legendary': rewardObj.rewardType === RewardType.CARDS && rewardObj.key === iCardRarity.LEGENDARY,
            'text-mythic': rewardObj.rewardType === RewardType.CARDS && rewardObj.key === iCardRarity.MYTHIC
          }"
        >
          <template v-if="rewardObj.rewardType === RewardType.COINS">
            {{ rewardObj.key }} Coins
          </template>
          <template v-else-if="rewardObj.rewardType === RewardType.PACK">
            1x {{ rewardObj.rewardName }} pack
          </template>
          <template v-else>
            1x {{ rewardObj.key }} Driver & Constructor card
          </template>
        </span>
      </p>
      <div class="text-center">
        <Button @click="close" size="small">Close</Button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from "vue-final-modal";
import { iCardRarity } from "~/types/card";
import type { iLoot } from "~/types/loot";
import { RewardType, type iReward } from "~/types/reward";

const props = defineProps<{
  rewardObj?: iReward;
  rewardCards?: iLoot[];
  close?: () => void;
}>();

</script>

<style scoped></style>

<style lang="scss">
.rotate-card {
  animation: wiggle 1.5s ease-in-out infinite;
  transform-origin: top center;
}

@keyframes wiggle {
  /* Movement now takes up half the time (0% to 50%) */
  0% { transform: translateX(0); }
  10% { transform: translateX(-4px) rotate(-2deg); }
  20% { transform: translateX(4px) rotate(2deg); }
  30% { transform: translateX(-4px) rotate(-2deg); }
  40% { transform: translateX(4px) rotate(2deg); }
  50% { transform: translateX(0); }

  /* Shorter pause (50% to 100%) */
  100% { transform: translateX(0); }
}
</style>
