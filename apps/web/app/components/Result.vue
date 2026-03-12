<template>
  <div class="bg-gray-900 p-4 rounded">
    <button class="w-full text-left font-f1 flex gap-4 items-center" @click="toggleOpen">
      <span class="underline text-sm">Round {{ result.round }}<br/> {{ result.raceName }}</span>
      <span class="mx-auto font-semibold">{{ result.totalModifiedScore }} Pts</span>
      <Icon 
        name="material-symbols:arrow-drop-up-rounded" 
        :class="[
          'text-2xl',
          {
            'rotate-180': !isOpen
          }
        ]"
      />
    </button>
    <div v-if="isOpen" class="mt-6">
      <p class="font-f1 italic text-xs mb-2">Drivers</p>
      <div class="space-y-2">
        <div v-for="card in drivers" class="grid grid-cols-12 gap-2 items-center">
          <div class="col-span-2">
            <UserCard :card="card.cardData" :rarity="card.rarity" :level="card.level" hide-user-data hide-card-score />
          </div>
          <div class="col-span-6 flex-1 text-xs">
            <p class="font-f1">{{ card.cardData.cardName }}</p>
            <p class="opacity-50">Level {{card.level}} +{{ Math.round((card.cardModifierValue - 1) * 100) }}%</p>
            <p class="flex items-center gap-1">
              <span v-if="card.realStartingPosition" class="text-xs">Qualified P{{ card.realStartingPosition }} - </span>
              <span v-else class="text-xs">Did not qualify - </span>
              <span class="">{{ card.fantasyQualScore }}Pts</span>
            </p>
            <p class="flex items-center gap-1">
              <span v-if="card.realRacePosition" class="text-xs">Finished P{{ card.realRacePosition }} - </span>
              <span v-else class="text-xs">DNF - </span>
              <span class="">{{ card.fantasyRaceScore }}Pts</span>
            </p>
          </div>
          <div class="col-span-3">
            <span class="text-3xl font-bold">{{ card.modifiedFantasyScore }}Pts</span>
          </div>
        </div>
      </div>

      <p class="font-f1 italic text-xs mt-4 mb-2">Constructors</p>
      <div class="space-y-2">
        <div v-for="card in constructors" class="grid grid-cols-12 gap-2 items-center">
          <div class="col-span-2">
            <UserCard :card="card.cardData" :rarity="card.rarity" :level="card.level" hide-user-data hide-card-score />
          </div>
          <div class="col-span-6 flex-1 text-xs">
            <p class="font-f1">{{ card.cardData.cardName }}</p>
            <p class="opacity-50">Level {{card.level}} +{{ Math.round((card.cardModifierValue - 1) * 100) }}%</p>
            <p>Qualifying</p>
            <div class="flex gap-2 items-center">
              <p v-for="driverScore in card.driverScores">
                P{{ driverScore.raceStartPosition }} ({{ driverScore.qualFantasyPoints }}Pts)
              </p>
            </div>
            <p>Race</p>
            <div class="flex gap-2 items-center">
              <p v-for="driverScore in card.driverScores">
                <span v-if="driverScore.dnf">DNF</span>
                <span v-else>P{{ driverScore.raceEndPosition }}</span> 
                ({{ driverScore.raceFantasyPoints }}Pts)
              </p>
            </div>
          </div>
          <div class="col-span-3">
            <span class="text-3xl font-bold">{{ card.modifiedFantasyScore }}Pts</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { CardType, type iCardScore, type iResult } from '@f1pick6/shared';

const props = defineProps<{
  result: iResult
}>();

const isOpen = useState(() => false);
const drivers: iCardScore[] = Object.values(props.result.cards).filter((card: iCardScore) => card.cardData.type === CardType.DRIVER)
const constructors: iCardScore[] = Object.values(props.result.cards).filter((card: iCardScore) => card.cardData.type === CardType.CONSTRUCTOR)

const toggleOpen = () => {
  isOpen.value = !isOpen.value;
}
</script>

<style scoped>

</style>