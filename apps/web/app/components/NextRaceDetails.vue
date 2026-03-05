<template>
  <div
    class="bg-gray-950 rounded py-4 text-center"
    :class="{
      'border-2 border-red-600': isEditingClosed(roundInfo.teamEditCutoff, roundInfo.nextRaceStart)
    }"
  >
    <p>
      Current round: <strong>Round {{ roundInfo.currentRound }}</strong>
    </p>
    <p class="text-xl font-semibold">{{ roundInfo.nextRaceName }}</p>
    <p>{{ raceDateV2(roundInfo.nextRaceStart) }}</p>
    <div class="text-lg">
      <p v-if="isEditingClosed(roundInfo.teamEditCutoff, roundInfo.nextRaceStart)" class="font-bold text-red-600">
        Team editing has now closed
      </p>
      <p v-else class="text-orange-500">
        Team editing ends in:
        <span class="font-bold">{{ timeToEdit(roundInfo.teamEditCutoff) }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { doc, getDoc } from 'firebase/firestore';
import type { iRoundInfo } from '@f1pick6/shared/types';
import { timeToEdit } from '~/utils/dateFuncs';

const db = useFirestore();

const roundInfo = useState<iRoundInfo>();

await callOnce(async () => {
  // get next race details
  const roundInfoRef = doc(db, 'appData', 'roundInfo');
  const roundInfoSnapshot = await getDoc(roundInfoRef);

  if (roundInfoSnapshot.exists()) {
    roundInfo.value = roundInfoSnapshot.data() as iRoundInfo;
  }
});
</script>

<style scoped></style>
