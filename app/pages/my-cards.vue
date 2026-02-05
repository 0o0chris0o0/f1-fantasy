<template>
  <div>
    <h2 class="text-center mb-6 text-lg">My Cards</h2>

    <div>
      ...filters...
    </div>

    <div>
      <h3 class="text-lg mb-2">Drivers</h3>
      <p v-if="!userObj?.cards?.length" class="italic opacity-50">
        No cards...
      </p>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-3 mb-6">
        <button v-for="card in userObj?.cards" @click="handleSelectCard(card)">
          <UserCard :card="card.cardData" :rarity="card.rarity" :level="card.level" :quantity="card.quantity" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Components
import { useModal } from "vue-final-modal";
import CardInfoModal from "~/components/modals/CardInfoModal.vue";
import type { iCardInUsersCards } from "~/types/card";

const userStore = useUserStore();

const { userObj } = storeToRefs(userStore);

definePageMeta({
  middleware: "auth",
});

const { open: openCardInfoModal, close: closeCardInfoModal, patchOptions } = useModal({
  component: CardInfoModal,
  attrs: {
    close: () => closeCardInfoModal(),
  }
});

const handleSelectCard = async (card: iCardInUsersCards) => {
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
</style>
