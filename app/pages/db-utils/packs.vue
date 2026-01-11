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

          <div>
            <label>
              <span>Pack name:</span>
              <input v-model="packs[i].packName" type="text" class="text-lg">
              <span class="block italic text-sm text-gray-400">(This will be visible to the user)</span>
            </label>
          </div>

          <div>
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
          </div>

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
            <label class="flex">
              <span :class="['mr-1', packs[i].increaseTier1Chance && 'text-red-600']">Increase Tier 1 chance:</span>
              <input v-model="packs[i].increaseTier1Chance" type="checkbox" class="w-4">
            </label>
            <span class="block italic text-sm text-gray-400">(Should this pack increase the chance of getting a tier 1 card everytime one is not selected? This will increase the chance of getting a Tier 1 card in each slot where a Tier 1 is possible.)</span>
          </div>

          <div>
            <p class="font-semibold underline">Slots:</p>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="(packSlot, key) in pack.slots" :key="key" class="p-2 rounded bg-gray-800">
                <p class="font-semibold underline">Slot {{ key }}</p>

                <div class="space-y-4 leading-tight">

                  <div v-if="packs[i].type === PackType.MULTI">
                    <p>Forced loot type</p>
                    <select v-model="packSlot.forcedLootType">
                      <option default value="any">any</option>
                      <option
                        v-for="type in Object.values(LootType)"
                        :key="type"
                        :value="type"
                      >
                        {{ type }}
                      </option>
                    </select>
                    <p class="text-xs">(Force this slot to give a card of a certain type)</p>
                  </div>

                  <div
                    v-if="packs[i].type === PackType.MULTI && packSlot.forcedLootType === 'any'"
                    class="border p-2 space-y-1 -mx-1" 
                    :class="{
                      'border-red-500': packSlot.lootCardChance + packSlot.lootTokenChance +  packSlot.lootTyreChance !== 100,
                      'border-green-500': packSlot.lootCardChance + packSlot.lootTokenChance +  packSlot.lootTyreChance === 100
                    }"
                  >
                    <p 
                      class="text-center"
                      :class="{
                        'text-red-500': packSlot.lootCardChance + packSlot.lootTokenChance +  packSlot.lootTyreChance !== 100,
                        'text-green-500': packSlot.lootCardChance + packSlot.lootTokenChance +  packSlot.lootTyreChance === 100
                      }"
                    >
                        {{ packSlot.lootCardChance + packSlot.lootTokenChance +  packSlot.lootTyreChance }}%
                    </p>
                    <div>
                      <p>Card loot chance:</p>
                      <input v-model="packSlot.lootCardChance" type="number" >
                    </div>

                    <div>
                      <p>Token loot chance:</p>
                      <input v-model="packSlot.lootTokenChance" type="number" >
                    </div>

                    <div>
                      <p>Tyre loot chance:</p>
                      <input v-model="packSlot.lootTyreChance" type="number" >
                    </div>
                  </div>

                  <div v-if="packs[i].type === PackType.CARDS || (packs[i].type === PackType.MULTI && (packSlot.forcedLootType === 'any' && packSlot.lootCardChance) || packSlot.forcedLootType === LootType.CARD)">
                    <p>Forced card type</p>
                    <select v-model="packSlot.forcedCardType">
                      <option default value="any">any</option>
                      <option
                        v-for="type in Object.values(CardType)"
                        :key="type"
                        :value="type"
                      >
                        {{ type }}
                      </option>
                    </select>
                    <p class="text-xs">(Force this slot to give a card of a certain type)</p>
                  </div>

                  <div v-if="packs[i].type === PackType.CARDS || (packs[i].type === PackType.MULTI && (packSlot.forcedLootType === 'any' && packSlot.lootCardChance)|| packSlot.forcedLootType === LootType.CARD)">
                    <p>Guaranteed new card chance</p>
                    <input v-model="packSlot.newCardChance" type="number" >
                    <p class="text-xs">(Chance of getting a guaranteed new card)</p>
                  </div>

                  <div
                    v-if="packs[i].type === PackType.CARDS || (packs[i].type === PackType.MULTI && (packSlot.forcedLootType === 'any' && packSlot.lootCardChance) || packSlot.forcedLootType === LootType.CARD)"
                    class="border p-2 space-y-1 -mx-1"
                    :class="{
                      'border-red-500': packSlot.tier1Chance + packSlot.tier2Chance +  packSlot.tier3Chance !== 100,
                      'border-green-500': packSlot.tier1Chance + packSlot.tier2Chance +  packSlot.tier3Chance === 100
                    }"
                  >
                    <p 
                      class="text-center"
                      :class="{
                        'text-red-500': packSlot.tier1Chance + packSlot.tier2Chance +  packSlot.tier3Chance !== 100,
                        'text-green-500': packSlot.tier1Chance + packSlot.tier2Chance +  packSlot.tier3Chance === 100
                      }"
                    >
                        {{ packSlot.tier1Chance + packSlot.tier2Chance +  packSlot.tier3Chance }}%
                    </p>
                    <div>
                      <p>Tier 1 chance:</p>
                      <input v-model="packSlot.tier1Chance" type="number" >
                    </div>

                    <div>
                      <p>Tier 2 chance:</p>
                      <input v-model="packSlot.tier2Chance" type="number" >
                    </div>

                    <div>
                      <p>Tier 3 chance:</p>
                      <input v-model="packSlot.tier3Chance" type="number" >
                    </div>
                  </div>

                  <div v-if="packs[i].type === PackType.CARDS || (packs[i].type === PackType.MULTI && (packSlot.forcedLootType === 'any' && packSlot.lootCardChance) || packSlot.forcedLootType === LootType.CARD)">
                    <p>Variant chance:</p>
                    <input v-model="packSlot.variantChance" type="number" >
                  </div>

                  <div
                    v-if="packs[i].type === PackType.TYRES || (packs[i].type === PackType.MULTI && (packSlot.forcedLootType === 'any' && packSlot.lootTyreChance) || packSlot.forcedLootType === LootType.TYRE)"
                    class="border p-2 space-y-1 -mx-1" 
                    :class="{
                      'border-red-500': packSlot.hardTyreChance + packSlot.mediumTyreChance +  packSlot.softTyreChance !== 100,
                      'border-green-500': packSlot.hardTyreChance + packSlot.mediumTyreChance +  packSlot.softTyreChance === 100
                    }"
                  >
                    <p 
                      class="text-center"
                      :class="{
                        'text-red-500': packSlot.hardTyreChance + packSlot.mediumTyreChance +  packSlot.softTyreChance !== 100,
                        'text-green-500': packSlot.hardTyreChance + packSlot.mediumTyreChance +  packSlot.softTyreChance === 100
                      }"
                    >
                        {{ packSlot.hardTyreChance + packSlot.mediumTyreChance +  packSlot.softTyreChance }}%
                    </p>
                    <div>
                      <p>Hard tyre chance:</p>
                      <input v-model="packSlot.hardTyreChance" type="number" >
                    </div>

                    <div>
                      <p>Medium tyre chance:</p>
                      <input v-model="packSlot.mediumTyreChance" type="number" >
                    </div>

                    <div>
                      <p>Soft tyre chance:</p>
                      <input v-model="packSlot.softTyreChance" type="number" >
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>

          <div>
            <hr >
          </div>

          <div class="text-center">
            <Button
              classes="bg-green-600"
              @click="updatePack(pack.packId)"
              >Update Pack</Button
            >
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
          <label>
            Pack type
            <select v-model="formData.packType">
              <option
                v-for="type in Object.values(PackType)"
                :key="type"
                :value="type"
              >
                {{ type }}
              </option>
            </select>
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
          <label class="flex items-center">
            <p>Should this pack increase the Tier 1 chance?</p>
            <div class="ml-2">
              <input v-model="formData.increaseTier1Chance" type="checkbox" >
            </div>
          </label>
          <label for="numberOfSlots">
            Number of slots:
            <input
              v-model="formData.slots"
              name="numberOfSlots"
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
import { CardType } from "~/types/card";
import { LootType, PackType } from '~/types/pack';

