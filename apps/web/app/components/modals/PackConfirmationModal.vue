<template>
  <UModal
    :ui="{
      overlay: 'bg-gray-900/75',
    }"
  >
    <template #content>
      <div v-if="pack" class="p-6 bg-surface-container-highest">
        <div class="mb-6">
          <img
            :src="`/img/${pack.packId}-pack.png`"
            class="max-w-44 mx-auto"
            @error="loadFallbackPackImage($event)"
          />
        </div>

        <p class="mb-2 text-center text-xl text-gray-100">
          Buy {{ pack.packName }} pack?
        </p>
        <p class="mb-6 text-center text-sm text-gray-300">
          This will cost {{ pack.cost }} coins.
        </p>

        <div class="flex items-center justify-center gap-4">
          <Button
            size="sm"
            version="neutral"
            :disabled="isSubmitting"
            @click="emit('close')"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            version="secondary"
            :disabled="isSubmitting"
            @click="confirmPurchase"
          >
            {{ isSubmitting ? "Buying..." : "Confirm" }}
          </Button>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { iPack } from "@f1pick6/shared";

const props = defineProps<{
  pack?: iPack | null;
  confirm?: (pack: iPack) => Promise<void> | void;
}>();

const emit = defineEmits<{ close: [] }>();

const isSubmitting = ref(false);

const confirmPurchase = async () => {
  if (!props.pack || !props.confirm || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    await props.confirm(props.pack);
    emit("close");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
