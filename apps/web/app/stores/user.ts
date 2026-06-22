import { defineStore } from 'pinia';
import { doc } from "firebase/firestore";

import type { iCardInUsersCards, iCardRarity, iFBUser } from '@f1pick6/shared';

export const useUserStore = defineStore('user', () => {
  const user = useCurrentUser();
  const db = useFirestore();

  const userDocRef = computed(() => (user.value ? doc(db, 'players', user.value.uid) : null));

  const {
    data: userObj,
    pending: userDataPending,
  } = useDocument<iFBUser>(userDocRef);

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

  const hasUserSeenCard = (cardId: string, cardRarity: iCardRarity): boolean => {
    if (!userObj.value?.seenCards) {
      return false;
    }
    return userObj.value.seenCards.includes(`${cardId}_${cardRarity}`);
  };

  const getCardLevelForUser = (cardId: string): number => {
    return userObj.value?.cardsHistory?.[cardId]?.level || 1;
  }

  return { userObj, userDocRef, userDataPending, userPacksCount, doesUserHaveCard, doesUserHaveCardInCollection, getXCardFromUserObj, idsOfCardsInCurrentTeam, isXCardInUsersCurrentTeam, hasUserPurchasedXCard, hasUserSeenCard, getCardLevelForUser };
})