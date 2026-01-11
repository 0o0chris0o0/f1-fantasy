<template>
  <div>
    <Loader v-if="isLoading" />
    <div class="grid grid-cols-12 mb-4 items-center">
      <NuxtLink to="/home" class="col-span-2 text-sm underline text-blue-400">
        Back
      </NuxtLink>
      <PageHeader class="col-span-8"> Pick a {{ prettyHeading(route.query.type as string) }} </PageHeader>
    </div>
    <div v-if="userCards && !userCards.length" class="bg-orange-500 rounded mb-4">
      <p class="text-sm p-3">
        You don't current have any available cards, visit the <NuxtLink to="/store" class="underline text-blue-700">store</NuxtLink> to get an emergency pack.
      </p>
    </div>
    <div class="grid grid-cols-3 gap-2 gap-y-3">
      <div v-for="card in userCards" :key="card.cardId">
        <button
          class="w-full"
          :disabled="!card.enabled || selectedCards?.includes(card.cardId) || !card.tyres"
          :class="{
            'opacity-40': !card.enabled || selectedCards?.includes(card.cardId) || !card.tyres
          }"
          @click="selectCard(card)"
        >
          <Card
            :card="card"
            :tyres="card.tyres"
            :class="{ 'opacity-50': selectedCards?.includes(card.cardId) }"
            show-team-tag
            show-collection-tag
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { doc, updateDoc } from "firebase/firestore";
import { useModal } from "vue-final-modal";
import CardViewModal from "~/components/Modals/CardViewModal.vue";
import { CardType, type iCardWithQuantity } from "~/types/card";

const route = useRoute();
const userStore = useUserStore();
const cardsStore = useCardsStore();
const db = useFirestore();
const router = useRouter();

definePageMeta({
  layout: "auth",
  middleware: ["authenticated", "pick-card"],
});

const isLoading = ref(false);
const selectedCard = ref<iCardWithQuantity | null>(null);

const prettyHeading = (value: string) => {
  switch (value) {
    case 'driver':
      return 'Driver';
    case 'car':
      return 'Car';
    default:
      return 'Team Principle'
  }
}

const userCards = computed(() => {
  let cardsToReturn: iCardWithQuantity[] | undefined;

  switch (route.query.type) {
    case CardType.CAR:
      cardsToReturn = cardsStore.userCarCards;
      break;
    case CardType.TEAMPRINCIPLE:
      cardsToReturn = cardsStore.userTpCards;
      break;
    default:
      cardsToReturn = cardsStore.userDriverCards;
      break;
  }

  return cardsToReturn;
});

const selectedCards = computed(() => {
  if (
    route.query.type === CardType.DRIVER &&
    typeof route.query.id === "string"
  ) {
    return [
      userStore.userFromStore?.currentTeam.driver["1"]?.cardId,
      userStore.userFromStore?.currentTeam.driver["2"]?.cardId,
    ];
  } else if (route.query.type === CardType.CAR) {
    return [userStore.userFromStore?.currentTeam.car?.cardId];
  } else {
    return [userStore.userFromStore?.currentTeam.teamPrinciple?.cardId];
  }
});

const { open, close } = useModal({
  component: CardViewModal,
  attrs: {
    card: selectedCard,
    confirmText: 'Select card',
    confirm: async () => {
      if (userStore.userFromStore?.userId) {
        close();
      
        isLoading.value = true;
        
        const playerRef = doc(db, "players", userStore.userFromStore?.userId);

        await updateDoc(
          playerRef,
          `currentTeam.${route.query.type}${
            route.query.type === CardType.DRIVER ? `.${route.query.id}` : ""
          }`,
          selectedCard.value
        );

        isLoading.value = false;

        router.push("/home");
      }
    },
    close: () => {
      close()
    }
  },
});

const selectCard = (card: iCardWithQuantity) => {
  selectedCard.value = card;
  open();
};


</script>

<style lang="scss" scoped></style>
