<template>
  <div v-if="userObj">
    <div class="grid grid-cols-12 px-4 mb-6 first:items-center">
      <PageHeader class="col-span-6 col-start-4"> Store </PageHeader>
      <div class="col-span-3 flex items-center justify-end">
        <Icon name="bi:cash-coin" class="text-yellow-500" size="1.5em" />
        <p class="font-f1 font-semibold text-lg text-yellow-500 ml-2">{{ userObj.money }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-12">
      <StorePack v-for="pack in filteredPacks" :key="pack.packId" :pack="pack"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  QueryDocumentSnapshot} from "firebase/firestore";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import type { iPack } from "@/types/pack";

const db = useFirestore();
const userStore = useUserStore();

const { userObj } = storeToRefs(userStore);

definePageMeta({
  middleware: "auth",
});

const availablePacks = useState<iPack[]>('availablePacks', () => []);

const {
  shouldUserSeeEmergencyPacks,
  emergencyPacksAvailableToUser,
} = storeToRefs(userStore);

await callOnce(async () => {
  const packsRef = collection(db, "packs");
  const q = query(packsRef, where("hiddenFromStore", "==", false));
  const querySnapshot = await getDocs(q);

  // get all packs
  availablePacks.value = querySnapshot.docs.map(
    (packDoc: QueryDocumentSnapshot) => packDoc.data() as iPack
  );
});

const filteredPacks = computed(() => {
  return filterPacks();
});

const filterPacks = () => {
  let activePacks = availablePacks.value;

  // if user shouldn't see emergency packs, remove them
  if (!shouldUserSeeEmergencyPacks.value) {
    activePacks = activePacks.filter((pack) => !pack.isEmergencyPack);
  } else {
    activePacks = activePacks.filter(
      (pack) =>
        !pack.isEmergencyPack ||
        emergencyPacksAvailableToUser.value.includes(pack.packId)
    );
  }

  activePacks.sort((a, b) => a.cost - b.cost);

  return activePacks;
};
</script>

<style lang="scss" scoped></style>
