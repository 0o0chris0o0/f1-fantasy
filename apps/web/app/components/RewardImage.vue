<template>
  <div v-if="rewardObj">
    <template v-if="rewardObj.rewardType === RewardType.COINS">
      <Icon
        name="bi:cash-coin" 
        class="text-yellow-500 w-14 h-14 mx-auto mb-0.5"
      />
      <p class="text-yellow-500 font-f1 font-bold">x{{ rewardObj.key }}</p>
    </template>
    <template v-if="rewardObj.rewardType === RewardType.CARDS">
      <!-- TODO: add blank card images -->
    </template>
    <template v-if="rewardObj.rewardType === RewardType.PACK">
      <img 
        :src="`/img/pack-${rewardObj.key}.png`"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { RewardType, type iReward } from '@f1pick6/shared/types';

const props = defineProps<{
  rewardObj?: iReward;
}>();
</script>

<style scoped>

</style>