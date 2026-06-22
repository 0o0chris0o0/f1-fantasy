<template>
  <UModal
    :ui="{
      overlay: 'bg-gray-900/75',
    }"
  >
    <template #content>
      <div v-if="pack" class="p-6 bg-gray-800 text-white">
        <div class="mb-6">
          <img
            :src="`/img/${pack.packId}-pack.png`"
            class="max-w-44 mx-auto"
            @error="loadFallbackPackImage($event)"
          />
        </div>
        <p class="font-f1 text-2xl font-bold text-center text-gray-200 mb-4">
          {{ pack.packName }}
        </p>
        <div class="grid grid-cols-1 text-center gap-4">
          <div>
            <NuxtLink :to="`/open-pack?packId=${pack.packId}`">
              <Button @click="emit('close')" version="green">Open Now</Button>
            </NuxtLink>
          </div>
          <div>
            <Button @click="emit('close')" size="small">Close</Button>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { iPack } from "@f1pick6/shared";

const props = defineProps<{
  pack?: iPack | null;
}>();

const emit = defineEmits<{ close: [] }>();
</script>
