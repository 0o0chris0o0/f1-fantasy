import { CardType, iCardRarity, type iCardInCollection, type iCardInUsersCards, type iConstructorCard, type iConstructorCollectionCard, type iDriverCard, type iDriverCollectionCard } from "~/types/card";
import type { iCurrentTeam } from "~/types/user";

const rarityOrder: Record<string, number> = {
  LEGENDARY: 4,
  RARE: 3,
  UNCOMMON: 2,
  COMMON: 1,
};

export function getFilterKeyForMyCards(item: any, key: string) {
  switch (key) {
    case 'name':
      return (item.cardData?.cardName || '').toString();
    case 'rarity':
      return (rarityOrder[item.rarity] || 0);
    case 'quantity':
      return (item.quantity || 0);
    case 'level':
      return (item.level || 0);
    case 'points':
      return (item.cardData?.stats?.currentFantasyPoints || 0);
    default:
      return '';
  }
};

export function getFilterKeyForCollection(item: iDriverCollectionCard | iConstructorCollectionCard, key: string) {
  switch (key) {
    case 'name':
      return (item.cardName || '').toString();
    case 'rarity':
      return (rarityOrder[item.rarity] || 0);
    case 'quantity':
      return (item.quantity || 0);
    default:
      return '';
  }
};

export function createCardsForCollection(
  allCards: (iDriverCard | iConstructorCard)[], 
  userCards: iCardInUsersCards[],
  userCollection: Record<string, iCardInCollection>
): (iDriverCollectionCard | iConstructorCollectionCard)[] {
  const constructors = allCards.filter(
    (c) => (c as any).type === 'constructor'
  ) as iConstructorCard[];
  const drivers = allCards.filter(
    (c) => (c as any).type === 'driver'
  ) as iDriverCard[];

  const rarities = [
    iCardRarity.COMMON,
    iCardRarity.UNCOMMON,
    iCardRarity.RARE,
    iCardRarity.LEGENDARY
  ]

  const userCardsById: Record<string, iCardInUsersCards> = {};
  userCards.forEach((card) => {
    userCardsById[`${card.cardData.cardId}_${card.rarity}`] = card
  })

  const constructorCardsForCollection: iConstructorCollectionCard[] = Object.values(rarities).flatMap((rarity) => {
    return constructors.map((card: iConstructorCard) => ({
      ...card,
      rarity: iCardRarity[rarity],
      quantity: userCardsById[`${card.cardId}_${rarity}`]?.quantity || 0,
      userHasInCollection: !!userCollection[`${card.cardId}_${rarity}`]
    }))
  })

  const driverCardsForCollection: iDriverCollectionCard[] = Object.values(rarities).flatMap((rarity) => {
    return drivers.map((card: iDriverCard) => ({
      ...card,
      rarity: iCardRarity[rarity],
      quantity: userCardsById[`${card.cardId}_${rarity}`]?.quantity || 0,
      userHasInCollection: !!userCollection[`${card.cardId}_${rarity}`]
    }))
  })

  return defaultCollectionSorting([...constructorCardsForCollection, ...driverCardsForCollection]);
}

export function sortCardsForMyCards(
  cards: iCardInUsersCards[], 
  searchText: string, 
  selectedRarity: string, 
  selectedTeam: string,
  sortBy: string
){
  let out = cards.filter((c) => {
    const name = c.cardData.cardName?.toLowerCase() || '';
    const team = c.cardData.teamName?.toLowerCase() || '';
    const q = searchText.trim().toLowerCase();

    if (q) {
      if (!(name.includes(q) || team.includes(q))) return false;
    }

    if (selectedRarity !== 'ALL' && c.rarity !== selectedRarity) return false;

    if (selectedTeam !== 'ALL' && c.cardData.teamName !== selectedTeam) return false;

    return true;
  });

   const compareMulti = (a: iCardInUsersCards, b: iCardInUsersCards) => {
    // allow comma-separated criteria like "rarity:desc,name" or "name,level:asc"
    const criteria = String(sortBy || 'name').split(',').map(s => s.trim()).filter(Boolean);

    for (const crit of criteria) {
      const [rawKey, rawDir] = crit.split(':').map(s => s && s.trim());
      const key = rawKey || 'name';
      const dir = (rawDir || 'asc').toLowerCase();

      const va = getFilterKeyForMyCards(a, key);
      const vb = getFilterKeyForMyCards(b, key);

      let res = 0;
      if (typeof va === 'string' && typeof vb === 'string') {
        res = va.localeCompare(vb);
      } else {
        res = (Number(va) || 0) - (Number(vb) || 0);
      }

      if (res !== 0) return dir === 'desc' ? -res : res;
    }

    return 0;
  };

  out = out.sort((a: any, b: any) => compareMulti(a, b));

  return out;
}

