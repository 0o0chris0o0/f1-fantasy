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
      <div
        :class="{
          'text-uncommon': rewardObj.key === iCardRarity.UNCOMMON,
        }"
      >
        <Icon name="streamline:cards-solid" class="w-12 h-12 mx-auto mb-2" />
        <p class="font-f1 font-bold text-xs">
          1x {{ toTitleCase(rewardObj.key as string) }} Driver & Constructor
        </p>
      </div>
    </template>
    <template v-if="rewardObj.rewardType === RewardType.PACK">
      <img :src="`/img/${rewardObj.key}-pack.png`" class="w-12 mb-2 mx-auto" />
      <p class="font-f1 font-bold text-xs">
        1x {{ toTitleCase(rewardObj.key as string) }} Pack
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { iCardRarity, RewardType, type iReward } from "@f1pick6/shared/types";

const props = defineProps<{
  rewardObj?: iReward;
}>();
</script>

<style scoped></style>
