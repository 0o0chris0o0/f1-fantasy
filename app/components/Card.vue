<template>
  <div :class="['relative card-container', { 'opacity-25': !card.enabled }]">
    <div 
      class="max-w-full rounded-lg card" 
      :class="
        rarity !== undefined && `rarity-${enumToText(iCardRarity, rarity)}`
      "
    >
      <ClientOnly>
        <img 
          :alt="card.type"
          :src="`/img/drivers/${card.cardId}-${enumToText(iCardRarity, rarity)}.png`" 
          class="card-image rounded-lg" 
          @error="loadDefaultImage($event, enumToText(iCardRarity, rarity))"
        />
      </ClientOnly>
      <div class="font-f1 font-semibold tracking-tight card-name">
        <p>{{ card.cardName }}</p>
      </div>
      <div class="inline-block text-left uppercase card-team">
        <hr class="opacity-50" />
        <p class="opacity-75">{{ card.teamName }}</p>
      </div>
      <div class="font-f1 text-right card-score">
        <p class="card-score__number">{{ card.stats.currentFantasyPoints }}</p>
        <p class="card-score__text">Pts</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CardType, iCardRarity, type iCard } from "~/types/card";

import loadDefaultImage from "~/utils/loadDefaultImage";

const { rarity = iCardRarity.COMMON } = defineProps<{
  card: iCard;
  rarity?: iCardRarity;
}>();
</script>

<style lang="scss" scoped>

.card {
  width: 400px;
  height: auto;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 3px;

  background: #f5f5f5;
  background: linear-gradient(130deg,rgba(245, 245, 245, 1) 0%, rgba(192, 192, 196, 1) 50%, rgba(245, 245, 245, 1) 99%);

  &.rarity-common {
    background: #f5f5f5;
    background: linear-gradient(130deg,rgba(245, 245, 245, 1) 0%, rgba(192, 192, 196, 1) 50%, rgba(245, 245, 245, 1) 99%);
  }

  &.rarity-uncommon {
    background: #a1e9ff;
    background: linear-gradient(130deg,rgba(161, 233, 255, 1) 0%, rgba(118, 192, 219, 1) 50%, rgba(161, 233, 255, 1) 99%);
    color: #91f6ff;

    hr {
      border-color: #91f6ff
    }
  }

  &.rarity-rare {
    background: linear-gradient(
      130deg,
      #632c65 0%,
      #c27bd4 45%,
      #db97ef 50%,
      #c27bd4 55%,
      #632c65 100%
    );
    box-shadow: 0 0 15px rgba(146, 59, 168, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.3);
    color: #f128ff;

    hr {
      border-color: lighten(#f128ff, 10%);
    }
  }

  &.rarity-legendary {
    background: linear-gradient(
      130deg,
      #bf953f 0%,
      #fcf6ba 25%,
      #b38728 50%,
      #fcf6ba 75%,
      #aa771c 100%
    );
    box-shadow: 0 0 20px rgba(184, 134, 11, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.5);
    color: #ffc927;

    hr {
      border-color: lighten(#ffc927, 10%);
    }
  }
}

.card-image {
  // 
}

.card-name {
  position: absolute;
  width: 90%;
  top: 73%;
  left: 5%;
  text-align: left;
  text-transform: uppercase;
  transform: rotate(-12deg);
  font-size: 0.6em;
  line-height: 1.2;
}

.card-team {
  display: none;
  font-size: 0.5em;
  position: absolute;
  bottom: 2.3%;
  left: 7%;
  line-height: 1.2;

  hr {
    width: 120%;
    margin-bottom: 0.2em;
  }
}

.card-score {
  position: absolute;
  bottom: 0.4em;
  right: 7%;
  display: flex;
  gap: 0.3em;
  align-items: baseline;
  font-size: 0.6em;

  &__number {
    font-size: 1.6em;
    line-height: 1;
  }
}

.card-container {
  container-type: inline-size;
  container-name: card;
  max-width: 400px;
}

@container card (min-width: 200px) {
  .card {
    font-size: 22px;
  }

  .card-team {
    display: block;
  }
}

@container card (min-width: 330px) {
  .card {
    font-size: 45px;
  }

  .card-name {
    left: 3%;
  }

  .card-team {
    left: 5%;
  }

  .card-score {
    right: 5%;
  }
}
</style>
