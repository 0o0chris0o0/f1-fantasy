import { arrayUnion, collection, doc, getDoc, getDocs, increment, QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import type { iPack } from "@/types/pack";
import { RewardType, type iReward } from "~/types/reward";
import { CardType, iCardRarity, type iCardInUsersCards, type iConstructorCard, type iDriverCard } from "~/types/card";
import type { iUserCardHistory } from "~/types/user";

export async function giveUserReward(rewardObject: iReward) {
  const db = useFirestore();
  const userStore = useUserStore();

  const { userObj, userDocRef } = storeToRefs(userStore);

  if (!userDocRef.value) return;

  switch (rewardObject.rewardType) {
    case RewardType.COINS:
      await updateDoc(
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

      const cardsToAdd = [randomDriverCard, randomConstructorCard].map((c) => {
        // check if the new random card has been collected by the user
        const usersCollection = userObj.value?.collection;
        const usersCardFromCollection = usersCollection && usersCollection[`${c.cardId}_${rewardObject.key}`];

        // check if the user already has the new random DRIVER card
        let userCardHistory: iUserCardHistory | undefined = userObj.value?.cardsHistory[c.cardId];

        if (!userCardHistory) {
          userCardHistory = {
            xp: 0,
            level: 1
          }
        }

        return {
          cardData: c,
          inCollection: !!usersCardFromCollection,
          collectedOn: usersCardFromCollection?.collectedOn ? usersCardFromCollection.collectedOn : null,
          level: userCardHistory.level,
          quantity: 1,
          rarity: rewardObject.key as iCardRarity,
          xp: userCardHistory.xp
        }
      })

      // create users card obj, merging the new cards with the current ones
      const newCardsForUsers = mergeNewCardsWithCurrentUserCards(cardsToAdd, userObj.value.cards);
      
      // update the user object within the DB
      await updateDoc(userDocRef.value, {
        cards: toRaw(newCardsForUsers)
      })

      break;
    case RewardType.PACK:
      const packsRef = collection(db, 'packs');
      const packSnap = await getDoc(doc(packsRef, rewardObject.key as string))
      const packData = packSnap.data() as iPack;

      await giveUserPack(packData);
      break;
  }
}