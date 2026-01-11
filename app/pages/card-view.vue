<template>
  <div v-if="!pending && cardData">
    <div>
      <NuxtLink to="/my-cards" no-rel>
        <Button>Back</Button>
      </NuxtLink>
    </div>
    <h1 class="text-xl mb-4 text-center">{{ cardData.cardName }}</h1>
    <Card :card="cardData" />
    <div v-if="userCardQuantity">
      <p>You have {{ userCardQuantity }}</p>
      <Button v-if="canTradeIn" bg-color-class="bg-green-400" @click="tradeIn">
        Trade In
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { canCardBeTraded } from "~/utils/canCardBeTraded";

const route = useRoute();
const cardsStore = useCardsStore();
const userStore = useUserStore();
const confirmationStore = useConfirmationStore();
const router = useRouter();

definePageMeta({
  middleware: "authenticated",
});

const { pending } = await useAsyncData("cards", cardsStore.getAllCards);

const cardId: string = route.query.cardId as string;
const cardData = cardsStore.getXCard(cardId);

const userCardQuantity = computed(() => {
  return userStore.howManyOfXCardDoesUserHave(cardId);
});

watch(userCardQuantity, (newValue) => {
  if (!newValue) {
    router.push("/my-cards");
  }
});

const tradeIn = async () => {
  if (cardData) {
    confirmationStore.confirmAction({
      action: async () => {
        userStore.tradeCard(cardId, cardData.currentTier, cardData.enabled);
      },
      confirmationHeading: "Trade in?",
      confirmationMessage: `This will remove x${cardsRequiredForTrade(
        cardData.currentTier,
        cardData.enabled
      )} of this card.`,
    });
  }
};

const canTradeIn = computed(() => {
  if (cardData && userCardQuantity.value) {
    if (!cardData.enabled) {
      return true;
    }
    return canCardBeTraded(cardData.currentTier, userCardQuantity.value);
  } else {
    return false;
  }
});
</script>

<style scoped></style>
