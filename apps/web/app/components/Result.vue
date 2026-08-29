<template>
  <div class="rounded-lg overflow-hidden glass-panel">
    <button
      class="w-full bg-surface-container-low text-left font-headline flex gap-4 items-center p-3"
      @click="toggleOpen"
      :class="{ 'bg-surface-container-highest': isOpen }"
    >
      <div class="flex flex-col">
        <span class="font-mono uppercase text-primary text-sm">
          Round {{ result.round }}
        </span>
        <span class="font-bold">{{ result.raceName }}</span>
      </div>
      <div class="flex items-baseline gap-2 font-mono ml-auto">
        <span class="mx-auto font-semibold text-xl">{{
          result.totalModifiedScore
        }}</span>
        <span class="text-primary text-sm">PTS</span>
      </div>
      <Icon
        name="material-symbols:arrow-drop-up-rounded"
        :class="[
          'text-2xl',
          {
            'rotate-180': !isOpen,
          },
        ]"
      />
    </button>
    <div v-if="isOpen" class="bg-carbon flex flex-col gap-4 p-2">
      <div>
        <p
          class="font-headline tracking-widest text-primary uppercase italic font-bold text-sm mb-2"
        >
          Drivers
        </p>
        <div class="space-y-2">
          <div
            v-for="card in drivers"
            class="bg-surface-container-low border rounded-lg flex"
            :class="[
              {
                'border-common/60': card.rarity === iCardRarity.COMMON,
                'border-uncommon/60': card.rarity === iCardRarity.UNCOMMON,
                'border-rare/60 shadow-rare/50':
                  card.rarity === iCardRarity.RARE,
                'border-legendary/60': card.rarity === iCardRarity.LEGENDARY,
                'border-mythic/60': card.rarity === iCardRarity.MYTHIC,
              },
              `rarity-${card.rarity.toLowerCase()}`,
            ]"
          >
            <div class="relative w-16">
              <UserCard
                :card="card.cardData"
                :rarity="card.rarity"
                hide-user-data
                hide-card-score
              />
              <span
                v-if="card.fantasyRaceScore === -5"
                class="absolute bottom-1 left-1/2 whitespace-nowrap transform -translate-x-1/2 px-1 text-[10px] rounded-sm bg-red-500 uppercase font-bold italic"
                >{{ card.finishingStatus }}</span
              >
            </div>
            <div class="text-sm flex-1 p-2">
              <div class="flex items-start w-full justify-between mb-1">
                <p class="font-f1 text-xs flex items-baseline gap-1 mt-0.5">
                  <span class="uppercase">{{ card.cardData.cardName }}</span>
                  <span class="opacity-40 text-xs font-headline font-bold">
                    - LVL. {{ card.level }}
                  </span>
                </p>
                <div class="flex items-baseline gap-1 font-mono ml-auto">
                  <span class="mx-auto font-semibold text-lg">{{
                    card.modifiedFantasyScore
                  }}</span>
                  <span class="text-primary text-xs">PTS</span>
                </div>
              </div>
              <div class="grid grid-flow-col w-full items-center font-mono">
                <div
                  class="border-r flex flex-col gap-1 border-primary/15 pr-2"
                >
                  <div
                    class="flex justify-center items-center gap-1 text-primary"
                  >
                    <Icon name="game-icons:stopwatch" class="text-lg" />
                    <p v-if="card.realStartingPosition" class="text-xs">
                      (P{{ card.realStartingPosition }})
                    </p>
                  </div>
                  <p class="flex items-baseline justify-center font-bold">
                    <span>{{ card.fantasyQualScore }}</span>
                    <span class="text-[10px]">&nbsp;PTS</span>
                  </p>
                </div>
                <div
                  class="border-r flex flex-col gap-1 border-primary/15 px-2"
                >
                  <div
                    class="flex justify-center items-center gap-1 text-primary"
                  >
                    <Icon name="game-icons:checkered-flag" class="text-lg" />
                    <p v-if="card.fantasyRaceScore" class="text-xs">
                      (P{{ card.realRacePosition }})
                    </p>
                    <p v-else class="text-xs">(DNF)</p>
                  </div>
                  <p class="flex items-baseline justify-center">
                    <span>{{ card.fantasyRaceScore }}</span>
                    <span class="text-[10px]">&nbsp;PTS</span>
                  </p>
                </div>
                <div class="flex flex-col gap-1 px-2">
                  <p class="text-xs text-tertiary text-center">
                    +{{ Math.round((card.cardModifierValue - 1) * 100) }}%
                  </p>
                  <p class="flex items-baseline justify-center">
                    <span>{{
                      card.modifiedFantasyScore - card.baseFantasyScore
                    }}</span>
                    <span class="text-[10px]">&nbsp;PTS</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p
          class="font-headline tracking-widest text-primary uppercase italic font-bold text-sm mb-2"
        >
          Constructors
        </p>
        <div class="space-y-2">
          <div
            v-for="card in constructors"
            class="bg-surface-container-low border rounded-lg flex"
            :class="[
              {
                'border-common/60': card.rarity === iCardRarity.COMMON,
                'border-uncommon/60': card.rarity === iCardRarity.UNCOMMON,
                'border-rare/60 shadow-rare/50':
                  card.rarity === iCardRarity.RARE,
                'border-legendary/60': card.rarity === iCardRarity.LEGENDARY,
                'border-mythic/60': card.rarity === iCardRarity.MYTHIC,
              },
              `rarity-${card.rarity.toLowerCase()}`,
            ]"
          >
            <div class="relative w-16">
              <UserCard
                :card="card.cardData"
                :rarity="card.rarity"
                hide-user-data
                hide-card-score
              />
            </div>
            <div class="text-sm flex-1 p-2">
              <div class="flex items-start w-full justify-between">
                <p class="font-f1 text-xs flex items-baseline gap-1 mt-0.5">
                  <span class="uppercase">{{ card.cardData.cardName }}</span>
                  <span class="opacity-40 text-xs font-headline font-bold">
                    - LVL. {{ card.level }}
                  </span>
                </p>
                <div class="flex items-baseline gap-1 font-mono ml-auto">
                  <span class="mx-auto font-semibold text-lg">{{
                    card.modifiedFantasyScore
                  }}</span>
                  <span class="text-primary text-xs">PTS</span>
                </div>
              </div>
              <div class="flex gap-1">
                <div
                  class="grow flex flex-col gap-1 border-r pr-2 border-primary/15 justify-center"
                >
                  <div
                    v-for="driver in card.driverScores"
                    :key="driver.driverName"
                    class="flex items-center gap-1"
                  >
                    <p class="italic opacity-60">{{ driver.driverName }}:</p>
                    <p class="ml-auto flex items-baseline leading-none">
                      <span>{{
                        Math.floor(driver.totalFantasyPoints / 2)
                      }}</span>
                      <span class="text-[10px] ml-0.5">PTS</span>
                    </p>
                  </div>
                </div>

                <div
                  class="ml-auto flex flex-col gap-1 justify-center px-2 text-center"
                >
                  <p class="text-tertiary">
                    +{{ Math.round((card.cardModifierValue - 1) * 100) }}%
                  </p>
                  <p class="flex items-baseline justify-center leading-none">
                    <span>{{
                      card.modifiedFantasyScore - card.baseFantasyScore
                    }}</span>
                    <span class="text-[10px] ml-0.5">PTS</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CardType,
  type iCardScore,
  type iResult,
  iCardRarity,
} from "@f1pick6/shared";

