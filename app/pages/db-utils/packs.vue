<template>
  <div>
    <h1 class="text-center text-lg">All Packs</h1>

    <div class="grid grid-cols-auto gap-1 my-4">
      <NuxtLink to="/db-utils"> Back </NuxtLink>
    </div>

    <Loader v-if="isLoading" />

    <div class="space-y-8">
      <div v-for="(pack, i) in packs" :key="pack.packId" class="border p-2 rounded">
        <div class="space-y-4">
          <div class="italic text-gray-600">
            <p>Pack ID: {{ pack.packId }}</p>
            <p>Cards included in pack: {{ pack.cardsIncluded }}</p>
          </div>

          <div v-if="packs[i]">

          <div>
            <label>
              <span>Pack name:</span>
              <input v-model="packs[i].packName" type="text" class="text-lg">
              <span class="block italic text-sm text-gray-400">(This will be visible to the user)</span>
            </label>
          </div>

          <!-- <div>
            <label>
              <span>Pack type:</span>
              {{ packs[i].type }}
              <select v-model="packs[i].type">
                <option
                  v-for="type in Object.values(PackType)"
                  :key="type"
                  :value="type"
                >
                  {{ type }}
                </option>
              </select>
            </label>
            <span class="block italic text-sm text-gray-400">(What type of loot should be in this pack?)</span>
          </div> -->

            <div>
              <span>Pack cost:</span> 
              <input v-model="pack.cost" type="number">
            </div>
          
            <div>
              <label class="flex">
                <span :class="['mr-1', packs[i].hiddenFromStore && 'text-red-600']">Hidden from store:</span>
                <input v-model="packs[i].hiddenFromStore" type="checkbox" class="w-4">
              </label>
              <span class="block italic text-sm text-gray-400">(Should this pack be visible in the store?)</span>
            </div>

            <div>
              <label class="flex">
                <span :class="['mr-1', packs[i].isEmergencyPack && 'text-red-600']">Emergency pack:</span>
                <input v-model="packs[i].isEmergencyPack" type="checkbox" class="w-4">
              </label>
              <span class="block italic text-sm text-gray-400">(Is this pack an emergency pack? Emergency packs only appear for a user if they are missing the required number of cards to submit a team)</span>
            </div>
          
            <div>
              <p class="font-semibold underline">Slots:</p>
              <div class="grid grid-cols-2 gap-4">
                <div v-for="(packSlot, key) in pack.slots" :key="key" class="p-2 rounded bg-gray-800">
                  <p class="font-semibold underline">Slot {{ key }}</p>

                  <div class="space-y-4 leading-tight">
                    <div v-if="packs[i].slots[key]">
                      <label>
                        <span>Forced Rarity:</span>
                        <select v-model="packs[i].slots[key].forcedRarity">
                          <option :value="null">None</option>
                          <option
                            v-for="rarity in Object.keys(iCardRarity).filter(item => isNaN(item as any))"
                            :key="rarity"
                            :value="rarity"
                          >
                            {{ rarity }}
                          </option>
                        </select>
                      </label>
                    </div>

                    <div v-if="packs[i].slots[key]">
                      <p class="font-semibold underline">
                        Rarity Chances: 
                        (<span :class="{
                          'text-red-600': calcRarityTotal(packs[i].slots[key].rarityChances) !== 100,
                          'text-green-600': calcRarityTotal(packs[i].slots[key].rarityChances) === 100
                        }">
                          {{ calcRarityTotal(packs[i].slots[key].rarityChances) }}
                        </span>)
                      </p>
                      <div class="grid grid-cols-1 gap-2" v-if="packs[i].slots[key]">
                        <div class="grid grid-cols-2 gap-2 items-center">
                          <span>Common:</span>
                          <input
                            v-model="packs[i].slots[key].rarityChances[iCardRarity.COMMON]"
                            type="number"
                          >
                        </div>
                        <div class="grid grid-cols-2 gap-2 items-center">
                          <span>Uncommon:</span>
                          <input
                            v-model="packs[i].slots[key].rarityChances[iCardRarity.UNCOMMON]"
                            type="number"
                          >
                        </div>
                        <div class="grid grid-cols-2 gap-2 items-center">
                          <span>Rare:</span>
                          <input
                            v-model="packs[i].slots[key].rarityChances[iCardRarity.RARE]"
                            type="number"
                          >
                        </div>
                        <div class="grid grid-cols-2 gap-2 items-center">
                          <span>Legendary:</span>
                          <input
                            v-model="packs[i].slots[key].rarityChances[iCardRarity.LEGENDARY]"
                            type="number"
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-center">
              <Button
                classes="bg-green-600"
                @click="updatePack(pack.packId)"
                >Update Pack</Button
              >
            </div>

          <!--

          <div>
            <hr >
          </div>

          <div class="text-center">
            <Button
              classes="bg-green-600"
              @click="updatePack(pack.packId)"
              >Update Pack</Button
            >
          </div> -->
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <h2 class="text-xl">Add new pack</h2>
      <form class="border p-2 bg-yellow-700" @submit.prevent="addNewPack">
        <div class="grid grid-flow-row gap-2">
          <input
            v-model="formData.packName"
            type="text"
            placeholder="Pack Name"
          >
          <input v-model="formData.packId" type="text" placeholder="Pack ID" >
          <label for="cost">
            Cost:
            <input v-model="formData.cost" name="cost" type="number" >
          </label>
          <label class="flex items-center">
            <p>Hidden from store?</p>
            <div class="ml-2">
              <input v-model="formData.hiddenFromStore" type="checkbox" >
            </div>
          </label>
          <label class="flex items-center">
            <p>is this an emergency pack?</p>
            <div class="ml-2">
              <input v-model="formData.isEmergencyPack" type="checkbox" >
            </div>
          </label>
          <label for="cardsIncluded">
            Number of slots:
            <input
              v-model="formData.cardsIncluded"
              name="cardsIncluded"
              type="number"
            >
          </label>
          <Button type="submit" bg-color-class="bg-green-300">Submit</Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import type { iPack, iSlot } from "~/types/pack";
