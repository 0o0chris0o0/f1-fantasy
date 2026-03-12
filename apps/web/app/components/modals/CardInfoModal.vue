<template>
  <VueFinalModal
    class="flex justify-center items-center"
    :overlay-style="{ backgroundColor: 'rgba(0,0,0,0.97)' }"
    content-class="w-full md:w-auto modal-container"
  >
    <div v-if="cardData">
      <button class="absolute top-1 right-1" @click="close">
        <Icon name="ic:outline-close" color="white" class="text-4xl" />
      </button>
      <p 
        class="text-center font-f1 text-sm tracking-wide"
        :class="{
          'text-common': userData?.rarity === iCardRarity.COMMON,
          'text-uncommon': userData?.rarity === iCardRarity.UNCOMMON,
          'text-rare': userData?.rarity === iCardRarity.RARE,
          'text-legendary': userData?.rarity === iCardRarity.LEGENDARY
        }"
      >
        {{ userData?.rarity }}
      </p>
      <p class="font-f1 text-2xl font-bold text-center text-gray-200 mb-4">{{ cardData.cardName }}</p>
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <div class="w-56 mx-auto">
          <UserCard v-if="userData" :card="cardData" :rarity="userData.rarity" :level="userData.level" :quantity="userData.quantity" hideUserData />
          <Card v-else :card="cardData" />
        </div>
        <div class="w-56 text-sm font-bold text-gray-300">
          <div class="space-y-1">
            <p>Nationality: <span class="font-normal">{{ cardData.nationality }}</span></p>
            <p v-if="cardData.type === CardType.DRIVER">Team: <span class="font-normal">{{ cardData.teamName }}</span></p>
          </div>
          <hr class="my-2 opacity-25"/>
          <div class="space-y-1">
            <p>Average Pts per round: <span class="font-normal">{{ cardData.stats.averageFantasyPoints }}<span class="text-xs">Pts</span></span></p>
            <template v-if="cardData.type === CardType.DRIVER">
              <p>Average Qualifying Pos: <span class="font-normal">P{{ (cardData.stats as iDriverStats).averageQualifyingPosition }}</span></p>
              <p>Average Race Pos: <span class="font-normal">P{{ (cardData.stats as iDriverStats).averageRacePosition }}</span></p>
            </template>
            <p>DNF's: <span class="font-normal">{{ cardData.stats.numberOfDNFs }}</span></p>
          </div>
          <hr class="my-2 opacity-25"/>
          <div class="space-y-2">
            <p>Home Races:</p>
            <p v-if="cardData.homeRaces.length" v-for="race in cardData.homeRaces">
              Round. {{ race.round }} - <span class="font-normal text-xs">{{ race.raceName }} ({{ prettyRaceDate(race.raceStart) }})</span>
            </p>
            <p v-else class="italic font-normal opacity-40">
              This card has no home races
            </p>
          </div>
          <hr class="my-2 opacity-25"/>
          <div v-if="userData" class="mt-4 flex gap-6 items-center font-f1 text-2xl">
            <div class="flex items-center gap-2">
              <Icon name="bi:stack" />
              <p>x{{ userData.quantity }}</p>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="game-icons:steering-wheel" />
              <p>{{ userData.xp }}</p>
            </div>
          </div>
          <div class="flex items-center gap-1 mt-2">
            <template v-if="userData?.inCollection">
              <Icon 
                name="lets-icons:book-check-fill" 
                class="text-2xl"
                :customize="customizeIcon"
              />
              <p>Collected on ???</p>
            </template>
            <template v-else>
              <Icon 
                name="lets-icons:book-check" 
                class="opacity-40 text-2xl"
              />
              <p class="italic font-normal opacity-40">Not in collection</p>
            </template>
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
import { CardType, iCardRarity } from '@f1pick6/shared/types';
import type { iCardInUsersCards, iConstructorCard, iDriverCard, iDriverStats } from '@f1pick6/shared/types';

const props = defineProps<{
  cardData?: iDriverCard | iConstructorCard;
  userData?: iCardInUsersCards
  close?: () => void;
}>();

const customizeIcon = (content: string) => {
  return content
    .replace(/fill="[^"]*"/g, `fill="#84cc16"`) // Change fill color to red
    .replace(/stroke="[^"]*"/g, `stroke="#84cc16"`) // Change stroke color to red

}

</script>

<style scoped></style>

<style lang="scss">
.modal-container {
  max-height: 100vh;
  overflow: auto;
  padding: 2rem 0;
}
</style>
