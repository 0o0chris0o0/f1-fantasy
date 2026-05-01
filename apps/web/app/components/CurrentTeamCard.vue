<template>
  <div>
    <UserCard
      :card="data.cardData"
      :rarity="data.rarity"
      :quantity="data.quantity"
      :level="data.level"
      :xp="data.xp"
    />
    <div v-if="userObj" class="mt-1 text-center">
      <div class="inline-block py-1 px-2 rounded-lg bg-black">
        <button @click="toggleModifierInfo">
          <p class="flex text-xs font-f1 items-baseline underline">
            <span :style="{}"> + </span>
            <span :style="{}"> {{ cardScoreModifier * 100 }}% </span>
            <span>&nbsp;Boost</span>
          </p>
        </button>
      </div>
    </div>
    <div
      class="flex flex-col gap-1 justify-center items-center uppercase font-semibold pt-2"
      v-if="showModifierInfo"
    >
      <div class="grid grid-cols-12 gap-1">
        <div class="col-span-3">
          <Icon
            name="game-icons:round-star"
            :class="{
              'opacity-20': !getModifierValues().rarityModifier,
              'text-uncommon': data.rarity === iCardRarity.UNCOMMON,
              'text-rare': data.rarity === iCardRarity.RARE,
              'text-legendary': data.rarity === iCardRarity.LEGENDARY,
            }"
          />
        </div>
        <div class="col-span-5">
          <p class="pt-0.5 text-xs">Rarity:</p>
        </div>
        <div class="col-span-4">
          <p class="pt-0.5 text-xs">
            {{ `+${getModifierValues().rarityModifier * 100}%` }}
          </p>
        </div>

        <div class="col-span-3">
          <p
            class="text-xs font-semibold"
            :class="{
              'opacity-20': !getModifierValues().levelModifier,
            }"
          >
            XP
          </p>
        </div>
        <div class="col-span-5">
          <p class="text-xs">Level:</p>
        </div>
        <div class="col-span-4">
          <p class="text-xs">
            {{ `+${getModifierValues().levelModifier * 100}%` }}
          </p>
        </div>

        <div class="col-span-3">
          <Icon
            name="game-icons:house"
            :class="{
              'text-green-600': getModifierValues().homeRaceModifier > 0,
              'opacity-20': !getModifierValues().homeRaceModifier,
            }"
          />
        </div>
        <div class="col-span-5">
          <p class="text-xs">Home:</p>
        </div>
        <div class="col-span-4">
          <p class="text-xs">
            {{ `+${getModifierValues().homeRaceModifier * 100}%` }}
          </p>
        </div>

        <div class="col-span-3">
          <Icon
            name="game-icons:steering-wheel"
            :class="{
              'text-green-600': getModifierValues().teamMatchModifier > 0,
              'opacity-20': !getModifierValues().teamMatchModifier,
            }"
          />
        </div>
        <div class="col-span-5">
          <p class="text-xs">Team:</p>
        </div>
        <div class="col-span-4">
          <p class="text-xs">
            {{ `+${getModifierValues().teamMatchModifier * 100}%` }}
          </p>
        </div>
      </div>
    </div>
    <div class="text-center">
      <button
        @click="$emit('removeCard')"
        class="mx-auto text-xs underline text-red-600 font-bold"
      >
        REMOVE
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { calcCurrentModifierScore } from "@f1pick6/shared/utils";
import {
  CardType,
  iCardRarity,
  type iCardInUsersCards,
} from "@f1pick6/shared/types";

const props = defineProps<{
  type: CardType;
  data: iCardInUsersCards;
  currentRound: number;
}>();

const userStore = useUserStore();
const { userObj } = storeToRefs(userStore);
const showModifierInfo = ref(false);

const cardScoreModifier = computed(() => {
  if (!userObj.value?.currentTeam) return 1;

  return calcCurrentModifierScore(
    props.data,
    props.currentRound,
    userObj.value?.currentTeam,
  ).totalScoreModifier;
});

const getModifierValues = () => {
  if (!userObj.value?.currentTeam)
    return {
      rarityModifier: 0,
      levelModifier: 0,
      homeRaceModifier: 0,
      teamMatchModifier: 0,
    };

  return calcCurrentModifierScore(
    props.data,
    props.currentRound,
    userObj.value?.currentTeam,
  );
};

const toggleModifierInfo = () => {
  showModifierInfo.value = !showModifierInfo.value;
};
</script>

<style scoped></style>
