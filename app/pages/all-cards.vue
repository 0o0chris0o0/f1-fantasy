<template>
  <div>
    <h2 class="text-center mb-6 text-lg">All Cards</h2>

    <div>
      ...filters...
    </div>
    <div class="grid grid-cols-1 gap-x-4 gap-y-3 mb-6">
      <button v-if="allCards[0]" class="block w-full">
        <UserCard :card="allCards[0]" :rarity="iCardRarity.COMMON" :level="2" />
      </button>
    </div>
    <div class="grid grid-cols-2 gap-x-4 gap-y-3 mb-6">
      <button v-if="allCards[1]" class="block w-full">
        <UserCard :card="allCards[1]" :rarity="iCardRarity.COMMON" :level="1" inCollection />
      </button>
      <button v-if="allCards[2]" class="block w-full">
        <UserCard :card="allCards[2]" :rarity="iCardRarity.UNCOMMON" :level="2"/>
      </button>
    </div>
    <div class="grid grid-cols-3 gap-x-4 gap-y-3 mb-6">
      <button v-if="allCards[3]" class="block w-full">
        <UserCard :card="allCards[3]" :rarity="iCardRarity.UNCOMMON" :level="2"/>
      </button>
      <button v-if="allCards[4]" class="block w-full">
        <UserCard :card="allCards[4]" :rarity="iCardRarity.RARE" :level="3" />
      </button>
      <button v-if="allCards[5]" class="block w-full">
        <UserCard :card="allCards[5]" :rarity="iCardRarity.LEGENDARY" :level="4" />
      </button>
    </div>
    <div>
      <hr class="my-8">
    </div>
    <div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-2 mb-6">
        <div v-for="card in allCards" :key="card.cardId">
          <button class="block w-full" @click="handleSelectCard(card)">
            <Card :card="card" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Components
import { useModal } from "vue-final-modal";
import Loader from "~/components/Loader.vue";
import CardInfoModal from "~/components/modals/CardInfoModal.vue";
import { iCardRarity, type iCardInUsersCards, type iConstructorCard, type iDriverCard } from "~/types/card";

// Stores
const cardsStore = useCardsStore();

definePageMeta({
  middleware: "auth",
});

await callOnce("cards", cardsStore.getAllCards);

const selectedCard = ref<iDriverCard | iConstructorCard | null>(null);

const { allCards } = storeToRefs(cardsStore);

const { open: openCardInfoModal, close: closeCardInfoModal, patchOptions } = useModal({
  component: CardInfoModal,
  attrs: {
    close: () => closeCardInfoModal(),
  }
});

const handleSelectCard = async (card: iDriverCard) => {
  selectedCard.value = card;
  
  // Update the modal attributes explicitly if it's already "created"
  patchOptions({
    attrs: {
      cardData: card,
    },
  });
  
  openCardInfoModal();
}

</script>

<style lang="scss" scoped></style>