export function defaultCollectionSorting(
  cards: (iConstructorCollectionCard | iDriverCollectionCard)[]
){
  const constructorCards = cards.filter((c) => c.type === CardType.CONSTRUCTOR);
  const driverCards = cards.filter((c) => c.type === CardType.DRIVER);

  constructorCards
    .sort((a, b) => rarityOrder[a.rarity]! > rarityOrder[b.rarity]! ? -1 : 1)
    .sort((a, b) => a.cardName > b.cardName ? 1 : -1);

  driverCards
    .sort((a, b) => rarityOrder[a.rarity]! > rarityOrder[b.rarity]! ? -1 : 1)
    .sort((a, b) => a.cardName > b.cardName ? 1 : -1);

  const constructorsByTeam: Record<string, iConstructorCollectionCard[]> = {};
  constructorCards.forEach((c) => {
    if (!constructorsByTeam[c.teamId]) constructorsByTeam[c.teamId] = [];
    constructorsByTeam[c.teamId]?.push(c as iConstructorCollectionCard);
  });

  // group drivers by their teamId for quick lookup
  const driversByTeam: Record<string, iDriverCollectionCard[]> = {};
  driverCards.forEach((d) => {
    if (!driversByTeam[d.teamId]) driversByTeam[d.teamId] = [];
    driversByTeam[d.teamId]?.push(d as iDriverCollectionCard);
  });

  const returnObj: (iDriverCollectionCard | iConstructorCollectionCard)[] = [];

  // add each constructor followed by the drivers
  Object.keys(constructorsByTeam).forEach((con) => {
    const constructorCards = constructorsByTeam[con] || [];
    const driverCards = driversByTeam[con] || [];
    returnObj.push(...constructorCards)
    returnObj.push(...driverCards)
  })

  return returnObj;
}

export function sortCardsForCollection(
  cards: (iDriverCollectionCard | iConstructorCollectionCard)[], 
  searchText: string, 
  selectedRarity: string, 
  selectedTeam: string,
  onlyOwnedCards: boolean,
  sortBy: string
){
  let out = cards.filter((c) => {
    const name = c.cardName?.toLowerCase() || '';
    const team = c.teamName?.toLowerCase() || '';
    const q = searchText.trim().toLowerCase();

    if (q) {
      if (!(name.includes(q) || team.includes(q))) return false;
    }

    if (selectedRarity !== 'ALL' && c.rarity !== selectedRarity) return false;

    if (selectedTeam !== 'ALL' && c.teamName !== selectedTeam) return false;

    // shows only cards that can be added
    if (onlyOwnedCards && (!c.quantity || c.userHasInCollection)) return false;
 
    return true;
  });

   const compareMulti = (a: iDriverCollectionCard | iConstructorCollectionCard, b: iDriverCollectionCard | iConstructorCollectionCard) => {
    // allow comma-separated criteria like "rarity:desc,name" or "name,level:asc"
    const criteria = String(sortBy || 'name').split(',').map(s => s.trim()).filter(Boolean);

    for (const crit of criteria) {
      const [rawKey, rawDir] = crit.split(':').map(s => s && s.trim());
      const key = rawKey || 'name';
      const dir = (rawDir || 'asc').toLowerCase();

      const va = getFilterKeyForCollection(a, key);
      const vb = getFilterKeyForCollection(b, key);

      let res = 0;
      if (typeof va === 'string' && typeof vb === 'string') {
        res = va.localeCompare(vb);
      } else {
        res = (Number(va) || 0) - (Number(vb) || 0);
      }

      if (res !== 0) return dir === 'desc' ? -res : res;
    }

    return 0;
  };

  if (sortBy === 'default') {
    return defaultCollectionSorting(out);
  }

  out = out.sort((a: any, b: any) => compareMulti(a, b));

  return out;
}

export function filterCardsForMyTeam(editing: keyof iCurrentTeam, allCards: iCardInUsersCards[]) {
  let returnCards: iCardInUsersCards[] = [...allCards];

  switch (editing) {
    case 'commonDriver':
      returnCards = allCards.filter(c => c.rarity === iCardRarity.COMMON && c.cardData.type === CardType.DRIVER)
      break;

    case 'commonConstructor':
      returnCards = allCards.filter(c => c.rarity === iCardRarity.COMMON && c.cardData.type === CardType.CONSTRUCTOR)
      break;

    case 'uncommonDriver':
      returnCards = allCards.filter(c => (c.rarity === iCardRarity.COMMON || c.rarity === iCardRarity.UNCOMMON) && c.cardData.type === CardType.DRIVER)
      break;

    case 'uncommonConstructor':
      returnCards = allCards.filter(c => (c.rarity === iCardRarity.COMMON || c.rarity === iCardRarity.UNCOMMON) && c.cardData.type === CardType.CONSTRUCTOR)
      break;

    case 'rareLegendaryDriver':
      returnCards = allCards.filter(c => c.cardData.type === CardType.DRIVER)
      break;

    case 'rareLegendaryConstructor':
      returnCards = allCards.filter(c => c.cardData.type === CardType.CONSTRUCTOR)
      break;
  }

  returnCards = returnCards.sort((a, b) => {
    const rarityA = rarityOrder[a.rarity] || 0;
    const rarityB = rarityOrder[b.rarity] || 0;

    if (rarityA !== rarityB) {
      return rarityB - rarityA; // higher rarity first
    }

    const nameA = a.cardData.cardName || '';
    const nameB = b.cardData.cardName || '';

    return nameA.localeCompare(nameB); // sort by name if same rarity
  }).sort((a, b) => {
    const pointsA = a.cardData.stats?.currentFantasyPoints || 0;
    const pointsB = b.cardData.stats?.currentFantasyPoints || 0;

    return pointsB - pointsA; // higher points first
  });

  return returnCards;

}