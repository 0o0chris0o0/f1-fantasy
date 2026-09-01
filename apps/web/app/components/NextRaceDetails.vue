<template>
  <div
    v-if="roundInfo"
    class="bg-gray-950 rounded py-4 text-center font-headline"
    :class="{
      'border-2 border-error': isEditingClosed(
        roundInfo.teamEditCutoff,
        roundInfo.nextRaceStart,
      ),
    }"
  >
    <p>
      Current round: <strong>Round {{ roundInfo.currentRound }}</strong>
    </p>
    <p class="text-xl font-semibold font-f1">{{ roundInfo.nextRaceName }}</p>
    <p class="mb-2">{{ raceDateV2(roundInfo.nextRaceStart) }}</p>
    <div class="text-lg">
      <p
        v-if="
          isEditingClosed(roundInfo.teamEditCutoff, roundInfo.nextRaceStart)
        "
        class="font-bold text-error"
      >
        Team editing has now closed
      </p>
      <p v-else class="text-warning">
        Team editing ends in:
        <span class="font-bold">{{
          timeToEdit(roundInfo.teamEditCutoff)
        }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { timeToEdit } from "~/utils/dateFuncs";

const roundInfo = await useRoundInfo();
</script>

<style scoped></style>
