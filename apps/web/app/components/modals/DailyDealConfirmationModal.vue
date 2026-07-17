<template>
  <UModal
    :ui="{
      overlay: 'bg-gray-900/75',
    }"
  >
    <template #content>
      <div v-if="deal" class="p-6 bg-surface-container-highest">
        <div class="mx-auto mb-6 w-52">
          <UserCard
            :card="deal.cardData"
            :rarity="deal.rarity"
            :quantity="
              userStore.getXCardFromUserObj(deal.cardData.cardId, deal.rarity)
                ?.quantity
            "
            :level="userStore.getCardLevelForUser(deal.cardData.cardId)"
            :inCollection="
              userStore.doesUserHaveCardInCollection(
                deal.cardData.cardId,
                deal.rarity,
              )
            "
            :isNew="
              !userStore.hasUserSeenCard(deal.cardData.cardId, deal.rarity)
            "
            class="w-full"
          />
        </div>

        <p class="mb-2 text-center text-xl text-gray-100">
          Buy {{ deal.cardData.cardName }}
          <span
            :class="[
              `text-${deal.rarity.toLowerCase()}`,
              'text-sm font-f1 font-bold',
            ]"
            >{{ deal.rarity }}</span
          >?
        </p>
        <p class="mb-6 text-center text-sm text-gray-300">
          This will cost {{ deal.price }} coins.
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
import type { iDailyDealCard } from "@f1pick6/shared";

const props = defineProps<{
  deal?: iDailyDealCard | null;
  confirm?: (deal: iDailyDealCard) => Promise<void> | void;
}>();

const emit = defineEmits<{ close: [] }>();

const userStore = useUserStore();
const isSubmitting = ref(false);

const confirmPurchase = async () => {
  if (!props.deal || !props.confirm || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    await props.confirm(props.deal);
    emit("close");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
