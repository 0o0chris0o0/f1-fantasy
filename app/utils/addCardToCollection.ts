import { updateDoc, increment, Timestamp } from "firebase/firestore";
import type { iCardRarity } from "~/types/card";

export async function addCardToCollection(cardId: string, rarity: iCardRarity, totalCards: number) {
  const userStore = useUserStore();

  const { userObj, userDocRef } = storeToRefs(userStore);

  if (!userDocRef.value) return;

  const userCards = userObj.value?.cards;
  const indexOfSelectedCard = userCards?.findIndex((c) => c.cardData.cardId === cardId && c.rarity === rarity);

  if (indexOfSelectedCard === undefined) {
    return;
  }

  userCards?.splice(indexOfSelectedCard, 1);

  const newCardCount = (userObj.value?.cardsInCollection ?? 0) + 1;
  const calcedCompletion = Math.round(newCardCount / totalCards * 100);

  const { progress: progressInRewardTrack, level: rewardLevel } = calcProgressForRewardTrack(totalCards, newCardCount)

  // update the user doc
  await updateDoc(userDocRef.value, {
    cards: userCards,
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