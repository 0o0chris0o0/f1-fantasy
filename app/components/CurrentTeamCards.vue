<template>
  <p class="mb-1">{{type}}s ({{ count }}/3)</p>
  <div class="grid items-start grid-cols-3 gap-4 mb-2">
    <template v-for="(data, key) in cards">
      <CurrentTeamCard 
        v-if="data" 
        :key="`${key}${type}`" 
        :type="type" 
        :data="data"
        :currentRound="currentRound"
        @removeCard="$emit('removeCard', `${key}${type}` as keyof iCurrentTeam)"
      />
      <button 
        v-else
        @click="$emit('beginEditing' , `${key}${type}` as keyof iCurrentTeam)" 
        class="p-2 rounded-lg bg-common"
        :class="{
          'opacity-25': !editMode || editing !== `${key}${type}`,
          'opacity-50': editing === `${key}${type}`,
          'bg-common': key === 'common',
          'bg-uncommon': key === 'uncommon',
          'bg-legendary': key === 'rareLegendary'
        }"
      >
        <BlankCard :rarity="mapRarityFromKey(key)" />
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { iCardRarity, type iCardInUsersCards } from '~/types/card';
import type { iCurrentTeam } from '~/types/user';

const userStore = useUserStore();

const { userObj } = storeToRefs(userStore);

const props = defineProps<{
  type: 'Driver' | 'Constructor';
  editMode: boolean;
  editing: string | null;
  currentRound: number;
  count: number;
}>();


const emit = defineEmits<{
  (e: 'beginEditing', value: keyof iCurrentTeam): void;
  (e: 'removeCard', value: keyof iCurrentTeam): void;
}>();

const cards = computed(() => {
  const keys = ['common', 'uncommon', 'rareLegendary'];
  let returnObj: Record<string, iCardInUsersCards | null | undefined> = {};

  keys.forEach((k) => {
    const realKey = `${k}${props.type}` as keyof iCurrentTeam;

    returnObj[k] = userObj.value?.currentTeam[realKey];
  });

  return returnObj;
})

const mapRarityFromKey = (key: string) => {
  switch (key) {
    case 'common':
      return iCardRarity.COMMON
    case 'uncommon':
      return iCardRarity.UNCOMMON
    case 'rareLegendary':
      return iCardRarity.LEGENDARY
  }
}


</script>

<style scoped>

</style>