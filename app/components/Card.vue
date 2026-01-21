<template>
  <div :class="['relative card-container', { 'opacity-25': !card.enabled }]">
    <div 
      class="max-w-full p-2 card" 
      :class="
        rarity !== undefined && `rarity-${enumToText(iCardRarity, rarity)}`
      "
    >
      <div class="card-border" v-if="rarity !== undefined">
        <img :src="`/img/card-border-${enumToText(iCardRarity, rarity)}.png`" alt="">
      </div>
      <ClientOnly v-if="card.type === CardType.DRIVER">
        <div
          class="card-image__driver"
        >
          <img 
            :alt="card.type"
            :src="`/img/drivers/${card.cardId}.avif`"
            class="w-full"
            @error="loadDefaultImage($event, CardType.DRIVER)"
          />
        </div>
      </ClientOnly>
      <ClientOnly v-else>
        <div
          class="card-image__constructor"
          :style="{ 
            'background-color': `var(--color-${card.teamId}, var(--color-default))`
          }"
        >
          <img 
            :alt="card.type"
            :src="`/img/constructors/${card.cardId}.avif`"
            class="w-full"
            @error="loadDefaultImage($event, CardType.CONSTRUCTOR)"
          />
        </div>
      </ClientOnly>
      <div 
        class="card-team" 
        :style="{ 
          'background-color': `var(--color-${card.teamId}, var(--color-default))`
        }"
      >
        <img :src="`/img/teams/${card.teamId}.avif`" />
      </div>
      <div 
        class="card-text text-black"
      >
        <div class="card-name">
          <p class="font-f1 font-semibold tracking-wide text-sm overflow-hidden whitespace-nowrap text-ellipsis">{{ card.cardName }}</p>
        </div>
        <div class="card-points">
          <p class="font-f1 font-semibold text-xs">{{ card.stats.currentFantasyPoints }} Pts</p>
        </div>
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
  aspect-ratio: 269/397;
  height: auto;
  border-radius: 0.5em;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  background: #f5f5f5;
  background: linear-gradient(130deg,rgba(245, 245, 245, 1) 0%, rgba(192, 192, 196, 1) 50%, rgba(245, 245, 245, 1) 99%);

  &.rarity-common {
    background: #f5f5f5;
    background: linear-gradient(130deg,rgba(245, 245, 245, 1) 0%, rgba(192, 192, 196, 1) 50%, rgba(245, 245, 245, 1) 99%);
  }

  &.rarity-uncommon {
    background: #a1e9ff;
    background: linear-gradient(130deg,rgba(161, 233, 255, 1) 0%, rgba(118, 192, 219, 1) 50%, rgba(161, 233, 255, 1) 99%);
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
  }

  &.rarity-legendary {
    /* A 5-stop gradient creates a metallic 'cylindrical' reflection */
    background: linear-gradient(
      130deg,
      #bf953f 0%,
      #fcf6ba 25%,
      #b38728 50%,
      #fcf6ba 75%,
      #aa771c 100%
    );
    box-shadow: 0 0 20px rgba(184, 134, 11, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.5);
  }
}

.card-border {
  position: absolute;
  top: 0;
  left: 0px;
  width: calc(100% + 1px);
  z-index: 2;
}

.card-image__driver {
  padding-top: 5px;
  height: 80%;
  overflow: hidden;
}

.card-image__constructor {
  position: relative;
  height: 80%;
  overflow: hidden;

  img {
    object-fit: cover;
    position: absolute;
    height: 100%;
  }
}

.card-text {
  position: relative;
  flex: 1;
  display: grid;
  align-items: center;
}

.card-name {
  padding: 0 0 0.4rem;
}

.card-team {
  position: absolute;
  width: 50px;
  top: 0.7em;
  left: 0.5em;
  border-radius: 50%;
  padding: 0.4em;
}

.card-points {
  position: absolute;
  right: 4%;
  bottom: 1%;
  width: 35%;
}

.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 150px) {
  .card {
    font-size: 18px;
  }
}

@container card (min-width: 250px) {
  .card {
    font-size: 22px;
  }
}
</style>
