<template>
  <UModal
    :close="{
      color: 'primary',
      size: 'xl',
      class: 'p-0',
    }"
    close-icon="material-symbols:close"
  >
    <template #body>
      <div v-if="card && rarity" class="max-w-md rounded-lg">
        <div class="mb-4 w-52 mx-auto text-white">
          <UserCard
            :card="card.cardData"
            :rarity="rarity"
            :level="card.level"
            :quantity="card.quantity"
          />
        </div>
        <div class="w-full bg-surface-container-highest p-4 rounded-lg">
          <p class="font-f1 text-xl text-center text-gray-100 mb-4">
            Add
            <span :class="['font-bold', `text-${card.rarity.toLowerCase()}`]"
              >{{ card.cardData.cardName }} ({{ card.rarity }})</span
            >
            to your collection?
          </p>
          <div
            v-if="
              userStore.isXCardInUsersCurrentTeam(
                card.cardData.cardId,
                card.rarity,
              ) && card.quantity === 1
            "
            class="mb-4"
          >
            <p class="italic text-xs text-warning text-center">
              This card is currently in your team. Adding it to your collection
              will remove it from your team.
            </p>
          </div>
          <div class="flex justify-center items-center gap-4">
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
              @click="handleConfirm"
            >
              {{ isSubmitting ? "Adding..." : "Confirm" }}
            </Button>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { iCardRarity, type iCardInUsersCards } from "@f1pick6/shared/types";

const props = defineProps<{
  card?: iCardInUsersCards | null;
  rarity?: iCardRarity;
  confirm?: (cardId: string, rarity: iCardRarity) => Promise<void> | void;
}>();

const emit = defineEmits<{ close: [] }>();

const userStore = useUserStore();
const isSubmitting = ref(false);

const handleConfirm = async () => {
  if (!props.card || !props.rarity || !props.confirm || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;
  try {
    await props.confirm(props.card.cardData.cardId, props.rarity);
    emit("close");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
