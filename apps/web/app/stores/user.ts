import { defineStore } from 'pinia';
import { doc, DocumentReference, getDoc } from "firebase/firestore";

import type { iCardInUsersCards, iCardRarity, iFBUser } from '@f1pick6/shared';

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

  const doesUserHaveCard = (cardId: string, cardRarity: iCardRarity) => {
    return !!userObj.value?.cards.find((c) => c.cardData.cardId === cardId && c.rarity === cardRarity);
  }

  const doesUserHaveCardInCollection = (cardId: string, cardRarity: iCardRarity) => {
    return !!userObj.value?.collection[`${cardId}_${cardRarity}`];
  }

  const getXCardFromUserObj = (cardId: string, rarity: iCardRarity) => {
    return userObj.value?.cards.find((c) => c.cardData.cardId === cardId && c.rarity === rarity);
  }

  const isXCardInUsersCurrentTeam = (cardId: string, rarity: iCardRarity): boolean => {
    if (userObj.value?.currentTeam) {
      return Object.values(userObj.value?.currentTeam).some((card: iCardInUsersCards) => card && card.cardData.cardId === cardId && card.rarity === rarity)
    } else {
      return false;
    }
  }

  const idsOfCardsInCurrentTeam = (): string[] => {
    if (!userObj.value?.currentTeam) {
      return [];
    }
    return Object.values(userObj.value?.currentTeam).map((card: iCardInUsersCards)  => card.cardData.cardId);
  }

  const hasUserPurchasedXCard = (cardId: string): boolean => {
    if (!userObj.value?.dailyDealCardsPurchased) {
      return false;
    }
    // we don't need to worry about rarity here as each card will only appear once in the daily deals
    return userObj.value.dailyDealCardsPurchased.includes(cardId);  
  }

  return { userObj, userDocRef, userPacksCount, getUserData, doesUserHaveCard, doesUserHaveCardInCollection, getXCardFromUserObj, idsOfCardsInCurrentTeam, isXCardInUsersCurrentTeam, hasUserPurchasedXCard };
})