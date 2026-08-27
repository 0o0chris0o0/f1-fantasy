<template>
  <div
    v-if="card"
    class="flex items-center gap-4"
    :class="{ 'opacity-20': cardIsInTeam }"
  >
    <div class="w-20">
      <UserCard
        :card="card.cardData"
        :rarity="card.rarity"
        :level="card.level"
        :quantity="card.quantity"
        :in-collection="card.inCollection"
        hide-card-level
        hide-user-data
      />
    </div>
    <div class="grow self-stretch flex flex-col justify-between py-3">
      <div class="flex flex-col">
        <p class="font-f1 font-semibold italic">{{ card.cardData.cardName }}</p>
        <div
          class="flex items-center gap-1 text-xs sm:text-sm text-white font-f1 font-bold"
        >
          <Icon name="bi:stack" />
          <p>x{{ card.quantity }}</p>
          <div class="w-0.5 h-4 mx-1 bg-white opacity-90"></div>
          <div class="text-lg collected-icon">
            <Icon
              v-if="card.inCollection"
              name="lets-icons:book-check-fill"
              :customize="customizeIcon"
            />
            <Icon v-else name="lets-icons:book-check" class="opacity-40" />
          </div>
        </div>
      </div>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <Icon
            name="game-icons:round-star"
            :class="{
              'opacity-20': !getModifierValues().rarityModifier,
              'text-uncommon': card.rarity === iCardRarity.UNCOMMON,
              'text-rare': card.rarity === iCardRarity.RARE,
              'text-legendary': card.rarity === iCardRarity.LEGENDARY,
            }"
          />
          <p
            class="font-headline tracking-tighter font-bold pt-0.5"
            :class="{
              'opacity-20': !getModifierValues().levelModifier,
              'text-uncommon': card.level === 2,
              'text-rare': card.level === 3,
              'text-legendary': card.level === 4,
            }"
          >
            LVL {{ card.level }}
          </p>
          <Icon
            name="game-icons:house"
            :class="{
              'text-green-600': getModifierValues().homeRaceModifier > 0,
              'opacity-20': !getModifierValues().homeRaceModifier,
            }"
          />
          <Icon
            name="game-icons:steering-wheel"
            :class="{
              'text-green-600': getModifierValues().teamMatchModifier > 0,
              'opacity-20': !getModifierValues().teamMatchModifier,
            }"
          />
        </div>
        <p
          class="flex text-sm font-mono"
          :class="{
            'text-common': cardScoreModifier <= 0.2,
            'text-uncommon':
              cardScoreModifier >= 0.3 && cardScoreModifier <= 0.5,
            'text-rare': cardScoreModifier >= 0.6 && cardScoreModifier <= 0.8,
            'text-legendary': cardScoreModifier >= 0.9,
          }"
        >
          <span class="font-bold">+{{ cardScoreModifier * 100 }}%</span>
          &nbsp;Score boost
        </p>
      </div>
    </div>
    <div>
      <button
        @click="onSelectCard"
        :disabled="cardIsInTeam"
        class="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center"
        version="tertiary-outline"
        size="sm"
      >
        <Icon
          :name="cardIsInTeam ? 'bi:check-lg' : 'bi:plus-lg'"
          class="text-2xl text-primary"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { calcCurrentModifierScore, iCardRarity } from "@f1pick6/shared";
import type { iCardInUsersCards } from "@f1pick6/shared/types";

const userStore = useUserStore();

const { userObj } = storeToRefs(userStore);

const props = defineProps<{
  card: iCardInUsersCards;
  currentRound: number;
}>();

const cardIsInTeam = computed(() => isCardInTeam(props.card.cardData.cardId));

const emit = defineEmits<{
  (e: "selectCard", card: iCardInUsersCards): void;
}>();

const customizeIcon = (content: string) => {
  return content
    .replace(/fill="[^"]*"/g, `fill="#84cc16"`) // Change fill color to red
    .replace(/stroke="[^"]*"/g, `stroke="#84cc16"`); // Change stroke color to red
};

const onSelectCard = async () => {
  emit("selectCard", props.card);
};

const isCardInTeam = (cardId: string) => {
  if (!userObj.value?.currentTeam) return false;

  const cardsInTeam = Object.values(userObj.value?.currentTeam)
    .filter((c): c is iCardInUsersCards => c !== null)
    .map((c) => c.cardData.cardId);

  return cardsInTeam.includes(cardId);
};

const cardScoreModifier = computed(() => {
  if (!userObj.value?.currentTeam) return 1;

  return calcCurrentModifierScore(
    props.card,
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
    props.card,
    props.currentRound,
    userObj.value?.currentTeam,
  );
};
</script>

<style lang="scss" scoped></style>
