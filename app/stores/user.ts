import { defineStore } from 'pinia';
import { doc, getDoc, onSnapshot, writeBatch } from "firebase/firestore";

import type { iFBUser, iUserFromStore } from '@/types/user';
import type { iCardInUsersCards } from '@/types/card';

export const useUserStore = defineStore('user', () => {
  const userFromStore = ref<iUserFromStore | null>(null);

  const user = useCurrentUser();
  const db = useFirestore();

  const getUserForStore = async () => {
    // Only fetch if data doesn't exist
    if (userFromStore.value) return userFromStore.value

    if (user.value) {
      const docRef = doc(db, 'players', user.value.uid);
      const userDoc = await getDoc(docRef);
      userFromStore.value = {
        userId: userDoc.id,
        ...userDoc.data() as iFBUser
      }
      return userFromStore.value  

    } else {
      console.log('NO USER!!')
      return {};
    }

    // onSnapshot(doc(db, "players", newUser.uid), (userDoc) => {
    //   console.log('setting userFromStore')
    //   userFromStore.value = {
    //     userId: userDoc.id,
    //     ...userDoc.data() as iFBUser
    //   }
    // })
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

  const shouldUserSeeEmergencyPacks = computed(() => {
    if (!userFromStore.value) {
      return false;
    }

    // if user is missing a type of card
    // const cardsStore = useCardsStore();
    // if (!cardsStore.userCarCards || cardsStore.userDriverCards || cardsStore.userTpCards) {
    //   return true;
    // }
  })

  const emergencyPacksAvailableToUser = computed(() => {
    const cardsStore = useCardsStore();
    const returnAry: any[] = [];

    if (!shouldUserSeeEmergencyPacks.value) {
      return [];
    }

    return returnAry;
  })


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

  return { userFromStore, getUserForStore, userPacksCount, setUserForStore, shouldUserSeeEmergencyPacks, emergencyPacksAvailableToUser };
})