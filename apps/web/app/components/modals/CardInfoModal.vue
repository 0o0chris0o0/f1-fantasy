<template>
  <UModal class="cursor-pointer" variant="fullscreen">
    <CardFace :card="card" :rarity="rarity" :hide-card-score="hideCardScore" />
    <template #content>
      <div class="absolute top-0 right-0">X</div>
      <div class="w-full flex flex-col gap-6 min-h-0">
        <div class="w-[220px] mx-auto">
          <CardFace
            :card="card"
            :rarity="rarity"
            :hide-card-score="hideCardScore"
          />
        </div>
        <div class="flex-1 rounded-lg overflow-auto">
          <div
            v-if="userDetails"
            class="w-full p-4 bg-surface-container-highest text-white"
          >
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1">
                <Icon name="bi:stack" class="text-sm" />
                <p class="font-mono font-bold text-sm">
                  x{{ userDetails.quantity || 0 }}
                </p>
              </div>
              <template v-if="userDetails.inCollection">
                <div class="flex items-center gap-1">
                  <Icon
                    name="lets-icons:book-check-fill"
                    class="text-sm"
                    :customize="customizeIcon"
                  />
                  <p class="font-mono tracking-tight text-xs">ADDED --</p>
                </div>
              </template>
              <template v-else>
                <div class="flex items-center gap-1 opacity-40">
                  <Icon name="lets-icons:book-check" class="text-sm" />
                  <p class="font-mono tracking-tight text-xs">
                    NOT IN COLLECTION
                  </p>
                </div>
              </template>
              <div v-if="userDetails.inTeam" class="flex items-center">
                <Icon name="game-icons:steering-wheel" class="text-sm" />
              </div>
            </div>
            <p
              class="font-f1 font-bold tracking-wide leading-6 text-2xl uppercase italic my-2"
            >
              {{ card.cardName }}
            </p>
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between text-primary">
                <p class="uppercase font-mono text-xs">AVG FANTASY POINTS:</p>
                <p class="font-f1 font-bold text-xl">
                  {{ card.stats.averageFantasyPoints }}
                </p>
              </div>
              <div
                v-if="isDriverCard(card) && driverStats"
                class="grid grid-cols-2 gap-3 mb-2"
              >
                <div class="p-2 bg-surface-container-high rounded-xl">
                  <p class="uppercase font-mono text-xs">AVG QUAL POS:</p>
                  <p class="text-xl font-bold">
                    {{ driverStats.averageQualifyingPosition }}
                  </p>
                </div>
                <div class="p-2 bg-surface-container-high rounded-xl">
                  <p class="uppercase font-mono text-xs">AVG RACE POS:</p>
                  <p class="text-xl font-bold">
                    {{ driverStats.averageRacePosition }}
                  </p>
                </div>
                <div class="p-2 bg-surface-container-high rounded-xl">
                  <p class="uppercase font-mono text-xs">DNF'S:</p>
                  <p class="text-xl font-bold">
                    {{ driverStats.numberOfDNFs }}
                  </p>
                </div>
              </div>
              <div>
                <p class="text-xl font-bold text-secondary">HOME RACEs:</p>
              </div>
              <p
                v-if="!card.homeRaces.length"
                class="text-center italic opacity-60"
              >
                No Home Races
              </p>
              <div
                v-else
                v-if="isDriverCard(card) && driverStats"
                class="grid grid-cols-1 gap-3"
              >
                <div
                  class="p-2 bg-surface-container-high rounded-xl"
                  v-if="card.homeRaces.length"
                  v-for="race in card.homeRaces"
                >
                  <p class="uppercase font-mono text-sm text-primary">
                    Round {{ race.round }}:
                  </p>
                  <p>{{ race.raceName }}</p>
                  <p class="font-mono text-tertiary">
                    {{ prettyRaceDate(race.raceStart) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CardType, iCardRarity } from "@f1pick6/shared/types";
import type { iConstructorCard, iDriverCard } from "@f1pick6/shared/types";

const {
  card,
  rarity = iCardRarity.COMMON,
  userDetails = {},
} = defineProps<{
  card: iDriverCard | iConstructorCard;
  rarity?: iCardRarity;
  userDetails?: {
    level?: number;
    quantity?: number;
    inCollection?: boolean;
    inTeam?: boolean;
  };
  hideCardScore?: boolean;
}>();

const customizeIcon = (content: string) => {
  return content
    .replace(/fill="[^"]*"/g, `fill="#84cc16"`) // Change fill color to red
    .replace(/stroke="[^"]*"/g, `stroke="#84cc16"`); // Change stroke color to red
};

const isDriverCard = (
  value: iDriverCard | iConstructorCard,
): value is iDriverCard => {
  return value.type === CardType.DRIVER;
};

const driverStats = computed(() => {
  if (isDriverCard(card)) {
    return card.stats;
  }

  return undefined;
});
</script>

<style scoped></style>

<style lang="scss"></style>