import { CardType, iCardRarity } from "~/types/card";
// import { LootType, PackType } from '~/types/pack';

const db = useFirestore();

const packs = ref<iPack[]>([]);
const isLoading = ref(false);

const formData = ref<iPack>({
  cardsIncluded: 5,
  cost: 100,
  hiddenFromStore: false,
  isEmergencyPack: false,
  packId: '',
  packName: '',
  slots: {}
});

const getPacks = async () => {
  const querySnapshot = await getDocs(collection(db, "packs"));
  querySnapshot.forEach((doc) => {
    const packData = doc.data() as iPack;
    packs.value.push(packData);
  });
};

onMounted(() => {
  getPacks();
});

const calcRarityTotal = (rarityChances: Record<iCardRarity, number>) => {
  return Object.values(rarityChances).reduce((total, chance) => total + chance, 0);
};

const updatePack = async (packId: string) => {
  isLoading.value = true;

  const packIndex = packs.value.findIndex((pack) => pack.packId === packId);
  const packToUpdate = packs.value[packIndex];

  const packsRef = collection(db, "packs");
  await setDoc(doc(packsRef, packId), packToUpdate);

  isLoading.value = false;
};

const addNewPack = async () => {
  isLoading.value = true;

  const packSlots: Record<string, iSlot> = {}
  
  for (let i = 1; i <= formData.value.cardsIncluded; i++) {
    packSlots[i] = {
      forcedRarity: null,
      rarityChances: {
        [iCardRarity.COMMON]: 0,
        [iCardRarity.UNCOMMON]: 0,
        [iCardRarity.RARE]: 0,
        [iCardRarity.LEGENDARY]: 0
      }
    };
  }

  const newPack: iPack = {
    cardsIncluded: formData.value.cardsIncluded,
    cost: formData.value.cost,
    hiddenFromStore: formData.value.hiddenFromStore,
    isEmergencyPack: formData.value.isEmergencyPack,
    packId: formData.value.packId,
    packName: formData.value.packName,
    slots: packSlots,
  };

  const packsRef = collection(db, "packs");
  await setDoc(doc(packsRef, newPack.packId), newPack);

  isLoading.value = false;
};
</script>

<style scoped>
input[type="text"],
input[type="number"],
select {
  @apply w-full;
  @apply border;
  @apply bg-gray-600;
  @apply p-1;
}
</style>
