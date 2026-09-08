import { updateDoc, Timestamp } from 'firebase/firestore';
import type {
  iCardInUsersCards,
  iCardRarity,
  iCurrentTeam,
} from '@f1pick6/shared';

export async function addCardToCollection(
  cardId: string,
  rarity: iCardRarity,
  totalCards: number
) {
  const userStore = useUserStore();

  const { userObj, userDocRef } = storeToRefs(userStore);

  if (!userDocRef.value) return;

  const usersCollection = userObj.value?.collection ?? {};
  const collectionKey = `${cardId}_${rarity}`;

  // the card is already in the collection, adding it again would
  // push the card count and the reward track out of sync
  if (usersCollection[collectionKey]) return;

  const userCards = userObj.value?.cards;
  const indexOfSelectedCard = userCards?.findIndex(
    (c) => c.cardData.cardId === cardId && c.rarity === rarity
  );

  if (!userCards || indexOfSelectedCard === undefined) {
    return;
  }

  if (
    userCards[indexOfSelectedCard] &&
    userCards[indexOfSelectedCard]?.quantity > 1
  ) {
    // reduce card quantity
    userCards[indexOfSelectedCard].quantity -= 1;
  } else {
    // remove card from the users card obj
    userCards?.splice(indexOfSelectedCard, 1);
  }

  // update the users current team quantities
  const usersCurrentTeam: iCurrentTeam | undefined = userObj.value?.currentTeam;
  if (usersCurrentTeam) {
    const cardInUsersCurrentTeam = (
      Object.entries(usersCurrentTeam) as [
        keyof iCurrentTeam,
        iCardInUsersCards,
      ][]
    ).find(
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

  // the collection is the source of truth for the card count, so the count,
  // the completion and the reward track can't drift apart
  const newCardCount = Object.keys(usersCollection).length + 1;
  const calcedCompletion = Math.round((newCardCount / totalCards) * 100);

  const {
    progress: progressInRewardTrack,
    level: rewardLevel,
    completedLevel,
  } = calcProgressForRewardTrack(
    totalCards,
    newCardCount,
    rewardTrackLevelCount
  );

  // update the user doc
  await updateDoc(userDocRef.value, {
    cards: userCards,
    currentTeam: usersCurrentTeam,
    cardsInCollection: newCardCount,
    collectionCompletion: calcedCompletion,
    progressInRewardTrack,
    rewardLevel,
    [`collection.${collectionKey}`]: {
      cardId,
      collectedOn: Timestamp.now(),
    },
  });

  return { completedLevel };
}
