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
      <div class="absolute right-0 flex flex-col card-icons">
        <div
          class="border border-gray-800 rounded-full card-icons__team-logo"
          :style="{ backgroundColor: `var(--color-${card.teamId})` }"
        >
          <img :src="`/img/teams/${card.teamId}.avif`" />
        </div>
        <Icon 
          class="border border-gray-800 rounded-full card-icons__flag" 
          :name="`circle-flags:${card.nationalityCode?.toLowerCase()}`" mode="svg"
        />
      </div>
      <div class="absolute card-level">
        <div class="segmented-circle" :style="calcLevelCirc"></div>
        <p class="text-black font-f1 font-bold card-level__text">
          <span>Lvl</span>
          <span>{{ level }}</span>
        </p>
      </div>
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
import { iCardRarity, type iConstructorCard, type iDriverCard } from "~/types/card";

import loadDefaultImage from "~/utils/loadDefaultImage";

const { rarity = iCardRarity.COMMON, level = 1 } = defineProps<{
  card: iDriverCard | iConstructorCard;
  rarity?: iCardRarity;
  level?: number;
}>();

const levelColors: Record<number, string> = {
  1: 'rgba(184, 146, 40, 1)',
  2: 'rgba(214, 175, 50, 1)',
  3: 'rgba(244, 201, 50, 1)',
  4: 'rgba(255, 223, 0, 1)'
};

const calcLevelCirc = computed(() => {
  const segments = 4;
  const filledSegments = Math.min(Math.max(level, 0), segments);
  const anglePerSegment = (360 / segments);
  const activeColor = levelColors[level] || 'rgba(184, 146, 40, 1)';
  let gradientParts = [
    `rgba(0, 0, 0, 0) 0deg 4deg`
  ];

  for (let i = 0; i < segments; i++) {
    const startAngle = i * anglePerSegment;
    const endAngle = startAngle + anglePerSegment;

    if (i < filledSegments) {
      // Add the filled segment
      gradientParts.push(`${activeColor} ${startAngle + 4}deg ${endAngle - 4}deg`);
      gradientParts.push(`rgba(0,0,0,0) ${endAngle - 4}deg ${endAngle + 4}deg`);
    } else {
      gradientParts.push(`${activeColor.replace('1)', '0.2)')} ${startAngle + 4}deg ${endAngle - 4}deg`);
      gradientParts.push(`rgba(0,0,0,0) ${endAngle - 4}deg ${endAngle + 4}deg`);
    }
  }

  return {
    background: `conic-gradient(${gradientParts.join(', ')})`
  };
});

</script>

<style lang="scss" scoped>
@use "sass:color";

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
      border-color: color.adjust(#f128ff, $lightness: 10%);
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
      border-color: color.adjust(#ffc927, $lightness: 10%);
    }
  }
}

.card-image {
  // 
}

.card-icons {
  padding: 0.4em;
  gap: 0.2em;

  &__flag {
    width: 1.4em;
    height: 1.4em;
  }

  &__team-logo {
    width: 1.4em;
    height: 1.4em;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 80%;
      height: 80%;
      display: block;
    }
  }
}

.card-level {
  margin: 0.4em;
  width: 2em;

  .segmented-circle {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    /* Optional: Create the "border" look by masking the center */
    position: relative;
  }

  /* To make it look like a border/ring instead of a pie: */
  .segmented-circle::after {
    content: "";
    position: absolute;
    top: 0.2em;
    left: 0.2em;
    right: 0.2em;
    bottom: 0.2em;
    background: #f5f5f5;
    border-radius: 50%;
    box-shadow: inset 0 0 0.18em rgba(0, 0, 0, 0.8);
  }

  &__text {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 0.7em;
    line-height: 1;
    z-index: 10;
    color: #333;

    span:first-child {
      display: none;
    }
  }
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

  .card-name {
    left: 3%;
  }

  .card-team {
    left: 5%;
  }

  .card-score {
    right: 5%;
  }

  .card-icons {
    padding: 0.2em 0.3em;
  }

  .card-level {
    margin: 0.2em;
  }
}
</style>
