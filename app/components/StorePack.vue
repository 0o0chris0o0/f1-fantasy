<template>
  <div>
    <div 
      class="relative flex shadow-inner-custom border border-gray-700 rounded-lg rotate-"
    >
      <img 
        :src="`/img/pack-${pack.packId}.png`"
        class="absolute top-1/2 w-28 -translate-y-1/2" 
        @error="loadFallbackPackImage($event)"
      >
      <div class="ml-28 w-full p-4">
        <div class="mb-2">
          <div class="font-f1 font-semibold flex justify-between">
            <p>{{ pack.packName }}</p>
            <div class="flex items-center justify-between">
              <img src="/img/coin.svg" >
              <p class="text-yellow-500 ml-1">{{ pack.cost }}</p>
            </div>
          </div>
          <p class="text-sm">Includes <span class="font-semibold text-base">{{ pack.cardsIncluded }}</span> card{{ pack.cardsIncluded > 1 ? 's' : ''}}</p>
        </div>
        <Button
          v-if="userFromStore"
          version="green"
          text-color-class="text-white text-sm"
          :disabled="userFromStore.money < pack.cost"
          @click="navigateTo('/open-pack?packId=' + pack.packId)"
        >
          Buy pack
        </Button>
      </div>
      <div class="absolute right-2 bottom-2">
        <button @click="open">
          <img src="/img/info.svg" class="w-5">
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { iPack } from '~/types/pack';
import { loadFallbackPackImage } from "~/utils/loadDefaultImage";
import PackInfoModal from './modals/PackInfoModal.vue';
import { useModal } from 'vue-final-modal';

const props = defineProps<{
  pack: iPack;
}>();

const userStore = useUserStore();

const {
  userFromStore,
} = storeToRefs(userStore);

const { open, close } = useModal({
  component: PackInfoModal,
  attrs: {
    pack: props.pack,
    close: () => {
      close();
    }
  },
});

</script>

<style scoped>

</style>