const db = useFirestore();

const packs = ref<iPack[]>([]);
const isLoading = ref(false);

const formData = ref({
  packName: "",
  packId: "",
  packType: 'cards',
  hiddenFromStore: false,
  slots: 5,
  cost: 100,
  isEmergencyPack: false,
  increaseTier1Chance: false,
});

const getPacks = async () => {
  const querySnapshot = await getDocs(collection(db, "packs"));
  querySnapshot.forEach((doc) => {
    const packData = doc.data() as iPack;
    packs.value.push(packData);
  });

  console.log(packs.value);
};

onMounted(() => {
  getPacks();
});

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

  const packSlots: Record<string, iSlot> = {};
  for (let i = 1; i <= formData.value.slots; i++) {
    packSlots[i] = {
      forcedCardType: 'any',
      forcedLootType: 'any',
      hardTyreChance: 0,
      lootCardChance: 0,
      lootTokenChance: 0,
      lootTyreChance: 0,
      mediumTyreChance: 0,
      newCardChance: 0,
      softTyreChance: 0,
      tier1Chance: 0,
      tier2Chance: 0,
      tier3Chance: 0,
      variantChance: 0,
    };
  }

  const newPack: iPack = {
    packName: formData.value.packName,
    cardsIncluded: formData.value.slots,
    cost: formData.value.cost,
    hiddenFromStore: formData.value.hiddenFromStore,
    isEmergencyPack: formData.value.isEmergencyPack,
    packId: formData.value.packId,
    increaseTier1Chance: formData.value.increaseTier1Chance,
    type: formData.value.packType as PackType,
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
