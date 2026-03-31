<template>
  <div class="bg-gray-900 p-3 rounded">
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
    <div v-if="isOpen" class="mt-4">
      <p class="font-f1 italic text-xs mb-2">Drivers</p>
      <div class="space-y-2">
        <div v-for="card in drivers" :class="`relative border-2 rounded-lg pr-3 overflow-hidden py-2 rarity-${card.rarity.toLowerCase()}`">
          <div class="absolute w-20 transform -left-2 top-2">
            <UserCard :card="card.cardData" :rarity="card.rarity" :level="card.level" hide-user-data hide-card-score />
          </div>
          <div class="pl-20 font-f1 text-sm flex-1">
            <div class="flex items-center w-full justify-between mb-1">
              <p class="text-xs">
                <span class="uppercase">{{ card.cardData.cardName }}</span>
                <span class="opacity-75">&nbsp;(Lvl. {{ card.level }})</span>
              </p>
              <p class="flex items-center tracking-tight">
                <span class="text-xl">{{ card.modifiedFantasyScore }}</span>
                <span class="text-[10px]">&nbsp;PTS</span>
              </p>
            </div>
            <div class="grid grid-flow-col w-full items-center ">
              <div class="flex-1 border-r border-gray-600 pr-2">
                <div class="flex justify-center items-center mb-1">
                  <Icon name="game-icons:stopwatch" class="mr-1 text-lg" />
                  <p v-if="card.realStartingPosition" class="text-xs">(P{{ card.realStartingPosition }})</p>
                </div>
                <p class="flex items-center justify-center">
                  <span>{{ card.fantasyQualScore }}</span>
                  <span class="text-[10px]">&nbsp;PTS</span>
                </p>
              </div>
              <div class="flex-1 border-r border-gray-600 px-2">
                <div class="flex justify-center items-center mb-1">
                  <Icon name="game-icons:checkered-flag" class="mr-1 text-lg" />
                  <p v-if="card.fantasyRaceScore" class="text-xs">(P{{ card.realRacePosition }})</p>
                  <p v-else class="text-xs">(DNF)</p>
                </div>
                <p class="flex items-center justify-center">
                  <span>{{ card.fantasyRaceScore }}</span>
                  <span class="text-[10px]">&nbsp;PTS</span>
                  <span v-if="card.fantasyRaceScore === -5" class="text-xs text-red-400 italic opacity-75">&nbsp;({{ card.finishingStatus }})</span>
                </p>
              </div>
              <div class="flex pl-3 sm:pl-4">
                <div class="text-center">
                  <p>+ {{ Math.round((card.cardModifierValue - 1) * 100) }}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p class="font-f1 italic text-xs mt-6 mb-2">Constructors</p>
      <div class="space-y-2">
        <div v-for="card in constructors" :class="`relative border-2 rounded-lg pr-3 overflow-hidden py-2 rarity-${card.rarity.toLowerCase()}`">
          <div class="absolute w-20 transform -left-2 top-2">
            <UserCard :card="card.cardData" :rarity="card.rarity" :level="card.level" hide-user-data hide-card-score />
          </div>
          <div class="pl-20 font-f1 text-sm flex-1">
            <div class="flex items-center w-full justify-between mb-1">
              <p class="text-xs">
                <span class="uppercase">{{ card.cardData.cardName }}</span>
                <span class="opacity-75">&nbsp;(Lvl. {{ card.level }})</span>
              </p>
              <p class="flex items-center tracking-tight">
                <span class="text-xl">{{ card.modifiedFantasyScore }}</span>
                <span class="text-[10px]">&nbsp;PTS</span>
              </p>
            </div>
            <div class="grid grid-cols-12 items-center gap-2">
              <div class="col-span-9 grid grid-cols-12 items-center gap-y-1 border-r border-gray-600 py-1 pr-2">
                <template v-for="driver in card.driverScores">
                  <div class="col-span-7">
                    <p class="text-xs italic opacity-60">{{ driver.driverName }}:&nbsp;</p>
                  </div>
                  <div class="col-span-5 leading-tight">
                    <p class="col-span-5 flex items-center">
                      <span>{{ driver.totalFantasyPoints }}</span>
                      <span class="text-[10px]">
                        &nbsp;PTS
                      </span>
                    </p>
                    <p v-if="driver.totalFantasyPoints === -5" class="text-xs text-red-400 italic opacity-75">({{ driver.finishingStatus }})</p>
                  </div>
                </template>
              </div>
              <div class="col-span-3 text-center">
                <p>+ {{ Math.round((card.cardModifierValue - 1) * 100) }}%</p>
              </div>
            </div>
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

const isOpen = useState(props.result.raceName, () => false);
const drivers: iCardScore[] = Object.values(props.result.cards).filter((card: iCardScore) => card.cardData.type === CardType.DRIVER).sort((a, b) => a.modifiedFantasyScore > b.modifiedFantasyScore ? -1 : 1)
const constructors: iCardScore[] = Object.values(props.result.cards).filter((card: iCardScore) => card.cardData.type === CardType.CONSTRUCTOR).sort((a, b) => a.modifiedFantasyScore > b.modifiedFantasyScore ? -1 : 1)

const toggleOpen = () => {
  isOpen.value = !isOpen.value;
}
</script>

<style scoped>
.rarity-common {
  @apply border-common;
}

.rarity-uncommon {
  @apply border-uncommon;
}

.rarity-rare {
  @apply border-rare;
}

.rarity-legendary {
  @apply border-legendary;
}
</style>