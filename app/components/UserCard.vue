<template>
  <div class="relative card-container">
    <div class="card">
      <div class="absolute card-level">
        <div class="segmented-circle" :style="calcLevelCirc"></div>
        <p class="text-black font-f1 font-bold card-level__text">
          <span>Lvl</span>
          <span>{{ level }}</span>
        </p>
      </div>
      <Card :card="card" :rarity="rarity" />
      <div class="absolute bottom-8 right-2">x{{ quantity }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { iCardRarity, type iConstructorCard, type iDriverCard } from "~/types/card";

const { rarity = iCardRarity.COMMON, level = 1, quantity = 1 } = defineProps<{
  card: iDriverCard | iConstructorCard;
  rarity?: iCardRarity;
  level?: number;
  quantity?: number;
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
.card-level {
  z-index: 2;
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

.card-container {
  container-type: inline-size;
  container-name: card;
  max-width: 400px;
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
