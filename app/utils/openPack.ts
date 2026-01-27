import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

import { selectLootType, selectTyre, selectIsVariant, selectIsNew, selectCardTier } from './packFuncs';

import { type iDriverCard } from "~/types/card";
import { LootType, PackType, type iLoot, type iPack, type iSlot } from "~/types/pack";

export default async function openPack(
  packType: string, 
  packsSinceTier1: number, 
  userCardsIds: string[]
): Promise<iLoot[]> {
  const db = useFirestore();

  const packsRef = doc(db, "packs", packType);
  const packsSnap = await getDoc(packsRef);

  if (packsSnap.exists()) {
    const packMetaData = packsSnap.data() as iPack;
    
    const returnLoot: iLoot[] = [];

    // get all enabled cards
    const cardsRef = collection(db, 'cards')
    const cardsQuery = query(cardsRef, where('enabled', '==', true))
    const cardsSnap = await getDocs(cardsQuery);

    const cardsData = cardsSnap.docs.map((doc) => doc.data() as iCard);
    const newCardsForUser = cardsData.filter((card) => !userCardsIds.includes(card.cardId))

    // for each slot
    for (let i = 1; i <= packMetaData.cardsIncluded; i++) {
      const slotMetaData: iSlot = packMetaData.slots[i];

      if (packMetaData.type === PackType.TYRES) {
        returnLoot.push({
          type: LootType.TYRE,
          data: selectTyre(slotMetaData),
          isNew: false
        })
      } else if (packMetaData.type === PackType.TOKENS) {
        // TODO: handle token loot
      } else {
        // assume loot type card
        let lootType = LootType.CARD;
        
        if (packMetaData.type === PackType.MULTI) {
          // determine what kind of loot this slot should be
          lootType = selectLootType(slotMetaData);
        }

        if (lootType === LootType.TOKEN) {
          // TODO: handle token type
        } else if (lootType === LootType.TYRE) {
          returnLoot.push({
            type: LootType.TYRE,
            data: selectTyre(slotMetaData),
            isNew: false
          })
        } else {
          //  Handle card type

          // Check if card should be a variant
          const isVariant = selectIsVariant(slotMetaData);

          // Check if card should be a guarenteed new card for the player
          let isNewCard = false;
          if (newCardsForUser.length) {
            isNewCard = selectIsNew(slotMetaData);
          }

          // get the card tier
          let modifiedTier1Value = slotMetaData.tier1Chance;

          // first check there is atleast a 1% chance of a tier 1 card and 
          // the user hasn't just recieved a tier 1 card
          if (modifiedTier1Value > 0 && packsSinceTier1) {
            // modifies the chance of tier 1 everytime the user opens a pack without a tier 1 card
            if (packsSinceTier1 >= 10) {
              modifiedTier1Value = slotMetaData.tier1Chance + (packsSinceTier1 * 5);
            } else if (packsSinceTier1 >= 5){
              modifiedTier1Value = slotMetaData.tier1Chance + (packsSinceTier1 * 4);
            } else {
              modifiedTier1Value = slotMetaData.tier1Chance + (packsSinceTier1 * 3);
            }
            
            console.log(`modified to ${modifiedTier1Value}% chance`)
          }

          // select a card tier based on weights
          const cardTier = selectCardTier(slotMetaData, modifiedTier1Value);

          // generate the card pool
          const cardPool = await generateCardPool({
            allCards: cardsData,
            cardsInPack: packMetaData.cardsIncluded,
            cardTier,
            forcedType: slotMetaData.forcedCardType,
            isEmergencyPack: packMetaData.isEmergencyPack,
            isNewCard,
            isVariant,
            userCardsIds,
          });

          const chosenCard = selectCard(cardsData, cardPool);

          returnLoot.push({
            type: LootType.CARD,
            data: chosenCard,
            isNew: !userCardsIds.includes(chosenCard.cardId)
          })
        }
      }
    }
  
    return returnLoot;
  } else {
    console.log(`couldnt find pack data at packs/${packType}`)
    return []
  }
}


