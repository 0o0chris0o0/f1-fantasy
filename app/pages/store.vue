<template>
  <Loader v-if="isLoading"/>
  <div v-if="userFromStore">
    <div class="grid grid-cols-12 px-4 mb-6 first:items-center">
      <PageHeader class="col-span-6 col-start-4"> Store </PageHeader>
      <div class="col-span-3 flex items-center justify-end">
        <img src="/img/coins.svg" class="w-6" >
        <p class="font-f1 font-semibold text-lg text-yellow-500 ml-2">{{ userFromStore.money }}</p>
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
  writeBatch,
  doc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useNotificationStore } from "~/stores/notification";

import type { iPack } from "@/types/pack";
import { giveUserPack } from "@/utils/giveUserPack";

const db = useFirestore();
const userStore = useUserStore();
const notificationStore = useNotificationStore();

definePageMeta({
  middleware: "auth",
});

const isLoading = ref(false);
const availablePacks = useState<iPack[]>('availablePacks', () => []);

const {
  userFromStore,
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

// const buyPack = async (pack: iPack) => {
//   if (userFromStore.value?.userId) {
//     isLoading.value = true;

//     const batch = writeBatch(db);

//     const playerRef = doc(db, "players", userFromStore.value.userId);

//     // reduce players money
//     batch.update(playerRef, {
//       money: userFromStore.value.money - pack.cost,
//     });

//     // add pack to player
//     await giveUserPack(pack.packId);

//     await batch.commit();

//     isLoading.value = false;

//     notificationStore.addNotification({
//       version: 'success',
//       message: `You just bought a ${pack.packName}`
//     })
//   }
// };

// watch(emergencyPacksAvailableToUser, () => {
//   availablePacks.value = filterPacks();
// });

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

  return activePacks;
};
</script>

<style lang="scss" scoped></style>
