export function calcProgressForRewardTrack(
  totalCards: number,
  cardCount: number,
) {
  const baseCardsPerLevel = Math.floor(totalCards / 10);
  const extraCards = totalCards % 10;

  let returnObj = {
    progress: 0,
    level: 1,
  };

  for (let level = 1; level <= 10; level++) {
    const cardsInThisLevel =
      level <= extraCards ? baseCardsPerLevel + 1 : baseCardsPerLevel;

    if (cardCount <= cardsInThisLevel) {
      return {
        progress: cardCount === cardsInThisLevel ? 0 : cardCount,
        level,
      };
    }

    cardCount -= cardsInThisLevel;
  }

  return returnObj;
}
