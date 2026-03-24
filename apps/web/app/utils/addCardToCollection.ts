import { updateDoc, increment, Timestamp } from "firebase/firestore";
import type { iCardInUsersCards, iCardRarity, iCurrentTeam } from "@f1pick6/shared";

export async function addCardToCollection(cardId: string, rarity: iCardRarity, totalCards: number) {
  const userStore = useUserStore();

  const { userObj, userDocRef } = storeToRefs(userStore);

  if (!userDocRef.value) return;

  const userCards = userObj.value?.cards;
  const indexOfSelectedCard = userCards?.findIndex((c) => c.cardData.cardId === cardId && c.rarity === rarity);

  if (!userCards || indexOfSelectedCard === undefined) {
    return;
  }

  if (userCards[indexOfSelectedCard] && userCards[indexOfSelectedCard]?.quantity > 1) {
    // reduce card quantity
    userCards[indexOfSelectedCard].quantity -= 1;
  } else {
    // remove card from the users card obj
    userCards?.splice(indexOfSelectedCard, 1);
  }

  // update the users current team quantities
  const usersCurrentTeam: iCurrentTeam | undefined = userObj.value?.currentTeam;
  if (usersCurrentTeam) {
    const cardInUsersCurrentTeam = (Object.entries(usersCurrentTeam) as [keyof iCurrentTeam, iCardInUsersCards][]).find(
    ([_, card]) => card?.cardData.cardId === cardId && card.rarity === rarity
    );
    
    if (cardInUsersCurrentTeam) {
      const [keyToUpdate, cardData] = cardInUsersCurrentTeam;
      if (cardData.quantity > 1) {
        usersCurrentTeam[keyToUpdate]!.quantity -= 1;
      } else {
        usersCurrentTeam[keyToUpdate] = null;
      }
    }
  }

  const newCardCount = (userObj.value?.cardsInCollection ?? 0) + 1;
  const calcedCompletion = Math.round(newCardCount / totalCards * 100);

  const { progress: progressInRewardTrack, level: rewardLevel } = calcProgressForRewardTrack(totalCards, newCardCount)

  // update the user doc
  await updateDoc(userDocRef.value, {
    cards: userCards,
    currentTeam: usersCurrentTeam,
    cardsInCollection: increment(1),
    collectionCompletion: calcedCompletion,
    progressInRewardTrack,
    rewardLevel,
    [`collection.${cardId}_${rarity}`]: {
      cardId,
      collectedOn: Timestamp.now()
    }
  });
}