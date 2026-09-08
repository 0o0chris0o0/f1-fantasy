<template>
  <div
    class="overflow-hidden relative bg-[#0d0f12] text-white flex-1 perspective-[1000px] w-full flex items-center justify-center"
  >
    <Loader v-if="isLoading" />
    <div
      class="absolute z-[1] w-[200%] h-[200%] -top-1/2 -left-1/2 [transform:rotateX(60deg)] bg-grid"
    ></div>

    <button
      @click="startSequence"
      class="absolute w-60 top-15 block mx-auto z-20 origin-center pack"
      :class="{
        'pack-opening pointer-events-none': animationPlaying,
      }"
    >
      <img
        :src="`/img/${packId}-pack.png`"
        class="p-10"
        @error="loadFallbackPackImage($event)"
      />
    </button>

    <div
      ref="cardGrid"
      class="absolute inset-0 overflow-y-auto touch-scroll grid grid-cols-2 items-start gap-x-5 gap-y-6 z-10 pt-[7cap] pb-8 px-4"
    >
      <div
        class="absolute top-0 left-0 w-full h-[50px] border-y-[5px] border-white checked-line transition-opacity duration-500"
        :class="showCheckedLine ? 'opacity-100' : 'opacity-0'"
      />
      <div
        v-for="(card, index) in loot"
        :key="index"
        class="relative flex justify-center odd:mt-18"
      >
        <div
          v-if="isBigReveal(card.rarity) && drivenIn[index] && !revealed[index]"
          class="rounded-lg flash-layer"
          :class="{
            'shadow-rare': card.rarity === iCardRarity.RARE,
            'shadow-legendary': card.rarity === iCardRarity.LEGENDARY,
            'text-mythic shadow-mythic': card.rarity === iCardRarity.MYTHIC,
          }"
        />
        <div
          class="card w-full perspective-[1000px]"
          :class="{ 'drived-in': drivenIn[index] }"
        >
          <div class="card-inner" :class="{ flipped: revealed[index] }">
            <div class="card-front">
              <UserCard
                :card="card.cardData"
                :rarity="card.rarity"
                :level="card.level"
                :quantity="card.quantity"
                :isNew="
                  !usersSeenCards.includes(
                    `${card.cardData.cardId}_${card.rarity}`
                  )
                "
              />
            </div>
            <button
              type="button"
              aria-label="Reveal card"
              class="card-back rounded-lg border-2 border-white/15 bg-[url('/img/card-back.jpg')] bg-cover bg-center"
              @click="revealCard(index)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { iCardInUsersCards } from '@f1pick6/shared';
import { iCardRarity } from '@f1pick6/shared';
// TEMP (local dev only): mock loot so this page can be worked on without owning packs
import { mockDriverCards } from '~/utils/__mocks__/mockDriverCards';
import { mockConstructorCards } from '~/utils/__mocks__/mockConstructorCards';
import { sortCardsForPackOpening } from '~/utils/filteringSorting';

// TEMP: flip to false (and uncomment the auth middleware below) to restore real pack opening
const USE_MOCK_LOOT = false;

definePageMeta({
  // TEMP: commented out while USE_MOCK_LOOT is true so the page loads without firebase auth
  middleware: 'auth',
});

const route = useRoute();
const userStore = USE_MOCK_LOOT ? null : useUserStore();

const packId = route.query.packId as string;
const quantity = route.query.quantity
  ? parseInt(route.query.quantity as string, 10)
  : 1;
const isLoading = ref(true);
const loot = ref<iCardInUsersCards[]>([]);
const usersSeenCards = ref<string[]>([]);

const animationPlaying = ref(false);
const showCheckedLine = ref(false);
const drivenIn = ref<boolean[]>([]);
const revealed = ref<boolean[]>([]);
const cardGrid = useTemplateRef<HTMLElement>('cardGrid');

const PACK_BURST_MS = 1200; // time for the pack to wiggle and burst open
const DRIVE_IN_STAGGER_MS = 200;
const PARKED_PAUSE_MS = 250; // beat between the last car parking and the flips
const FLIP_STAGGER_MS = 180;

// the user turns these over themselves rather than having them auto revealed
const BIG_REVEAL_RARITIES: iCardRarity[] = [
  iCardRarity.RARE,
  iCardRarity.LEGENDARY,
  iCardRarity.MYTHIC,
];

function isBigReveal(rarity: iCardRarity) {
  return BIG_REVEAL_RARITIES.includes(rarity);
}

onMounted(async () => {
  if (USE_MOCK_LOOT) {
    loot.value = buildMockLoot(quantity);
    // mark every other card as already seen so the "New" badge is visible on a mix of cards
    usersSeenCards.value = loot.value
      .filter((_, i) => i % 2 === 0)
      .map((card) => `${card.cardData.cardId}_${card.rarity}`);
    isLoading.value = false;
    return;
  }

  // set initial list of the cards already seen by the user
  // clone the array so it doesn't update
  usersSeenCards.value = [...(userStore?.userObj?.seenCards || [])];
  try {
    // perform pack opening, this adds the cards to the user obj
    loot.value = await openPack(packId, quantity);
  } catch (error) {
    navigateTo('/packs');
  } finally {
    isLoading.value = false;
  }
});

