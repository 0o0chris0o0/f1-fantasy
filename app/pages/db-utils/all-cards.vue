<template>
  <div>
    <h1 class="text-center text-lg">All Cards</h1>

    <div class="grid grid-cols-auto gap-1 my-4">
      <NuxtLink to="/db-utils"> Back </NuxtLink>
    </div>

    <div
      class="grid grid-cols-2 gap-x-4 gap-y-6"
      :class="{ 'opacity-25 pointer-events-none': isLoading }"
    >
      <div
        v-for="(card, i) in allCards"
        class="border p-2 bg-black text-white rounded shadow-md"
        :class="{ 'opacity-25': !card.enabled }"
      >
        <img
          :src="`/img/${card.type}s/${card.cardId}.avif`"
          class="w-full"
          @error="loadDefaultImage($event, card.type)"
        >
        <hr class="my-1" >
        <form
          class="grid grid-cols-1 gap-2"
          @submit.prevent="handleUpdate(card.cardId)"
          v-if="allCards[i]"
        >
          <label>
            <span class="font-semibold">Card ID</span>
            <input
              v-model="allCards[i].cardId"
              type="text"
              placeholder="Card ID"
            >
          </label>
          <label>
            <span class="font-semibold">Card Name</span>
            <input
              v-model="allCards[i].cardName"
              type="text"
              placeholder="Name"
            >
          </label>
          <label>
            <span class="font-semibold">Team ID</span>
            <input v-model="allCards[i].teamId" type="text" placeholder="Team" readonly disabled>
          </label>
          <label>
            <span class="font-semibold">Team Name</span>
            <input
              v-model="allCards[i].teamName"
              type="text"
              placeholder="Team Name"
              readonly disabled
            >
          </label>
          <p class="text-sm text-yellow-600 italic">
            These fields will auto update when the main function runs
          </p>
          <label>
            <span class="font-semibold">Average Qualifying Position</span>
            <input
              v-model="allCards[i].stats.averageQualifyingPosition"
              type="number"
              placeholder="Average Qualifying Position"
              readonly disabled
            >
          </label>
          <label>
            <span class="font-semibold">Average Race Position</span>
            <input
              v-model="allCards[i].stats.averageRacePosition"
              type="number"
              placeholder="Average Race Position"
              readonly disabled
            >
          </label>
          <label>
            <span class="font-semibold">Number of DNFs </span>
            <input
              v-model="allCards[i].stats.numberOfDNFs"
              type="number"
              placeholder="Number of DNFs"
              readonly disabled
            >
          </label>
          <label>
            <span class="font-semibold">Enabled</span>
            <input
              v-model="allCards[i].enabled"
              type="checkbox"
              :checked="card.enabled"
            >
          </label>
          <button type="submit" class="p-1 mt-2 w-full bg-green-400">
            Update
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { CardType, type iCard } from "~/types/card";

const db = useFirestore();

const allCards = ref<iCard[]>([]);

const isLoading = ref(false);

const getCards = async () => {
  const querySnapshot = await getDocs(collection(db, "cards"));
  querySnapshot.forEach((doc) => {
    const cardData = doc.data() as iCard;
    allCards.value.push(cardData);
  });
};

const loadDefaultImage = (e: any, cardType: string) => {
  e.target.src = `/img/${cardType}-white.svg`;
  e.target.classList.add("broken-img");
};

onMounted(() => {
  getCards();
});

const handleUpdate = async (cardId: string) => {
  isLoading.value = true;

  let cardToUpdate;

  allCards.value = allCards.value.filter((card) => card.cardId !== cardId);

  const cardsRef = collection(db, "cards");

  await setDoc(doc(cardsRef, cardId), cardToUpdate);

  isLoading.value = false;
};
</script>

<style lang="scss" scoped>
form {
  label span {
    display: block;
  }

  input {
    @apply text-sm p-1 border bg-gray-200 text-black;

    &:disabled {
      @apply bg-gray-300 border-gray-300;
      opacity: 0.8;
    }

    &[type="checkbox"] {
      @apply cursor-pointer;
    }
  }
}

.broken-img {
  @apply p-6;
}
</style>
