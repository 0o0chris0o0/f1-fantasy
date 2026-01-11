import { defineStore } from 'pinia';
import { doc, onSnapshot, writeBatch } from "firebase/firestore";

import type { iFBUser, iUserFromStore } from '@/types/user';
import type { iCardInUsersCards } from '@/types/card';

export const useUserStore = defineStore('user', () => {
  const userFromStore = ref<iUserFromStore | null>(null);

  const user = useCurrentUser();
  const db = useFirestore();

  const getUserForStore = () => {
    if (user.value) {
      onSnapshot(doc(db, "players", user.value.uid), (userDoc) => {
        userFromStore.value = {
          userId: userDoc.id,
          ...userDoc.data() as iFBUser
        }
      })
    } else {
      console.log('no user!')
    }
  }

  const setUserForStore = (userData: iUserFromStore) => {
    userFromStore.value = userData
  }

  const userPacksCount = computed(() => {
    const userPacks = userFromStore.value?.packs;
    let packCount = 0;
    userPacks?.forEach((pack) => packCount += pack.quantity)
    return packCount;
  })

  // const userPacksIds = computed((): string[] => {
  //   if (!userFromStore.value) {
  //     return [];
  //   }
  //   return userFromStore.value.packs.map((pack) => pack.packId);
  // })

  // const shouldUserSeeEmergencyPacks = computed(() => {
  //   if (!userFromStore.value) {
  //     return false;
  //   }

  //   if (['normal', 'starterCarPack', 'starterDriverPack', 'starterTpPack'].some(pack => userPacksIds.value.includes(pack))) {
  //     return false;
  //   }

  //   // if user is missing a type of card
  //   const cardsStore = useCardsStore();
  //   if (!cardsStore.userCarCards || cardsStore.userDriverCards || cardsStore.userTpCards) {
  //     return true;
  //   }
  // })

  // const emergencyPacksAvailableToUser = computed(() => {
  //   const cardsStore = useCardsStore();
  //   const returnAry = [];

  //   if (!shouldUserSeeEmergencyPacks.value) {
  //     return [];
  //   }

  //   if (!cardsStore.userCarCards?.length && !userPacksIds.value.includes('emergencyCarPack')) {
  //     returnAry.push('emergencyCarPack')
  //   }

  //   if ((!cardsStore.userDriverCards?.length || cardsStore.userDriverCards?.length < 2) && !userPacksIds.value.includes('emergencyDriverPack')) {
  //     returnAry.push('emergencyDriverPack')
  //   }

  //   if (!cardsStore.userTpCards?.length && !userPacksIds.value.includes('emergencyTpPack')) {
  //     returnAry.push('emergencyTpPack')
  //   }

  //   return returnAry;
  // })

  // const userTyres = computed(() => {
  //   return userFromStore.value?.tyres
  // })

  // const userCurrentTeamIds = computed(() => {
  //   const carId = userFromStore.value?.currentTeam.car?.cardId;
  //   const driverIds = [
  //     userFromStore.value?.currentTeam.driver['1']?.cardId,
  //     userFromStore.value?.currentTeam.driver['2']?.cardId
  //   ]
  //   const tpId = userFromStore.value?.currentTeam.teamPrinciple?.cardId

  //   return [carId, ...driverIds, tpId];
  // })

  // const doesUserHaveXCard = (cardId: string) => {
  //   if (userFromStore.value) {
  //     const carCardId = userFromStore.value.currentTeam.car?.cardId
  //     const tpCardId = userFromStore.value.currentTeam.teamPrinciple?.cardId;
  //     const driver1CardId = userFromStore.value.currentTeam.driver['1']?.cardId;
  //     const driver2CardId = userFromStore.value.currentTeam.driver['2']?.cardId;

  //     return [carCardId, tpCardId, driver1CardId, driver2CardId].includes(cardId);
  //   }
  // }

  // const howManyOfXCardDoesUserHave = (cardId: string) => {
  //   if (userFromStore.value) {
  //     const cardDetails = userFromStore.value.cards.find(userCard => userCard.cardId === cardId)
  //     return cardDetails?.quantity
  //   }
  // }

  // const tradeCard = async (cardId: string, cardTier: number, isEnabled?: boolean) => {
  //   if (userFromStore.value?.userId) {
  //     const batch = writeBatch(db);
  //     const playerRef = doc(db, "players", userFromStore.value.userId);
  //     const playerCards = userFromStore.value.cards;

  //     // Remove cards from player
  //     const cardsToRemove = cardsRequiredForTrade(cardTier, isEnabled);
  //     const cardIndex = playerCards.findIndex((card: iCardInUsersCards) => card.cardId === cardId);
  //     // if the player has more than the required amount just reduce the quantity
  //     if (playerCards[cardIndex].quantity > cardsToRemove) {
  //       playerCards[cardIndex].quantity -= cardsToRemove;
  //     } else {
  //       // else remove the whole card obj
  //       playerCards.splice(cardIndex, 1);
  //     }

  //     // give player the relevant quality upgrade pack
  //     const targetTier = `tier${cardTier}upgrade`;
  //     const playerPacks = userFromStore.value.packs;
  //     const packIndex = playerPacks.findIndex(pack => pack.packId === targetTier)

  //     // if the player already has the pack obj (because they already have one)
  //     // increase the quantity
  //     if (packIndex !== -1) {
  //       playerPacks[packIndex].quantity += 1;
  //     } else {
  //       // add a new pack obj
  //       playerPacks.push({
  //         packId: targetTier,
  //         packName: `Tier ${cardTier} Upgrade`,
  //         quantity: 1
  //       })
  //     }

  //     batch.update(playerRef, {
  //       cards: playerCards,
  //       packs: playerPacks
  //     })

  //     await batch.commit();
  //   }
  // }

  // const hasUserCollectedXCard = (cardId: string) => {
  //   if (userFromStore.value) {
  //     return userFromStore.value.collection.some((card) => card.cardId === cardId)
  //   }
  // }

  // const isXCardInUserTeam = (cardId: string) => {
  //   if (userFromStore.value) {
  //     return userCurrentTeamIds.value.includes(cardId);
  //   }
  // }

  return { userFromStore, getUserForStore, userPacksCount, setUserForStore };
})