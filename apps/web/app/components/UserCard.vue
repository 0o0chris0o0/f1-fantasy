<template>
  <div class="relative card-container">
    <div class="card">
      <div v-if="level" class="absolute top-3 left-2 z-10 flex gap-0.5">
        <div
          v-for="i in level"
          :key="'filled-' + i"
          class="w-1.5 h-3 bg-secondary"
        ></div>
        <div
          v-for="i in 4 - level"
          :key="'empty-' + i"
          class="w-1.5 h-3 bg-gray-400"
        ></div>
      </div>
      <div class="shadow-xl">
        <Card
          :card="card"
          :rarity="rarity"
          :user-details="{
            level,
            quantity,
            inCollection,
            inTeam,
          }"
          :hide-card-score="hideCardScore"
        />
      </div>
      <div
        v-if="!hideUserData"
        class="flex items-center justify-center gap-1 text-xs sm:text-sm text-white pt-1 font-f1 font-bold"
      >
        <Icon name="bi:stack" />
        <p>x{{ quantity }}</p>
        <div class="w-0.5 h-4 mx-1 bg-white opacity-90"></div>
        <div class="text-lg collected-icon">
          <Icon
            v-if="inCollection"
            name="lets-icons:book-check-fill"
            :customize="customizeIcon"
          />
          <Icon v-else name="lets-icons:book-check" class="opacity-40" />
        </div>
        <Icon
          v-if="inTeam"
          name="game-icons:steering-wheel"
          class="text-lg text-green-600"
        />
      </div>
      <div v-if="isNew" class="absolute w-full text-center -top-3">
        <p
          class="text-xs font-f1 font-bold uppercase text-yellow-950 inline-block bg-amber-400 shadow-lg shadow-yellow-300 rounded px-1.5 py-0.5"
        >
          New
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  iCardRarity,
  type iConstructorCard,
  type iDriverCard,
} from "@f1pick6/shared/types";

const {
  rarity = iCardRarity.COMMON,
  level = 0,
  quantity = 0,
} = defineProps<{
  card: iDriverCard | iConstructorCard;
  rarity?: iCardRarity;
  level?: number;
  quantity?: number;
  inCollection?: boolean;
  inTeam?: boolean;
  hideUserData?: boolean;
  hideCardScore?: boolean;
  isNew?: boolean;
}>();

const customizeIcon = (content: string) => {
  return content
    .replace(/fill="[^"]*"/g, `fill="#84cc16"`) // Change fill color to red
    .replace(/stroke="[^"]*"/g, `stroke="#84cc16"`); // Change stroke color to red
};
</script>

<style lang="scss" scoped>
.card-level {
  z-index: 2;
  margin: 0.4em;
  width: 2em;
  display: none;
}

.card-container {
  container-type: inline-size;
  container-name: card;
  max-width: 400px;
}

@container card (min-width: 100px) {
  .card-level {
    display: block;
  }
}

@container card (min-width: 200px) {
  .card {
    font-size: 22px;
  }

  .card-level__text {
    font-size: 0.5em;

    span:first-child {
      display: block;
    }
  }
}

@container card (min-width: 330px) {
  .card {
    font-size: 45px;
  }

  .card-level {
    margin: 0.2em;
  }
}
</style>
