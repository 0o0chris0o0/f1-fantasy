import { collection, doc, getDoc, where, query, getDocs, updateDoc, writeBatch } from "firebase/firestore";
import type { iCardInUsersCards, iCardRarity, iConstructorCard, iDriverCard } from "~/types/card";
import type { iPack, iPackInUser, iSlot } from "~/types/pack";
import type { iUserCardHistory } from "~/types/user";

export async function openPack(packId: string) {
  const db = useFirestore();
  const userStore = useUserStore();
  const batch = writeBatch(db);

  const { userObj, userDocRef } = storeToRefs(userStore);

  if (!userObj.value) {
    throw new Error('Missing user');
  }

  // get the pack obj from the DB
  const packDocRef = doc(db, 'packs', packId);
  const packDocSnap = await getDoc(packDocRef);
  if (!packDocSnap.exists()) {
    throw new Error('Pack does not exist');
  }
  const packData = packDocSnap.data() as iPack;

  // check the user has atleast 1 of the requested pack
  if (userObj.value.packs[packData.packId]?.quantity! < 1) {
    throw new Error('User doesnt have the required number of packs');
  }

  // get all enabled cards
  const cardsCollectionRef = collection(db, 'cards');
  const cardsQuery = query(cardsCollectionRef, where('enabled', '==', true));
  const cardsSnap = await getDocs(cardsQuery);
  let allCards: (iDriverCard | iConstructorCard)[] = [];
  cardsSnap.forEach((doc) => {
    allCards.push(doc.data() as iDriverCard | iConstructorCard);
  });

  // pick random cards based on pack data
  const pickedCards = pickCardsForUser(allCards, packData.cardsIncluded);

  // create users card obj, includes adding rarity, level & xp
  const newCardsForUsers = createCardsForUser(pickedCards, packData, userObj.value.cards, userObj.value.cardsHistory)
 
  if (!userDocRef.value) {
    throw new Error('User not logged in');
  }

  // Add the cards to the user object 
  batch.update(userDocRef.value, {
    cards: newCardsForUsers
  });

  // Remove the pack from the user object
  const userPacks: Record<string, iPackInUser> = userObj.value!.packs || {};
  const userPackData = userPacks[packData.packId];

  if (!userPackData) {
    throw new Error('User does not have this pack');
  }

  userPackData.quantity -= 1;
  batch.update(userDocRef.value, {
    packs: userPacks
  });

  await batch.commit();

  return newCardsForUsers;
}

export function pickCardsForUser(allCards: (iDriverCard | iConstructorCard)[], cardsToPick: number) {
  // Separate cards by type
  const driverCards = allCards.filter(card => card.type === 'driver');
  const constructorCards = allCards.filter(card => card.type === 'constructor');
  let hasDriver = false;
  let hasConstructor = false;
  const selectedIds = new Set<string>();

  const pickedCards: (iDriverCard | iConstructorCard)[] = [];

   // using pack loot chances select the correct number of random cards
   for (let i = 0; i < cardsToPick; i++) {
    let cardPool: (iDriverCard | iConstructorCard)[] = allCards;

    // If we haven't selected a driver yet and this is the last slot, force a driver
    if (!hasDriver && i === cardsToPick - 1) {
      cardPool = driverCards;
    }
    // If we haven't selected a constructor yet and this is the last slot, force a constructor
    else if (!hasConstructor && i === cardsToPick - 1) {
      cardPool = constructorCards;
    }

    // Filter pool to ensure the card hasn't been picked yet
    cardPool = cardPool.filter(card => 
      !selectedIds.has(card.cardId)
    );

    if (cardPool.length === 0) continue;

    // select a random card
    const pickedCard = cardPool[Math.floor(Math.random() * cardPool.length)];
    if (!pickedCard) continue;

    // Track card types
    if (pickedCard.type === 'driver') hasDriver = true;
    if (pickedCard.type === 'constructor') hasConstructor = true;

    pickedCards.push(pickedCard);
    selectedIds.add(pickedCard.cardId);
  }

  return pickedCards;
}

export function createCardsForUser(
  newCards: (iDriverCard | iConstructorCard)[],
  packData: iPack,
  usersCurrentCards: iCardInUsersCards[],
  usersCardHistory: Record<string, iUserCardHistory>
){
  const cardsInUsersCards: iCardInUsersCards[] = usersCurrentCards.slice();

  for (const [key, slotData] of Object.entries(packData.slots)) {
    const i = Number(key);
    const cardInSlot = newCards[i - 1];

    if (!slotData || !cardInSlot) continue;

    // select the rarity based on forced rarity or weighted chances
    const selectedRarity = slotData.forcedRarity ?? getWeightedRarity(slotData.rarityChances);

    if (!selectedRarity) continue;

    // check if user already has this card in their collection
    const selectedCardIndex = cardsInUsersCards.findIndex((userCard: iCardInUsersCards) => userCard.cardData.cardId === cardInSlot.cardId && userCard.rarity === selectedRarity);

    if (cardsInUsersCards[selectedCardIndex]) {
      // user already has this card, increase quantity
      cardsInUsersCards[selectedCardIndex].quantity += 1;
    } else {
      let userCardHistory: iUserCardHistory | undefined = usersCardHistory[cardInSlot.cardId];

      if (!userCardHistory) {
        userCardHistory = {
          xp: 0,
          level: 1
        }
      }

      // user does not have this card, add to collection
      const newUserCard: iCardInUsersCards = {
        cardData: cardInSlot,
        quantity: 1,
        rarity: selectedRarity,
        level: userCardHistory.level,
        xp: userCardHistory.xp,
      };
      cardsInUsersCards.push(newUserCard);
    }
  }

  // return new user card object including new cards
  return cardsInUsersCards;
}

/**
 * Picks a rarity based on weighted chances
 */
function getWeightedRarity(chances: Record<iCardRarity, number>): iCardRarity | null {
  const entries = Object.entries(chances) as [iCardRarity, number][];
  const activeEntries = entries.filter(([_, weight]) => weight > 0);
  
  const totalWeight = activeEntries.reduce((sum, [_, weight]) => sum + weight, 0);
  if (totalWeight === 0) return null;

  let random = Math.random() * totalWeight;

  for (const [rarity, weight] of activeEntries) {
      if (random < weight) return rarity;
      random -= weight;
  }
  return null;
}