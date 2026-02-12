import type { iConstructorCard, iDriverCard } from "~/types/card";

const rarityOrder: Record<string, number> = {
  LEGENDARY: 4,
  RARE: 3,
  UNCOMMON: 2,
  COMMON: 1,
};

export function getFilterKey(item: any, key: string) {
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

export function sortCardsForCollection(allCards: (iDriverCard | iConstructorCard)[]) {
  const constructors = allCards.filter(
    (c) => (c as any).type === 'constructor'
  ) as iConstructorCard[];
  const drivers = allCards.filter(
    (c) => (c as any).type === 'driver'
  ) as iDriverCard[];

  // group drivers by their teamId for quick lookup
  const driversByTeam: Record<string, iDriverCard[]> = {};
  drivers.forEach((d) => {
    if (!driversByTeam[d.teamId]) driversByTeam[d.teamId] = [];
    driversByTeam[d.teamId]?.push(d);
  });

  const patterned: (iDriverCard | iConstructorCard)[] = [];
  const usedDriverIds = new Set<string>();

  // For each constructor push the constructor then up to 2 drivers for that team
  for (const cons of constructors) {
    patterned.push(cons);
    const teamDrivers = driversByTeam[cons.teamId] || [];
    let added = 0;
    for (const d of teamDrivers) {
      if (added >= 2) break;
      if (!usedDriverIds.has(d.cardId)) {
        patterned.push(d);
        usedDriverIds.add(d.cardId);
        added++;
      }
    }
  }

  // Append any remaining drivers that weren't placed after a constructor
  for (const d of drivers) {
    if (!usedDriverIds.has(d.cardId)) patterned.push(d);
  }

  return patterned;
}