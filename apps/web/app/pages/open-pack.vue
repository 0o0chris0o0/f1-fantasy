<template>
  <div class="pt-24 overflow-visible open-pack-container">
    <div class="absolute left-0 w-full -translate-y-20 checked-line" />
    <Loader v-if="isLoading" />
    <div :class="[
      'grid grid-cols-2 gap-x-2 md:gap-x-4 gap-y-20 card-grid', 
      loot.length % 2 === 0 && 'pb-40'
    ]">
      <div v-for="(card, i) in loot" class="relative px-3 sm:px-4 pt-2 sm:pt-4 card">
        <div class="relative">
          <button class="block w-full" @click="handleSelectCard(card)">
            <UserCard :card="card.cardData" :rarity="card.rarity" :level="card.level" :quantity="card.quantity" :isNew="!usersSeenCards.includes(`${card.cardData.cardId}_${card.rarity}`)" />
          </button>
          <div v-if="!revealStatus[i]" class="absolute -inset-1 z-10">
            <div class="relative top-0 h-full grid grid-flow-col gap-6">
              <button
                :key="i"
                class="bg-gray-200 rounded-md transition-opacity ease-in-out duration-300 bg-cover bg-center card-cover"
                :class="[
                  {
                    'opacity-0': revealStatus[i],
                  },
                  `cover-shadow-${enumToText(iCardRarity, card.rarity)}`,
                ]"
                @click="revealCard(i)"
              >
                <div class="absolute rounded-md inset-0 grid items-center pointer-events-none text-white reveal-text">
                  Click to reveal
                </div>
              </button> 
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useModal } from 'vue-final-modal';
  import CardInfoModal from '~/components/modals/CardInfoModal.vue';
  import type { iCardInUsersCards } from '@f1pick6/shared';
  import { iCardRarity } from '@f1pick6/shared';

  definePageMeta({
    middleware: "auth",
  });

  const route = useRoute();
  const userStore = useUserStore();

  const packId = route.query.packId as string;
  const isLoading = ref(true);
  const loot = ref<iCardInUsersCards[]>([]);
  const revealStatus = ref<Record<string, boolean>>({});
  const selectedCard = ref<iCardInUsersCards | null>(null);
  const usersSeenCards = ref<string[]>([]);

  onMounted(async () => {
    // set initial list of the cards already seen by the user
    // clone the array so it doesn't update
    usersSeenCards.value = [...userStore.userObj?.seenCards || []];
    try {
      loot.value = await openPack(packId);
    } catch (error) {
      navigateTo('/packs');
    } finally {
      isLoading.value = false;
    }
  })

  const revealCard = (cardId: number) => {
    revealStatus.value[cardId] = !revealStatus.value[cardId];
  };

  const { open: openCardInfoModal, close: closeCardInfoModal, patchOptions } = useModal({
    component: CardInfoModal,
    attrs: {
      close: () => closeCardInfoModal(),
    }
  });

  const handleSelectCard = async (card: iCardInUsersCards) => {
    selectedCard.value = card;
    
    // Update the modal attributes explicitly if it's already "created"
    patchOptions({
      attrs: {
        cardData: card.cardData,
        userData: card,
      },
    });
    
    openCardInfoModal();
  }
</script>

<style lang="scss" scoped>
.checked-line {
  background: url('/img/line-text.png');
  background-size: auto 102%;
  background-repeat: repeat;
  height: 50px;
  border-top: 5px solid white;
  border-bottom: 5px solid white;
}

.card-grid .card:nth-child(even) {
  @apply translate-y-40;
}

.card {
  border-top: 5px solid white;
} 

.card:before,
.card:after {
  content: '';
  width: 5px;
  background: white;
  height: 30px;
  position: absolute;
  top: 0;
}

.card:before {
  left: 0;
}

.card:after {
  right: 0;
}

.card-cover {
  width: 102%;
  height: 102%;
  transform: translate(-1%, -1%);
  background-image: url('/img/card-back.jpg');
  background-position: center;
  background-size: cover;
}

.cover-shadow-uncommon {
  box-shadow: 0 0 15px rgba(4, 101, 109, 0.7);
}

.cover-shadow-rare {
  box-shadow: 0 0 15px rgba(146, 59, 168, 0.4)
}

.cover-shadow-legendary {
  box-shadow: 0 0 15px rgba(184, 134, 11, 0.4);
}

@keyframes fadeInOut {
  15% {
    opacity: 0%;
  }

  50% {
    opacity: 100%;
  }

  85% {
    opacity: 0%;
  }
}

.reveal-text {
  opacity: 0;
  background: rgba(25,25,25,0.8);
  animation-name: fadeInOut;
  animation-duration: 2.2s;
  animation-delay: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}
</style>
