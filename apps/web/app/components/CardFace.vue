<template>
  <div class="card-container">
    <div
      class="max-w-full rounded-lg card"
      :class="[
        `rarity-${rarity.toLowerCase()}`,
        { 'opacity-25': !card.enabled },
      ]"
    >
      <ClientOnly>
        <NuxtImg
          :alt="card.type"
          :src="`/img/${card.type === CardType.CONSTRUCTOR ? 'constructors' : 'drivers'}/${card.cardId}-${rarity.toLowerCase()}.png`"
          class="rounded-lg"
          :placeholder="`/img/${card.type === CardType.CONSTRUCTOR ? 'constructors' : 'drivers'}/generic-${rarity.toLowerCase()}.png`"
          loading="lazy"
          width="490"
          height="740"
        />
      </ClientOnly>
      <div class="absolute right-0 flex flex-col card-icons">
        <div
          class="rounded-full card-icons__team-logo"
          :style="{ backgroundColor: `var(--color-${card.teamId})` }"
        >
          <img :src="`/img/teams/${card.teamId}.avif`" />
        </div>
        <div v-if="card.nationalityCode" class="rounded-full card-icons__flag">
          <Icon
            class="w-full h-full"
            :name="`circle-flags:${card.nationalityCode.toLowerCase()}`"
          />
        </div>
      </div>

      <div class="font-f1 font-semibold tracking-tight card-name">
        <p>{{ card.cardName }}</p>
      </div>
      <div class="inline-block text-left uppercase card-team">
        <hr class="opacity-50" />
        <p class="opacity-75">{{ card.teamName }}</p>
      </div>
      <div v-if="!hideCardScore" class="font-f1 text-right card-score">
        <p class="card-score__number">
          {{ card.stats.currentFantasyPoints }}
        </p>
        <p class="card-score__text">Pts</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CardType, iCardRarity } from "@f1pick6/shared/types";
import type { iConstructorCard, iDriverCard } from "@f1pick6/shared/types";

defineProps<{
  card: iDriverCard | iConstructorCard;
  rarity: iCardRarity;
  hideCardScore?: boolean;
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
  background: linear-gradient(
    130deg,
    rgba(245, 245, 245, 1) 0%,
    rgba(192, 192, 196, 1) 50%,
    rgba(245, 245, 245, 1) 99%
  );

  &.rarity-common {
    background: var(--color-common);
    background: linear-gradient(
      130deg,
      rgba(245, 245, 245, 1) 0%,
      rgba(192, 192, 196, 1) 50%,
      rgba(245, 245, 245, 1) 99%
    );
    color: white;
  }

  &.rarity-uncommon {
    background: var(--color-uncommon);
    background: linear-gradient(
      130deg,
      rgba(161, 233, 255, 1) 0%,
      rgba(118, 192, 219, 1) 50%,
      rgba(161, 233, 255, 1) 99%
    );
    box-shadow:
      0 0 15px rgba(4, 101, 109, 0.3),
      inset 0 0 15px rgba(145, 246, 255, 0.2);
    color: rgb(145, 246, 255);

    hr {
      border-color: #91f6ff;
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
    box-shadow:
      0 0 15px rgba(146, 59, 168, 0.7),
      inset 0 0 15px rgba(255, 255, 255, 0.5);
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
    box-shadow:
      0 0 20px rgba(184, 134, 11, 0.6),
      inset 0 0 10px rgba(255, 255, 255, 0.5);
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
    box-shadow:
      0 0 20px rgba(255, 68, 0, 0.6),
      inset 0 0 10px rgba(255, 68, 0, 0.5);
    color: var(--color-mythic);

    hr {
      border-color: color.adjust(rgb(255, 68, 0), $lightness: 10%);
    }
  }
}

.card-icons {
  display: none;
  padding: 0.4em;
  gap: 0.2em;

  &__flag {
    position: relative;
    overflow: hidden;
    width: 1.4em;
    height: 1.4em;

    &:after {
      box-shadow: inset 0 0 0.18em rgba(0, 0, 0, 0.8);
      content: "";
      display: block;
      height: 100%;
      position: absolute;
      top: 0;
      width: 100%;
    }

    svg {
      z-index: 1;
    }
  }

  &__team-logo {
    width: 1.4em;
    height: 1.4em;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 0 0.18em rgba(0, 0, 0, 0.8);

    img {
      width: 80%;
      height: 80%;
      display: block;
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
  display: none;
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

@container card (min-width: 100px) {
  .card {
    font-size: 16px;
  }

  .card-name {
    display: block;
  }

  .card-icons {
    display: flex;
  }
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

  .card-icons {
    padding: 0.2em 0.3em;
  }
}
</style>
