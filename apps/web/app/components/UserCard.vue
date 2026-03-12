<template>
  <div class="relative card-container">
    <div class="card">
      <div v-if="level" class="absolute card-level">
        <div class="segmented-circle" :style="calcLevelCirc"></div>
        <p class="text-black font-f1 font-bold card-level__text">
          <span>Lvl</span>
          <span>{{ level }}</span>
        </p>
      </div>
      <div class="shadow-xl">
        <Card :card="card" :rarity="rarity" :hide-card-score="hideCardScore" />
      </div>
      <div v-if="!hideUserData" class="flex items-center justify-center gap-1 text-xs sm:text-sm text-white pt-1 font-f1 font-bold">
        <Icon name="bi:stack" />
        <p>x{{ quantity }}</p>
        <div class="w-0.5 h-4 mx-1 bg-white opacity-90"></div>
        <div class="text-lg collected-icon">
          <Icon 
            v-if="inCollection"
            name="lets-icons:book-check-fill" 
            :customize="customizeIcon" 
          />
          <Icon 
            v-else
            name="lets-icons:book-check" 
            class="opacity-40"
          />
        </div>
      </div>
      <div v-if="isNew" class="pt-1">
        <p class="text-xs font-f1 font-bold uppercase text-yellow-950 inline-block bg-amber-400 shadow shadow-yellow-300 rounded px-1.5 pt-0.5">New</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { iCardRarity, type iConstructorCard, type iDriverCard } from "@f1pick6/shared/types";

const { rarity = iCardRarity.COMMON, level = 0, quantity = 0 } = defineProps<{
  card: iDriverCard | iConstructorCard;
  rarity?: iCardRarity;
  level?: number;
  quantity?: number;
  inCollection?: boolean;
  hideUserData?: boolean;
  hideCardScore?: boolean;
  isNew?: boolean
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

const customizeIcon = (content: string) => {
  return content
    .replace(/fill="[^"]*"/g, `fill="#84cc16"`) // Change fill color to red
    .replace(/stroke="[^"]*"/g, `stroke="#84cc16"`) // Change stroke color to red

}

</script>

<style lang="scss" scoped>
.card-level {
  z-index: 2;
  margin: 0.4em;
  width: 2em;
  display: none;

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
