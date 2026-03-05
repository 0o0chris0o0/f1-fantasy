<template>
  <div class="text-center">
    <div class="relative inline-block mb-2">
      <ClientOnly>
        <img 
          :src="`/img/pack-${pack.packId}.png`"
          @error="loadFallbackPackImage($event)"
        >
      </ClientOnly>
      <div class="absolute -bottom-2 -right-2 w-16 h-16 bg-black border border-gray-800 rounded-full grid place-content-center">
        <p class="font-f1 rotate-6">x{{ pack.quantity }}</p>
      </div>
    </div>
    <div class="text-center">
      <div class="font-f1 font-semibold text-xl mb-3">
        <p>{{ pack.packName }}</p>
      </div>
      <NuxtLink :to="`/open-pack?packId=${pack.packId}`">
        <Button
          v-if="userObj"
          version="green"
        >
          Open
        </Button>
      </NuxtLink>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { iPackInUser } from '@f1pick6/shared/types';
import { loadFallbackPackImage } from "~/utils/loadDefaultImage";

const props = defineProps<{
  pack: iPackInUser;
}>();
const userStore = useUserStore();

const { userObj } = storeToRefs(userStore);
</script>

<style scoped>
</style>