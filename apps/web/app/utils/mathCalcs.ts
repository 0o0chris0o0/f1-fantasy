export function calcCardsInRewardLevel(
  totalCards: number,
  level: number,
  totalLevels: number
) {
  const baseCardsPerLevel = Math.floor(totalCards / totalLevels);
  const extraCards = totalCards % totalLevels;

  // the leftover cards are handed out to the earliest levels
  return level <= extraCards ? baseCardsPerLevel + 1 : baseCardsPerLevel;
}

export function calcProgressForRewardTrack(
  totalCards: number,
  cardCount: number,
  totalLevels: number
) {
  let cardsIntoLevel = cardCount;

  for (let level = 1; level <= totalLevels; level++) {
    const cardsInThisLevel = calcCardsInRewardLevel(
      totalCards,
      level,
      totalLevels
    );

    // there are more levels than cards, so this one can never be completed
    if (cardsInThisLevel === 0) continue;

    if (cardsIntoLevel < cardsInThisLevel) {
      return { progress: cardsIntoLevel, level, completedLevel: null };
    }

    if (cardsIntoLevel === cardsInThisLevel) {
      // the level is complete, so the user moves on to the next one
      return { progress: 0, level: level + 1, completedLevel: level };
    }

    cardsIntoLevel -= cardsInThisLevel;
  }

  // the whole track has been completed
  return { progress: 0, level: totalLevels + 1, completedLevel: null };
}
