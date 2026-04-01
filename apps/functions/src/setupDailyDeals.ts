import { iCardRarity, iConstructorCard, iDailyDealCard, iDriverCard, WeekDay, WeeklySchedule } from "@f1pick6/shared/types";
import { getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";

export async function setupDailyDeals(updatedCards: (iDriverCard | iConstructorCard)[]) {
  const firestore = getFirestore();

  const days: WeekDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Shuffle and pick 25
  const selected = [...updatedCards]
    .sort(() => Math.random() - 0.5)
    .slice(0, 25);

  const rarityMap = [
    { limit: 5,  rarity: iCardRarity.LEGENDARY },
    { limit: 10, rarity: iCardRarity.RARE },
    { limit: 15, rarity: iCardRarity.UNCOMMON },
    { limit: 25, rarity: iCardRarity.COMMON }
  ];

  const formattedCards: iDailyDealCard[] = selected.map((card, index) => {
    const config = rarityMap.find(c => index < c.limit)!;
    return {
      cardData: card,
      rarity: config.rarity,
      price: setPrice(config.rarity, card.stats.averageFantasyPoints)
    };
  });
  
  // 1. Organize your selected cards into "Buckets"
  const legendaries = formattedCards.filter(c => c.rarity === iCardRarity.LEGENDARY); // 5 cards
  const rares       = formattedCards.filter(c => c.rarity === iCardRarity.RARE);      // 5 cards
  const uncommons   = formattedCards.filter(c => c.rarity === iCardRarity.UNCOMMON);  // 5 cards
  const commons     = formattedCards.filter(c => c.rarity === iCardRarity.COMMON);    // 10 cards

  // 2. Distribute them into the WeeklySchedule
  const finalSchedule: WeeklySchedule = days.reduce((acc, day, index) => {
    acc[day] = [
      legendaries[index],       // Pick the i-th legendary
      rares[index],             // Pick the i-th rare
      uncommons[index],         // Pick the i-th uncommon
      commons[index * 2],       // Pick the first common for this day
      commons[index * 2 + 1]    // Pick the second common for this day
    ];
    return acc;
  }, {} as WeeklySchedule);

  logger.info('Setting new daily deals')

  const dailyStoreRef = firestore.doc('appData/dailyStores');

  await dailyStoreRef.set(finalSchedule);
}

function setPrice(rarity: iCardRarity, averagePoints: number) {
  const rarityPrices: Record<iCardRarity, number> = {
    [iCardRarity.COMMON]: 1.1,
    [iCardRarity.UNCOMMON]: 1.2,
    [iCardRarity.RARE]: 1.3,
    [iCardRarity.LEGENDARY]: 1.4,
    [iCardRarity.MYTHIC]: 1.5
  }

  const price = (averagePoints * 1.5) * rarityPrices[rarity];

  // ensure price is rounded down to the nearest 5
  return Math.floor(price / 5) * 5;
}