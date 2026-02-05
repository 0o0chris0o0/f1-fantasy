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
