import { defineStore } from 'pinia';
import { doc, DocumentReference, getDoc } from "firebase/firestore";

import type { iFBUser } from '@/types/user';
import type { iCardRarity } from '~/types/card';

export const useUserStore = defineStore('user', () => {
  const user = useCurrentUser();
  const db = useFirestore();

  const userDocRef = computed(() => {
    if (user.value) {
      return doc(db, 'players', user.value.uid);
    }
    return null;
  });

  const userObj = useDocument(() =>
    user.value ? doc(db, 'players', user.value.uid) as DocumentReference<iFBUser> : null
  );

  async function getUserData() {
    if (userDocRef.value) {
      const docSnap = await getDoc(userDocRef.value);
      return docSnap;
    }
  }

  const userPacksCount = computed(() => {
    const userPacks = userObj.value?.packs;
    if (!userPacks) {
      return 0;
    }
    let packCount = 0;
    Object.keys(userPacks)?.forEach((pack) => packCount += userPacks[pack]? userPacks[pack].quantity : 0)
    return packCount;
  })

  const shouldUserSeeEmergencyPacks = computed(() => {
    if (!userObj.value) {
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


  const doesUserHaveCard = (cardId: string, cardRarity: iCardRarity) => {
    return !!userObj.value?.cards.find((c) => c.cardData.cardId === cardId && c.rarity === cardRarity);
  }

  const doesUserHaveCardInCollection = (cardId: string, cardRarity: iCardRarity) => {
    return !!userObj.value?.collection[`${cardId}_${cardRarity}`];
  }

  return { userObj, userDocRef, userPacksCount, shouldUserSeeEmergencyPacks, emergencyPacksAvailableToUser, getUserData, doesUserHaveCard, doesUserHaveCardInCollection };
})