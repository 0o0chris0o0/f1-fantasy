<template>
  <UModal
    :close="{
      color: 'primary',
      size: 'xl',
      class: 'p-0',
    }"
    close-icon="material-symbols:close"
  >
    <CardFace :card="card" :rarity="rarity" :hide-card-score="hideCardScore" />
    <template #body>
      <div class="w-full flex flex-col gap-6 min-h-0">
        <div class="w-55 mx-auto">
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
              <template v-if="userDetails.inCollection">
                <div class="flex items-center gap-1">
                  <Icon
                    name="lets-icons:book-check-fill"
                    class="text-sm"
                    :customize="customizeIcon"
                  />
                  <p class="font-mono tracking-tight text-xs text-legendary">
                    ADDED --
                  </p>
                </div>
              </template>
              <template v-else>
                <div class="flex items-center gap-1 opacity-40">
                  <Icon name="lets-icons:book-check" class="text-xs" />
                  <p class="font-mono tracking-tight text-xs">
                    NOT IN COLLECTION
                  </p>
                </div>
              </template>
              <div
                v-if="userDetails.inTeam"
                class="flex items-center gap-1 text-green-600"
              >
                <Icon name="game-icons:steering-wheel" class="text-xs" />
                <p class="font-mono tracking-tight text-xs font-bold">
                  IN TEAM
                </p>
              </div>
            </div>

            <p
              class="font-f1 font-bold tracking-wide leading-6 text-2xl uppercase italic my-2"
            >
              {{ card.cardName }}
            </p>

            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <Icon name="bi:stack" class="text-sm" />
                <p class="font-mono font-bold">
                  x{{ userDetails.quantity || 0 }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <div v-if="userDetails.level" class="flex items-end gap-1">
                  <div
                    v-for="i in 4"
                    :key="i"
                    class="w-1.5"
                    :class="[
                      i <= userDetails.level ? 'bg-secondary' : 'bg-gray-400',
                      {
                        'h-2': i === 1,
                        'h-2.5': i === 2,
                        'h-3': i === 3,
                        'h-3.5': i === 4,
                      },
                    ]"
                  ></div>
                </div>
                <p class="font-bold font-headline">
                  LVL {{ userDetails.level }} ({{ userDetails.xp }} Race{{
                    userDetails.xp === 1 ? "" : "s"
                  }})
                </p>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between text-primary">
                <p class="uppercase font-mono text-xs">AVG FANTASY POINTS:</p>
                <p class="font-f1 font-bold text-xl">
                  {{ card.stats.averageFantasyPoints }}
                  <span class="text-xs">PTS</span>
                </p>
              </div>
              <div
                v-if="isDriverCard(card) && driverStats"
                class="grid grid-cols-2 gap-3 mb-2"
              >
                <div class="py-2 px-3 bg-surface-container-high rounded-xl">
                  <p class="uppercase font-mono text-xs">AVG QUAL POS:</p>
                  <p class="font-f1 text-xl font-bold">
                    {{
                      driverStats.averageQualifyingPosition
                        ? `P${driverStats.averageQualifyingPosition}`
                        : "N/A"
                    }}
                  </p>
                </div>
                <div class="py-2 px-3 bg-surface-container-high rounded-xl">
                  <p class="uppercase font-mono text-xs">AVG RACE POS:</p>
                  <p class="font-f1 text-xl font-bold">
                    {{
                      driverStats.averageRacePosition
                        ? `P${driverStats.averageRacePosition}`
                        : "N/A"
                    }}
                  </p>
                </div>
                <div class="py-2 px-3 bg-surface-container-high rounded-xl">
                  <p class="uppercase font-mono text-xs">DNF'S:</p>
                  <p class="font-f1 text-xl font-bold">
                    {{ driverStats.numberOfDNFs }}
                  </p>
                </div>
              </div>
              <p
                v-if="!card.homeRaces.length"
                class="text-center italic opacity-60"
              >
                No Home Races
              </p>
              <div v-else class="grid grid-cols-1 gap-3">
                <div>
                  <p class="font-headline text-xl font-bold text-secondary/80">
                    Home Races
                    <span class="text-xs"
                      >- Current Round: {{ currentRound }}</span
                    >
                  </p>
                </div>
                <div
                  v-if="card.homeRaces.length"
                  v-for="race in card.homeRaces"
                  class="px-4 py-3 bg-surface-container-high rounded-xl"
                  :class="{
                    'border border-tertiary': race.round === currentRound,
                  }"
                >
                  <p
                    class="uppercase font-mono text-primary"
                    :class="{ 'font-bold': race.round === currentRound }"
                  >
                    <span class="text-sm">Round {{ race.round }}:&nbsp;</span>
                  </p>
                  <p class="font-f1">{{ race.raceName }}</p>
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
    xp?: number;
    quantity?: number;
    inCollection?: boolean;
    inTeam?: boolean;
  };
  hideCardScore?: boolean;
}>();

const roundInfo = await useRoundInfo();
const currentRound = computed(() => roundInfo.value?.currentRound);

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
