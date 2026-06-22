<template>
  <div>
    <Loader v-if="isLoading" />
    <div
      class="relative flex shadow-inner-custom border border-gray-700 rounded-lg"
    >
      <img
        :src="`/img/${pack.packId}-pack.png`"
        class="absolute top-1/2 w-28 -translate-y-1/2 ml-2"
        @error="loadFallbackPackImage($event)"
      />
      <div class="ml-28 w-full p-4">
        <div class="mb-2">
          <div class="font-f1 font-semibold flex justify-between">
            <p>{{ pack.packName }}</p>
            <div class="flex items-center justify-between">
              <Icon name="bi:coin" class="text-yellow-500" size="1.2em" />
              <p class="text-yellow-500 ml-1">{{ pack.cost }}</p>
            </div>
          </div>
          <p class="text-sm">
            Includes
            <span class="font-semibold text-base">{{
              pack.cardsIncluded
            }}</span>
            card{{ pack.cardsIncluded > 1 ? "s" : "" }}
          </p>
        </div>
        <Button
          v-if="userObj"
          version="green"
          text-color-class="text-white text-sm"
          :disabled="userObj.money < pack.cost"
          :class="{
            'opacity-50': userObj.money < pack.cost,
          }"
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
import type { iPack } from "@f1pick6/shared/types";
import { loadFallbackPackImage } from "~/utils/loadDefaultImage";
import PackInfoModal from "./modals/PackInfoModal.vue";
import PackConfirmationModal from "./modals/PackConfirmationModal.vue";

const props = defineProps<{
  pack: iPack;
}>();

const userStore = useUserStore();
const overlay = useOverlay();

const modalPackInfo = overlay.create(PackInfoModal);
const modalPackPurchaseConfirmation = overlay.create(PackConfirmationModal);

const { userObj } = storeToRefs(userStore);
const isLoading = ref(false);

const openPackInfoModal = () => {
  modalPackInfo.open({
    pack: props.pack,
  });
};

const handleBuyPack = async () => {
  isLoading.value = true;

  await giveUserPack(props.pack);

  modalPackPurchaseConfirmation.open({
    pack: props.pack,
  });

  isLoading.value = false;
};
</script>

<style scoped></style>
