<template>
  <div class="card-container">
    <div 
      class="max-w-full rounded-lg card"
      :class="[
        `rarity-${rarity.toLowerCase()}`
      ]"
    >
      <ClientOnly>
        <NuxtImg 
          :alt="type"
          :src="`/img/${type === CardType.CONSTRUCTOR ? 'constructors' : 'drivers'}/generic-${rarity.toLowerCase()}.png`" 
          class="rounded-lg" 
          loading="lazy"
          width="490px"
          height="740px"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CardType, iCardRarity } from "@f1pick6/shared/types";

const { type = CardType.DRIVER, rarity = iCardRarity.COMMON } = defineProps<{
  type?: CardType;
  rarity?: iCardRarity;
}>();

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
  font-size: 12px;

  background: var(--color-common);
  background: linear-gradient(130deg,rgba(245, 245, 245, 1) 0%, rgba(192, 192, 196, 1) 50%, rgba(245, 245, 245, 1) 99%);

  &.rarity-common {
    background: var(--color-common);
    background: linear-gradient(130deg,rgba(245, 245, 245, 1) 0%, rgba(192, 192, 196, 1) 50%, rgba(245, 245, 245, 1) 99%);
    color: white;
  }

  &.rarity-uncommon {
    background: var(--color-uncommon);
    background: linear-gradient(130deg,rgba(161, 233, 255, 1) 0%, rgba(118, 192, 219, 1) 50%, rgba(161, 233, 255, 1) 99%);
    box-shadow: 0 0 15px rgba(4, 101, 109, 0.3), inset 0 0 15px rgba(145, 246, 255, 0.2);
    color: rgb(145, 246, 255);

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
    box-shadow: 0 0 15px rgba(146, 59, 168, 0.7), inset 0 0 15px rgba(255, 255, 255, 0.5);
    color: var(--color-rare);

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
    box-shadow: 0 0 20px rgba(184, 134, 11, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.5);
    color: var(--color-legendary);

    hr {
      border-color: color.adjust(#ffc927, $lightness: 10%);
    }
  }

  &.rarity-mythic {
    background: linear-gradient(
      130deg,
    #8b0000 0%,
    #ff4d4d 25%,
    #5e0000 50%,
    #ff4d4d 75%,
    #3b0000 100%
    );
    box-shadow: 0 0 20px rgba(255, 68, 0, 0.6), inset 0 0 10px rgba(255, 68, 0, 0.5);
    color: var(--color-mythic);

    hr {
      border-color: color.adjust(rgb(255, 68, 0), $lightness: 10%);
    }
  }
}
</style>
