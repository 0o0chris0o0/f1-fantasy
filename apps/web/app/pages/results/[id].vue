<template>
  <PageHeader>Results</PageHeader>
  
  <div class="mt-4 space-y-4">
    <Result v-for="result in results" :result="result" />
  </div>
</template>

<script setup lang="ts">
import type { iResult } from '@f1pick6/shared';
import { doc, getDoc } from 'firebase/firestore';

definePageMeta({
  middleware: "auth",
});

const db = useFirestore();
const route = useRoute();

const results = useState<iResult[]>();

await callOnce(async () => {
  const userId: string = route.params.id as string;

  if (userId) {
    // get next race details
    const playerRef = doc(db, 'players', userId);
    const playerSnap = await getDoc(playerRef);

    if (playerSnap.exists()) {
      results.value = playerSnap.get('results');
    } else {
      navigateTo('/home');
    }
  } else {
      navigateTo('/home');
  }
});
</script>

<style lang="scss" scoped></style>
