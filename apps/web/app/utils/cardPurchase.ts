import type { iCardInUsersCards, iCardRarity, iConstructorCard, iCurrentTeam, iDriverCard, iUserCardHistory } from "@f1pick6/shared";
import { updateDoc, increment, arrayUnion } from "firebase/firestore";

export async function cardPurchase(cardData: iDriverCard | iConstructorCard, rarity: iCardRarity, price: number) {
  const userStore = useUserStore();

  const { userObj, userDocRef } = storeToRefs(userStore);

  if (!userObj.value || !userDocRef.value) {
    return;
  }
  
  // clone users cards
  const userCards = userObj.value.cards.slice();

  const usersCollection = userObj.value.collection;
  const usersCardHistory = userObj.value.cardsHistory;
  const usersCurrentTeam = userObj.value.currentTeam;

  if (!userCards) {
    return;
  }

  const cardIndex = userCards.findIndex((oldCard) => oldCard.cardData.cardId === cardData.cardId && oldCard.rarity === rarity);

  if (userCards[cardIndex]) {
    userCards[cardIndex].quantity += 1;

    // check if the new card is also in the users current team, if it is then update the quantity there as well
    const isCardInTeam = userStore.isXCardInUsersCurrentTeam(cardData.cardId, rarity);

    if (isCardInTeam) {
      const teamKey = Object.keys(userObj.value.currentTeam).find((key) => {
        const card = usersCurrentTeam[key as keyof iCurrentTeam];
        return card?.cardData.cardId === cardData.cardId && card.rarity === rarity;
      }) as keyof iCurrentTeam;

      usersCurrentTeam[teamKey]!.quantity += 1;
    }

  } else {
    // get users card history
    let userCardHistory: iUserCardHistory | undefined = usersCardHistory[cardData.cardId];

    if (!userCardHistory) {
      userCardHistory = {
        xp: 0,
        level: 1
      }
    }

    const usersCardFromCollection = usersCollection[`${cardData.cardId}_${rarity}`];
    
    const newUserCard: iCardInUsersCards = {
      cardData,
      inCollection: !!usersCardFromCollection,
      collectedOn: usersCardFromCollection?.collectedOn ? usersCardFromCollection.collectedOn : null,
      quantity: 1,
      rarity,
      level: userCardHistory.level,
      xp: userCardHistory.xp,
    };
    userCards.push(newUserCard);
  }


  await updateDoc(userDocRef.value, {
    cards: userCards,
    currentTeam: usersCurrentTeam,
    dailyDealCardsPurchased: arrayUnion(cardData.cardId),
    seenCards: arrayUnion(`${cardData.cardId}_${rarity}`),
    money: increment(-price)
  })
}