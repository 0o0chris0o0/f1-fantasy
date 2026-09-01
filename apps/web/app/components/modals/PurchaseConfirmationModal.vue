<template>
  <UModal :close="false" :dismissible="false">
    <template #body>
      <div class="text-center">
        <p class="mb-2 font-f1 text-xl text-gray-100">Purchase complete</p>
        <div class="w-56 mx-auto my-4">
          <template v-if="cardData && cardRarity">
            <UserCard :card="cardData" :rarity="cardRarity" />
          </template>
          <template v-else-if="type === 'pack'">
            <img
              :src="`/img/${itemData.packId}-pack.png`"
              class="max-w-44 mx-auto"
              @error="loadFallbackPackImage($event)"
            />
          </template>
        </div>
        <Button size="sm" version="normal" @click="emit('close')">
          Claim
        </Button>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type {
  iDriverCard,
  iConstructorCard,
  iPack,
  iCardRarity,
} from "@f1pick6/shared";

type PurchaseConfirmationProps =
  | {
      itemData: iDriverCard | iConstructorCard;
      itemRarity?: iCardRarity;
      type: "card";
    }
  | {
      itemData: iPack;
      type: "pack";
    };

const props = defineProps<PurchaseConfirmationProps>();

const cardData = computed(() =>
  props.type === "card" ? props.itemData : null,
);
const cardRarity = computed(() =>
  props.type === "card" ? props.itemRarity : null,
);

const emit = defineEmits<{ close: [] }>();
</script>
