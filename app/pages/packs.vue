<template>
  <div v-if="userFromStore">
    <PageHeader class="mb-4"> Packs </PageHeader>

    <div v-if="userFromStore" class="grid grid-cols-2 gap-6">
      <div v-for="pack in userFromStore.packs" :key="pack.packId" class="">
        <div class="relative">
          <img
            alt="Pack"
            :src="`/img/pack-${pack.packId}.png`"
            class="" 
            @error="loadFallbackPackImage($event)"
          >
          <div class="absolute bottom-0 right-0 -rotate-6 bg-black rounded-full p-2 w-16 h-16 grid items-center justify-center">
            <p class="font-f1 font-semibold text-xl">x{{ pack.quantity }}</p>
          </div>
        </div>
      
        <div class="mt-2 px-2 py-1 text-center">
          <p class="font-f1 text-sm mb-2">{{ pack.packName }}</p>
          <Button version="green" classes="text-xs" text-color-class="text-white" @click="getCards(pack.packId)">
            Open Now
          </Button>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p class="text-center">Loading...</p>
  </div>
</template>

<script setup lang="ts">
import { writeBatch, doc, getDoc } from "firebase/firestore";

import openPack from "@/utils/openPack";
import { loadFallbackPackImage } from "~/utils/loadDefaultImage";

import { LootType, type TyreType , type iLoot, type iPack, type iPackInUser } from "~/types/pack";
import type { iCard, iCardInUsersCards, iCardWithIsNew } from "~/types/card";

const db = useFirestore();
const userStore = useUserStore();

definePageMeta({
  middleware: "auth",
});

const newCards = ref<iLoot[]>([]);

const { userFromStore } = storeToRefs(userStore);

const getCards = async (packType: string) => {
  if (userFromStore.value) {
    const cardsFromPack = await openPack(
      packType,
      userFromStore.value.packsSinceTier1,
      userFromStore.value.cardsObtained
    );

    const batch = writeBatch(db);

    const playerRef = doc(db, "players", userFromStore.value.userId);
    const playerData = userFromStore.value;

    const packsRef = doc(db, "packs", packType);
    const packsSnap = await getDoc(packsRef);
    const packMetaData = packsSnap.data() as iPack;

    // check if the pack contained a tier 1 card, then update the users modifier
    const doesPackIncludeTier1 = cardsFromPack.some(card => {
      const cardData = card.data as iCard;
      return cardData.currentTier === 1;
    });

    if (doesPackIncludeTier1) {
      batch.update(playerRef, { packsSinceTier1: 0 });
    } else if (packMetaData.increaseTier1Chance) {
      batch.update(playerRef, {
        packsSinceTier1: playerData.packsSinceTier1 + 1
      });
    }

    // reduce number of packs for user
    const packIndex = playerData.packs.findIndex(
      (userPack: iPackInUser) => userPack.packId === packType
    );

    // if this is the last pack of that type for the user
    if (playerData.packs[packIndex].quantity === 1) {
      playerData.packs.splice(packIndex, 1);
    } else {
      playerData.packs[packIndex].quantity -= 1;
    }

    batch.update(playerRef, {
      packs: playerData.packs,
    });

    // sort cards ready for pack open modal
    cardsFromPack
      .sort((a, b) => {
        if (a.type === LootType.CARD || b.type === LootType.CARD) {
          const aCard = a.data as iCard;
          const bCard = b.data as iCard;
          return aCard.currentPoints > bCard.currentPoints ? 1 : -1;
        } else {
          return 0;
        }
      })
      .sort((a, b) => {
        if (a.type === LootType.CARD || b.type === LootType.CARD) {
          const aCard = a.data as iCard;
          const bCard = b.data as iCard;
          return aCard.currentTier > bCard.currentTier ? 1 : -1;
        } else {
          return 0;
        }
      })
      .sort((a, b) => {
        if (a.type === LootType.CARD && b.type !== LootType.CARD) {
          return -1
        } else if ( a.type !== LootType.CARD && b.type === LootType.CARD) {
          return 1
        } else {
          return 0;
        }
      });

      newCards.value = cardsFromPack;

      // first check if the player already has any of the new cards
      // in which case we just bump the number of tyres
      newCards.value.forEach((card: iLoot) => {
        switch (card.type) {
          case LootType.TYRE: {
            const tyreType = card.data as TyreType;
            // handle type type
            playerData.tyres[tyreType] += 1;
            break;
          }
          case LootType.TOKEN: {
            // handle type token
            break;
          }
          default: {
            // handle type card
            const cardData = card.data as iCardWithIsNew;

            // check if the player already has the card
            const cardIndex = playerData.cards.findIndex(
              (tmpCard: iCardInUsersCards) => tmpCard.cardId === cardData.cardId
            );

            if (cardIndex !== -1) {
              playerData.cards[cardIndex].quantity += 1;
            } else {
              playerData.cards.push({
                cardId: cardData.cardId,
                quantity: 1,
                tyres: 0,
              });
            }
            break;
          }
        }
      });

      const newCardLoot = newCards.value.filter((card) => card.type === LootType.CARD);
      const newCardLootData = newCardLoot.map((card) => card.data as iCard);

      // get ID's of new cards to store in cardsObtained (used to determine if a card is new or not)
      const newCardIds = newCardLootData.map((card) => card.cardId);
      playerData.cardsObtained.push(...newCardIds);

      // add cards to user cards
      batch.update(playerRef, {
        tyres: playerData.tyres,
        cards: playerData.cards,
        cardsObtained: [...new Set(playerData.cardsObtained)],
      });

      await batch.commit();

      open();
    } else {
      console.log('there was an issue getting the cards')
    }
  }
</script>

<style lang="scss" scoped></style>
