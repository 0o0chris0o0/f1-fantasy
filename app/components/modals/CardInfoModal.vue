<template>
  <VueFinalModal
    class="flex justify-center items-center"
    :overlay-style="{ backgroundColor: 'rgba(0,0,0,0.9)' }"
    content-class="flex flex-col p-10 bg-gray-600 shadow-inner-custom rounded-lg space-y-4 modal-container"
  >
    <div v-if="cardData">
      <p class="font-f1 text-2xl font-bold text-center text-gray-200 mb-4">{{ cardData.cardName }}</p>
      <div class="grid grid-cols-2 gap-4">
        <div class="w-56 mx-auto mb-6">
          <Card :card="cardData" />
        </div>
        <div class="w-56">
          <div class="text-sm font-semibold text-gray-300 space-y-2">
            <p>Nationality: <span class="font-normal">{{ cardData.nationality }}</span></p>
            <p>Team: <span class="font-normal">{{ cardData.teamName }}</span></p>
          </div>
          <hr class="my-2 opacity-25"/>
          <div class="text-sm font-semibold text-gray-300 space-y-2">
            <p>Average Qualifying Pos: <span class="font-normal">{{ cardData.stats.averageQualifyingPosition }}</span></p>
            <p>Average Race Pos: <span class="font-normal">{{ cardData.stats.averageRacePosition }}</span></p>
            <p>DNF's: <span class="font-normal">{{ cardData.stats.numberOfDNFs }}</span></p>
          </div>
          <hr class="my-2 opacity-25"/>
          <div class="text-sm font-semibold text-gray-300 space-y-2">
            <p>Home Races:</p>
            <p class="font-normal" v-for="race in cardData.homeRaces">Round. {{ race.round }} - {{ race.raceName }}</p> 
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 text-center gap-4">
        <div>
          <Button @click="props.close" version="green">Close</Button>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from "vue-final-modal";
import type { iPack } from "~/types/pack";
import { iCardRarity, type iCardInUsersCards, type iConstructorCard, type iDriverCard } from '~/types/card';
import type { Ref } from 'vue'

const userStore = useUserStore();

const { userObj } = storeToRefs(userStore);

const props = defineProps<{
  cardData: iDriverCard | iConstructorCard | null;
  userData?: iCardInUsersCards | null;
  close?: () => void;
}>();

</script>

<style scoped></style>

<style lang="scss" scoped>
</style>
