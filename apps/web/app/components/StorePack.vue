<template>
  <div>
    <Loader v-if="isLoading"/>
    <div 
      class="relative flex shadow-inner-custom border border-gray-700 rounded-lg"
    >
      <ClientOnly>
        <img 
          :src="`/img/pack-${pack.packId}.png`"
          class="absolute top-1/2 w-28 -translate-y-1/2" 
          @error="loadFallbackPackImage($event)"
        >
      </ClientOnly>
      <div class="ml-28 w-full p-4">
        <div class="mb-2">
          <div class="font-f1 font-semibold flex justify-between">
            <p>{{ pack.packName }}</p>
            <div class="flex items-center justify-between">
              <Icon name="bi:coin" class="text-yellow-500" size="1.2em" />
              <p class="text-yellow-500 ml-1">{{ pack.cost }}</p>
            </div>
          </div>
          <p class="text-sm">Includes <span class="font-semibold text-base">{{ pack.cardsIncluded }}</span> card{{ pack.cardsIncluded > 1 ? 's' : ''}}</p>
        </div>
        <Button
          v-if="userObj"
          version="green"
          text-color-class="text-white text-sm"
          :disabled="userObj.money < pack.cost"
          @click="handleBuyPack"
        >
          Buy pack
        </Button>
      </div>
      <div class="absolute right-2 bottom-2">
        <button @click="openPackInfoModal">
          <Icon name="bi:info-circle" size="1.2em" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { iPack } from '@f1pick6/shared/types';
import { loadFallbackPackImage } from "~/utils/loadDefaultImage";
import PackInfoModal from './modals/PackInfoModal.vue';
import { useModal } from 'vue-final-modal';
import PackConfirmationModal from './modals/PackConfirmationModal.vue';

const props = defineProps<{
  pack: iPack;
}>();

const user = useCurrentUser();
const userStore = useUserStore();
const notificationStore = useNotificationStore();

const { userObj } = storeToRefs(userStore);
const isLoading = ref(false);

const { open: openPackInfoModal, close: closePackInfoModal } = useModal({
  component: PackInfoModal,
  attrs: {
    pack: props.pack,
    close: () => {
      closePackInfoModal();
    }
  },
});

const { open: openPackConfirmationModal, close: closePackConfirmationModal } = useModal({
  component: PackConfirmationModal,
  attrs: {
    pack: props.pack,
    close: () => {
      closePackConfirmationModal();
    }
  },
});

const handleBuyPack = async () => {
  isLoading.value = true;

  await giveUserPack(props.pack);

  openPackConfirmationModal();
  
  isLoading.value = false;
};

</script>

<style scoped>

</style>