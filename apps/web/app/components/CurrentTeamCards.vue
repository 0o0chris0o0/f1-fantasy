<template>
  <div class="grid items-start grid-cols-2 gap-4 mb-2">
    <template v-for="slotKey in slotKeys">
      <CurrentTeamCard
        v-if="cards[slotKey]"
        :key="slotKey"
        :data="cards[slotKey]"
        :currentRound="currentRound"
        @removeCard="$emit('removeCard', slotKey)"
      />
      <button
        v-else
        @click="$emit('beginEditing', slotKey)"
        class="border-2 border-dashed rounded-lg aspect-3/4 flex flex-col items-center justify-center bg-surface-container-lowest/30 p-4"
        :class="{
          'opacity-50': !editMode || editing !== slotKey,
          'opacity-75': editing === slotKey,
          'border-uncommon': slotRarity(slotKey) === 'uncommon',
          'border-rare': slotRarity(slotKey) === 'rare',
          'border-legendary': slotRarity(slotKey) === 'legendary',
        }"
      >
        <div
          class="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-3"
        >
          <Icon name="bi:plus-lg" class="text-primary text-2xl" />
        </div>
        <p class="font-mono text-sm tracking-tighter text-on-surface-variant">
          SELECT CARD
        </p>
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { iCurrentTeam, iCardInUsersCards } from "@f1pick6/shared/types";

const userStore = useUserStore();

const { userObj } = storeToRefs(userStore);

const props = defineProps<{
  editMode: boolean;
  editing: string | null;
  currentRound: number;
}>();

const emit = defineEmits<{
  (e: "beginEditing", value: keyof iCurrentTeam): void;
  (e: "removeCard", value: keyof iCurrentTeam): void;
}>();

const emptyCurrentTeam: iCurrentTeam = {
  legendarySlot_a: null,
  legendarySlot_b: null,
  rareSlot_a: null,
  rareSlot_b: null,
  uncommonSlot_a: null,
  uncommonSlot_b: null,
};

const slotKeys: (keyof iCurrentTeam)[] = [
  "legendarySlot_a",
  "legendarySlot_b",
  "rareSlot_a",
  "rareSlot_b",
  "uncommonSlot_a",
  "uncommonSlot_b",
];

const cards = computed<iCurrentTeam>(() => {
  return userObj.value?.currentTeam ?? emptyCurrentTeam;
});

const slotRarity = (slotKey: keyof iCurrentTeam) => {
  if (slotKey.startsWith("uncommon")) return "uncommon";
  if (slotKey.startsWith("rare")) return "rare";
  if (slotKey.startsWith("legendary")) return "legendary";
  return "uncommon";
};
</script>

<style scoped></style>
