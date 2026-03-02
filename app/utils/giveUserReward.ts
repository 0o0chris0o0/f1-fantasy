import { arrayUnion, collection, doc, getDoc, getDocs, increment, QueryDocumentSnapshot, updateDoc, writeBatch } from "firebase/firestore";
import type { iPack } from "@/types/pack";
import { RewardType, type iReward } from "~/types/reward";
import { CardType, iCardRarity, type iCardInUsersCards, type iConstructorCard, type iDriverCard } from "~/types/card";
import type { iUserCardHistory } from "~/types/user";
import type { iLoot } from "~/types/loot";

export async function giveUserReward(rewardObject: iReward) {
  const db = useFirestore();
  const userStore = useUserStore();

  const { userObj, userDocRef } = storeToRefs(userStore);

  const batch = writeBatch(db);

  if (!userDocRef.value) return;

  // this will be returned in the function so we can show 
  // the new cards in the modal
  let additionalRewardDetails: iLoot[] = [];

  switch (rewardObject.rewardType) {
    case RewardType.COINS:
      batch.update(
        userDocRef.value,
        {
          money: increment(rewardObject.key as number)
        }
      );
      break;
    case RewardType.CARDS:
      // TODO: based on the rarity from the key give the user a random driver and random constructor
      // get all cards
      const cardsRef = collection(db, "cards");
      const cardsSnapshot = await getDocs(cardsRef);

      const cardDocs = cardsSnapshot.docs.map(
        (cardDoc: QueryDocumentSnapshot) => cardDoc.data() as iDriverCard | iConstructorCard
      );

      const driverCards = cardDocs.filter(c => c.type === CardType.DRIVER);
      const constructorCards = cardDocs.filter(c => c.type === CardType.CONSTRUCTOR);

      const randomDriverCard = driverCards[Math.floor(Math.random() * driverCards.length)];
      const randomConstructorCard = constructorCards[Math.floor(Math.random() * constructorCards.length)];

      if (!userObj.value?.cards || !randomDriverCard || !randomConstructorCard) return;

      // create objects for adding the cards into the users DB object
      // for adding the cards history obj
      // and for the loot obj to show in the modal
      const cardsToAdd: iCardInUsersCards[] = [];
      const cardsHistory: Record<string, iUserCardHistory> = structuredClone(toRaw(userObj.value.cardsHistory));
      const lootCards: iLoot[] = [];

      [randomDriverCard, randomConstructorCard].forEach((c) => {
        // check if the new random card has been collected by the user
        const usersCollection = userObj.value?.collection;
        const usersCardFromCollection = usersCollection && usersCollection[`${c.cardId}_${rewardObject.key}`];

        // check if the user already has the new random DRIVER card
        let userCardHistory: iUserCardHistory | undefined = cardsHistory[`${c.cardId}_${rewardObject.key}`];

        if (!userCardHistory) {
          userCardHistory = {
            xp: 0,
            level: 1
          }
        }

        cardsHistory[`${c.cardId}_${rewardObject.key}`] = userCardHistory;

        const newCardData: iCardInUsersCards = {
          cardData: c,
          inCollection: !!usersCardFromCollection,
          collectedOn: usersCardFromCollection?.collectedOn ? usersCardFromCollection.collectedOn : null,
          level: userCardHistory.level,
          quantity: 1,
          rarity: rewardObject.key as iCardRarity,
          xp: userCardHistory.xp
        }

        cardsToAdd.push(newCardData)
        lootCards.push({
          loot: newCardData,
          isNew: !!!userObj.value?.cardsHistory[`${c.cardId}_${rewardObject.key}`]
        })
      })

      additionalRewardDetails = lootCards;

      // create users card obj, merging the new cards with the current ones
      const newCardsForUsers = mergeNewCardsWithCurrentUserCards(cardsToAdd, userObj.value.cards);

      // update the user object within the DB
      batch.update(userDocRef.value, {
        cards: toRaw(newCardsForUsers),
        cardsHistory
      })

      break;
    case RewardType.PACK:
      const packsRef = collection(db, 'packs');
      const packSnap = await getDoc(doc(packsRef, rewardObject.key as string))
      const packData = packSnap.data() as iPack;

      await giveUserPack(packData);
      break;
  }

  batch.update(userDocRef.value, {
    rewardLevel: increment(1)
  })

  await batch.commit();

  return additionalRewardDetails;
}