// TEMP: delete this along with the USE_MOCK_LOOT flag
function buildMockLoot(packQuantity: number): iCardInUsersCards[] {
  const cardPool = [...mockDriverCards, ...mockConstructorCards];
  const rarityCycle = [
    iCardRarity.COMMON,
    iCardRarity.COMMON,
    iCardRarity.UNCOMMON,
    iCardRarity.UNCOMMON,
    iCardRarity.RARE,
    iCardRarity.LEGENDARY,
    iCardRarity.MYTHIC,
  ];
  const cardsToBuild = Math.max(packQuantity, 1) * 12;
  const mockLoot: iCardInUsersCards[] = [];

  for (let i = 0; i < cardsToBuild; i++) {
    const cardData = cardPool[i % cardPool.length]!;

    mockLoot.push({
      cardData,
      inCollection: i % 3 === 0,
      collectedOn: null,
      quantity: (i % 4) + 1,
      rarity: rarityCycle[i % rarityCycle.length]!,
      level: (i % 4) + 1,
      xp: 0,
    });
  }

  return sortCardsForPackOpening(mockLoot);
}

function startSequence() {
  if (animationPlaying.value) return;

  animationPlaying.value = true;

  // jump to the back of the grid while every card is still invisible, so the user starts at the bottom without ever seeing the scroll position move
  if (cardGrid.value) {
    cardGrid.value.scrollTop = cardGrid.value.scrollHeight;
  }

  // loot is sorted rarity first, so work from the back of the grid towards pole
  const gridOrder = loot.value.map((_, index) => index).reverse();

  // 2. Drive cards up sequentially like F1 cars onto the grid
  setTimeout(() => {
    showCheckedLine.value = true;

    // the cars arrive from the back of the grid, where the user is looking
    gridOrder.forEach((cardIndex, position) => {
      setTimeout(() => {
        drivenIn.value[cardIndex] = true;
      }, position * DRIVE_IN_STAGGER_MS);
    });

    const allCarsParked = 4 * DRIVE_IN_STAGGER_MS + PARKED_PAUSE_MS;

    // 3. Once in position, flip everything bar the top rarities, which keep
    // their aura until the user turns them over
    setTimeout(() => {
      gridOrder
        .filter((cardIndex) => !isBigReveal(loot.value[cardIndex]!.rarity))
        .forEach((cardIndex, position) => {
          setTimeout(() => {
            revealed.value[cardIndex] = true;
          }, position * FLIP_STAGGER_MS);
        });
    }, allCarsParked);
  }, PACK_BURST_MS);
}

function revealCard(index: number) {
  // a card that hasn't driven in yet isn't on the grid to be turned over
  if (!drivenIn.value[index]) return;

  revealed.value[index] = true;
}
</script>

<style lang="scss" scoped>
.checked-line {
  background: url('/img/line-text.png');
  background-size: auto 102%;
  background-repeat: repeat;
}

.bg-grid {
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}

.pack {
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

.pack-opening {
  animation: pack-open 1.4s ease-in-out forwards;
}

@keyframes pack-open {
  0% {
    transform: rotate(0deg) scale(1);
  }
  10% {
    transform: rotate(-4deg) scale(1.02);
  }
  20% {
    transform: rotate(4deg) scale(1.02);
  }
  30% {
    transform: rotate(-5deg) scale(1.04);
  }
  40% {
    transform: rotate(5deg) scale(1.04);
  }
  50% {
    transform: rotate(-6deg) scale(1.06);
  }
  60% {
    transform: rotate(6deg) scale(1.06);
  }
  70% {
    transform: rotate(0deg) scale(1.08);
    opacity: 1;
  }
  /* squash back down before bursting open */
  78% {
    transform: rotate(0deg) scale(0.9);
    opacity: 1;
  }
  100% {
    transform: rotate(0deg) scale(2.8);
    opacity: 0;
  }
}

@keyframes pack-fade {
  to {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pack-opening {
    animation: pack-fade 0.4s ease-out forwards;
  }

  .flash-layer {
    animation: none;
    opacity: 0.6;
  }
}

.card {
  transform: translateY(150px);
  opacity: 0;
  transition:
    transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    opacity 0.3s;
}

.card.drived-in {
  transform: translateY(0);
  opacity: 1;
}

.card-inner {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card-inner.flipped {
  transform: rotateY(180deg);
}

/* the front sits in flow so it sets the height, then turns away from the user */
.card-front {
  backface-visibility: hidden;
  transform: rotateY(180deg);
}

.card-back {
  position: absolute;
  inset: 0;
  width: 100%;
  backface-visibility: hidden;
}

/* only ever let the face pointing at the user be clickable */
.card-inner:not(.flipped) .card-front,
.card-inner.flipped .card-back {
  pointer-events: none;
}

/* aura teasing a high rarity card that is still face down */
.flash-layer {
  position: absolute;
  inset: 4%;
  box-shadow: 0 0px 20px 5px var(--tw-shadow-color);
  animation: pulse-aura 1.2s infinite alternate;
}

@keyframes pulse-aura {
  from {
    transform: scale(1);
    opacity: 0.35;
  }
  to {
    transform: scale(1.01);
    opacity: 0.85;
  }
}
</style>