const props = defineProps<{
  result: iResult;
}>();

const isOpen = useState(props.result.raceName, () => false);
const drivers: iCardScore[] = Object.values(props.result.cards)
  .filter((card: iCardScore) => card.cardData.type === CardType.DRIVER)
  .sort((a, b) => (a.modifiedFantasyScore > b.modifiedFantasyScore ? -1 : 1));
const constructors: iCardScore[] = Object.values(props.result.cards)
  .filter((card: iCardScore) => card.cardData.type === CardType.CONSTRUCTOR)
  .sort((a, b) => (a.modifiedFantasyScore > b.modifiedFantasyScore ? -1 : 1));

const toggleOpen = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.glass-panel {
  background: rgba(31, 31, 40, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.bg-carbon {
  background-image:
    linear-gradient(
      45deg,
      #13131b 25%,
      transparent 25%,
      transparent 75%,
      #13131b 75%,
      #13131b
    ),
    linear-gradient(
      45deg,
      #13131b 25%,
      transparent 25%,
      transparent 75%,
      #13131b 75%,
      #13131b
    );
  background-size: 8px 8px;
  background-position:
    0 0,
    4px 4px;
  background-color: #1a1a24;
}

.rarity-uncommon {
  box-shadow: 0 0 14px rgba(4, 101, 109, 0.3);
}

.rarity-rare {
  box-shadow: 0 0 16px rgba(146, 59, 168, 0.5);
}

.rarity-legendary {
  box-shadow: 0 0 12px rgba(184, 134, 11, 0.4);
}
</style>
