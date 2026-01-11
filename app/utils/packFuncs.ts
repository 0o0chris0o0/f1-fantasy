import { CardType, type iCard } from "~/types/card";
import { LootType, TyreType, type iSlot } from "~/types/pack";

type WeightedItem<T> = {
  value: T;
  weight: number;
};

interface iGenerateCardPoolParams {
  allCards: iCard[],
  cardsInPack: number;
  cardTier: number;
  forcedType: CardType | 'any';
  isEmergencyPack: boolean;
  isNewCard: boolean;
  isVariant: boolean;
  userCardsIds: string[],
}

function weightedRandom<T>(items: WeightedItem<T>[]): T {
  // Calculate the total weight of all items
  const totalWeight = items.reduce((acc, item) => acc + item.weight, 0);

  // Generate a random number between 0 and the total weight
  const randomValue = Math.random() * totalWeight;

  // Accumulate weight and compare with random value to find the chosen item
  let accumulatedWeight = 0;
  for (const item of items) {
    accumulatedWeight += item.weight;
    if (randomValue <= accumulatedWeight) {
      return item.value;
    }
  }

  // If no item is chosen (shouldn't happen), return the first item as a default
  return items[0].value;
}

export function selectLootType (slotMetaData: iSlot): LootType {
  const lootType = weightedRandom([
    {
      value: LootType.CARD,
      weight: slotMetaData.lootCardChance
    },
    {
      value: LootType.TOKEN,
      weight: slotMetaData.lootTokenChance
    },
    {
      value: LootType.TYRE,
      weight: slotMetaData.lootTyreChance
    }
  ]);

  return lootType;
}

export function selectTyre(slotMetaData: iSlot): TyreType {
  const tyreType = weightedRandom([
    {
      value: TyreType.HARD,
      weight: slotMetaData.hardTyreChance
    },
    {
      value: TyreType.MEDIUM,
      weight: slotMetaData.mediumTyreChance
    },
    {
      value: TyreType.SOFT,
      weight: slotMetaData.softTyreChance
    }
  ]);

  return tyreType;
}

export function selectIsVariant(slotMetaData: iSlot): boolean {
  const isVariant = weightedRandom([
    {
      value: true,
      weight: slotMetaData.variantChance
    },
    {
      value: false,
      weight: 100 - slotMetaData.variantChance
    }
  ]);

  return isVariant;
}

export function selectIsNew(slotMetaData: iSlot): boolean {
  const isNewCard = weightedRandom([
    {
      value: true,
      weight: slotMetaData.newCardChance
    },
    {
      value: false,
      weight: 100 - slotMetaData.newCardChance
    }
  ]);

  return isNewCard;
}

export function selectCardTier(slotMetaData: iSlot, modifiedTier1Value: number): number {
  const cardTier = weightedRandom([
    {
      value: 1,
      weight: modifiedTier1Value
    },
    {
      value: 2,
      weight: slotMetaData.tier2Chance
    },
    {
      value: 3,
      weight: slotMetaData.tier3Chance
    }
  ]);

  return cardTier;
}

function generateWeightedCardTable(cards: iCard[]): WeightedItem<string>[] {
  const returnObj: WeightedItem<string>[] = [];

  cards.forEach(card => {
    returnObj.push({
      weight: card.currentRank,
      value: card.cardId
    })
  })

  return returnObj;
}

export function generateCardPool(options: iGenerateCardPoolParams): iCard[] {
  let cardPool = options.allCards;

  // first narrow cards down by tier
  cardPool = cardPool.filter((card) => card.currentTier === options.cardTier);

  // then filter by card type (this value will either be 'any' or a CardType)
  if (options.forcedType !== 'any') {
    cardPool = cardPool.filter((card) => card.type === options.forcedType)
  }

  // then check if a new card is available
  if (options.isNewCard && cardPool.some(card => !options.userCardsIds.includes(card.cardId))) {
    cardPool = cardPool.filter((card) => !options.userCardsIds.includes(card.cardId))
  }

  // then if the pack is designated as emergency, filter to already obtained cards - if possible
  if (options.isEmergencyPack) {
    const playersObtainedCards = cardPool.filter((card) => options.userCardsIds.includes(card.cardId));

    // check there are enough unobtained cards to add - if not all cards will be in the pool
    if ((options.forcedType !== CardType.DRIVER && playersObtainedCards.length) || (options.forcedType === CardType.DRIVER && playersObtainedCards.length >= 2)) {
      cardPool = playersObtainedCards;
    }
  }

  if (!cardPool.length) {
    // couldn't filter cards so picking from all
    console.log('no card filtering!!')
    return options.allCards;
  }
    
  return cardPool;
}

export function selectCard (cardsData: iCard[], cardPool: iCard[]): iCard {
  const weightedCardPool = generateWeightedCardTable(cardPool)
  const cardId = weightedRandom(weightedCardPool);

  // remove selected card from obj to avoid dupes
  const indexToRm = cardsData.findIndex((card) => card.cardId === cardId)
  const cardSelected = cardsData.splice(indexToRm, 1)

  // return card data
  return cardSelected[0];
}