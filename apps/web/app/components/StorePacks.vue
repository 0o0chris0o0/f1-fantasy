<template>
  <div class="grid grid-cols-1 gap-12">
    <StorePack v-for="pack in filteredPacks" :key="pack.packId" :pack="pack"/>
  </div>
</template>

<script setup lang="ts">
import type { iPack,  } from "@f1pick6/shared";
import type {
  QueryDocumentSnapshot} from "firebase/firestore";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const db = useFirestore();

const availablePacks = useState<iPack[]>('availablePacks', () => []);

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

  activePacks.sort((a, b) => a.cost - b.cost);

  return activePacks;
};

</script>

<style lang="scss" scoped>
</style>
