<template>
  <p class="mb-1">{{ toTitleCase(type) }}s ({{ count }}/3)</p>
  <div class="grid items-start grid-cols-3 gap-4 mb-2">
    <template v-for="(data, key) in cards">
      <CurrentTeamCard
        v-if="data"
        :key="`${key}${type}`"
        :type="props.type"
        :data="data"
        :currentRound="currentRound"
        @removeCard="
          $emit(
            'removeCard',
            `${key}${toTitleCase(type)}` as keyof iCurrentTeam,
          )
        "
      />
      <button
        v-else
        @click="
          $emit(
            'beginEditing',
            `${key}${toTitleCase(type)}` as keyof iCurrentTeam,
          )
        "
        class="p-2 rounded-lg"
        :class="{
          'opacity-25': !editMode || editing !== `${key}${toTitleCase(type)}`,
          'opacity-50': editing === `${key}${toTitleCase(type)}`,
          'bg-uncommon': key === 'uncommon',
          'bg-rare': key === 'rare',
          'bg-legendary': key === 'legendary',
        }"
      >
        <BlankCard :rarity="mapRarityFromKey(key)" :type="type" />
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { iCardRarity } from "@f1pick6/shared/types";
import type {
  iCurrentTeam,
  iCardInUsersCards,
  CardType,
} from "@f1pick6/shared/types";
import { toTitleCase } from "../utils/textFuncs";

const userStore = useUserStore();

const { userObj } = storeToRefs(userStore);

const props = defineProps<{
  type: CardType;
  editMode: boolean;
  editing: string | null;
  currentRound: number;
  count: number;
}>();

const emit = defineEmits<{
  (e: "beginEditing", value: keyof iCurrentTeam): void;
  (e: "removeCard", value: keyof iCurrentTeam): void;
}>();

const cards = computed(() => {
  const keys = ["uncommon", "rare", "legendary"];
  let returnObj: Record<string, iCardInUsersCards | null | undefined> = {};

  keys.forEach((k) => {
    const realKey = `${k}${toTitleCase(props.type)}` as keyof iCurrentTeam;

    returnObj[k] = userObj.value?.currentTeam[realKey];
  });

  return returnObj;
});

const mapRarityFromKey = (key: string) => {
  switch (key) {
    case "uncommon":
      return iCardRarity.UNCOMMON;
    case "rare":
      return iCardRarity.RARE;
    case "legendary":
      return iCardRarity.LEGENDARY;
  }
};
</script>

<style scoped></style>
