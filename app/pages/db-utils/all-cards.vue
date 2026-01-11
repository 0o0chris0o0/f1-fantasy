<template>
  <div>
    <h1 class="text-center text-lg">All Cards</h1>

    <div class="grid grid-cols-auto gap-1 my-4">
      <NuxtLink to="/db-utils"> Back </NuxtLink>
    </div>

    <h3 class="mb-4 text-center text-xl">Drivers ({{ drivers.length }})</h3>

    <div
      class="grid grid-cols-2 gap-x-4 gap-y-6"
      :class="{ 'opacity-25 pointer-events-none': isLoading }"
    >
      <div
        v-for="(card, i) in drivers"
        class="border p-2 bg-black text-white rounded shadow-md"
        :class="{ 'opacity-25': !card.enabled }"
      >
        <p class="font-bold">{{ card.cardId }}</p>
        <p class="text-sm">{{ card.type }}</p>
        {{ card.cardId }}
        <img
          :src="`/img/drivers/${card.cardId}.avif`"
          class="w-full"
          @error="loadDefaultImage($event, card.type)"
        >
        <hr class="my-1" >
        <form
          class="grid grid-cols-1 gap-2"
          @submit.prevent="handleUpdate(card.type, card.cardId)"
        >
          <label>
            <span class="font-semibold">Card Name</span>
            <input
              v-model="drivers[i].cardName"
              type="text"
              placeholder="Name"
            >
          </label>
          <label>
            <span class="font-semibold">Current Points</span>
            <input
              v-model="drivers[i].currentPoints"
              type="number"
              placeholder="Current Points"
            >
          </label>
          <p class="text-sm text-yellow-600 italic">
            These fields will auto update when the main function runs
          </p>
          <label class="bg-blue-400 p-1">
            <span class="font-semibold">Current Rank</span>
            <input
              v-model="drivers[i].currentRank"
              type="number"
              placeholder="Current Rank"
            >
          </label>
          <label class="bg-blue-400 p-1">
            <span class="font-semibold">Current Tier</span>
            <input
              v-model="drivers[i].currentTier"
              type="number"
              placeholder="Current Tier"
            >
          </label>
          <label>
            <span class="font-semibold">Team ID</span>
            <input v-model="drivers[i].teamId" type="text" placeholder="Team" readonly disabled>
          </label>
          <label>
            <span class="font-semibold">Team Name</span>
            <input
              v-model="drivers[i].teamName"
              type="text"
              placeholder="Team Name"
              readonly disabled
            >
          </label>
          <label>
            <span class="font-semibold">Enabled</span>
            <input
              v-model="drivers[i].enabled"
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

    <hr class="my-10" >

    <h3 class="my-4 text-center text-xl">Cars ({{ cars.length }})</h3>

    <div
      class="grid grid-cols-2 gap-x-4 gap-y-6"
      :class="{ 'opacity-25 pointer-events-none': isLoading }"
    >
      <div
        v-for="(card, i) in cars"
        class="border p-2"
        :class="{ 'opacity-25': !card.enabled }"
      >
        <p class="font-bold">{{ card.cardId }}</p>
        <p class="text-sm">{{ card.type }}</p>
        {{ card.cardId }}
        <img
          :src="`/img/${card.type}s/${card.cardId}.avif`"
          @error="loadDefaultImage($event, card.type)"
        >
        <hr class="my-1" >
        <form
          class="grid grid-cols-1 gap-2"
          @submit.prevent="handleUpdate(card.type, card.cardId)"
        >
          <label>
            <span class="font-semibold">Card Name</span>
            <input v-model="card.cardName" type="text" placeholder="Name" >
          </label>
          <label>
            <span class="font-semibold">Current Points</span>
            <input
              v-model="cars[i].currentPoints"
              type="number"
              placeholder="Current Points"
            >
          </label>
          <p class="text-sm text-yellow-600 italic">
            These fields will auto update when the main function runs
          </p>
          <label class="bg-blue-400 p-1">
            <span class="font-semibold">Current Rank</span>
            <input
              v-model="cars[i].currentRank"
              type="number"
              placeholder="Current Rank"
            >
          </label>
          <label class="bg-blue-400 p-1">
            <span class="font-semibold">Current Tier</span>
            <input
              v-model="cars[i].currentTier"
              type="number"
              placeholder="Current Tier"
            >
          </label>
          <label>
            <span class="font-semibold">Team ID</span>
            <input v-model="drivers[i].teamId" type="text" placeholder="Team" readonly disabled>
          </label>
          <label>
            <span class="font-semibold">Team Name</span>
            <input
              v-model="cars[i].teamName"
              type="text"
              placeholder="Team cardName"
              readonly disabled
            >
          </label>
          <label>
            <span class="font-semibold">Enabled</span>
            <input
              v-model="cars[i].enabled"
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

    <hr class="my-10" >

    <h3 class="my-4 text-center text-xl">Team Principles ({{ tps.length }})</h3>

    <div
      class="grid grid-cols-2 gap-x-4 gap-y-6"
      :class="{ 'opacity-25 pointer-events-none': isLoading }"
    >
      <div
        v-for="(card, i) in tps"
        class="border p-2"
        :class="{ 'opacity-25': !card.enabled }"
      >
        <p class="font-bold">{{ card.cardId }}</p>
        <p>{{  card.teamName }}</p>
        <p class="text-sm">{{ card.type }}</p>
        {{ card.cardId }}
        <img
          :src="`/img/teamPrinciples/${card.cardId}.jpg`"
          @error="loadDefaultImage($event, card.type)"
        >
        <hr class="my-1" >
        <form
          class="grid grid-cols-1 gap-2"
          @submit.prevent="handleUpdate(card.type, card.cardId)"
        >
          <label>
            <span class="font-semibold">Card Name</span>
            <input v-model="card.cardName" type="text" placeholder="Name" >
          </label>
          <label>
            <span class="font-semibold">Current Points</span>
            <input
              v-model="card.currentPoints"
              type="number"
              placeholder="Current Points"
            >
          </label>
          <p class="text-sm text-yellow-600 italic">
            These fields will auto update when the main function runs
          </p>
          <label class="bg-blue-400 p-1">
            <span class="font-semibold">Current Rank</span>
            <input
              v-model="card.currentRank"
              type="number"
              placeholder="Current Rank"
            >
          </label>
          <label class="bg-blue-400 p-1">
            <span class="font-semibold">Current Tier</span>
            <input
              v-model="card.currentTier"
              type="number"
              placeholder="Current Tier"
            >
          </label>
          <label>
            <span class="font-semibold">Team ID</span>
            <input v-model="card.teamId" type="text" placeholder="Team" readonly disabled>
          </label>
          <label>
            <span class="font-semibold">Team Name</span>
            <input
              v-model="card.teamName"
              type="text"
              placeholder="Team cardName"
              readonly disabled
            >
          </label>
          <label>
            <span class="font-semibold">Enabled</span>
            <input
              v-model="card.enabled"
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
import type { iCard } from "~/types/card";

const db = useFirestore();

const drivers = ref<iCard[]>([]);
const cars = ref<iCard[]>([]);
const tps = ref<iCard[]>([]);

const isLoading = ref(false);

const getCards = async () => {
  const querySnapshot = await getDocs(collection(db, "cards"));
  querySnapshot.forEach((doc) => {
    const cardData = doc.data() as iCard;

    if (cardData.type === "driver") {
      drivers.value.push(cardData);
    } else if (cardData.type === "car") {
      cars.value.push(cardData);
    } else {
      tps.value.push(cardData);
    }
  });
};

const loadDefaultImage = (e: any, cardType: string) => {
  e.target.src = `/img/${cardType}-white.svg`;
  e.target.classList.add("broken-img");
};

onMounted(() => {
  getCards();
});

const handleUpdate = async (cardType: string, cardId: string) => {
  isLoading.value = true;

  let cardToUpdate;

  if (cardType === "driver") {
    cardToUpdate = drivers.value.find((driver) => driver.cardId === cardId);
  } else if (cardType === "car") {
    cardToUpdate = cars.value.find((car) => car.cardId === cardId);
  }

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
