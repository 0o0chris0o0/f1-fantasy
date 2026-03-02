import { CardType, iCardRarity, type iCardInUsersCards } from "../types/card";
import type { iCurrentTeam } from "../types/user";

export interface iCardScoreModifier {
  totalScoreModifier: number;
  rarityModifier: number;
  levelModifier: number;
  homeRaceModifier: number;
  teamMatchModifier: number;
}

export const calcCurrentModifierScore = (card: iCardInUsersCards, currentRound: number, currentTeam: iCurrentTeam): iCardScoreModifier => {
  let modifierObj: iCardScoreModifier = {
    totalScoreModifier: 0,
    rarityModifier: 0,
    levelModifier: 0,
    homeRaceModifier: 0,
    teamMatchModifier: 0
  };

  // check card rarity
  switch (card.rarity) {
    case iCardRarity.UNCOMMON:
      modifierObj.rarityModifier += 0.1;
      break;
    case iCardRarity.RARE:
      modifierObj.rarityModifier += 0.2;
      break;
    case iCardRarity.LEGENDARY:
      modifierObj.rarityModifier += 0.3;
      break;
    case iCardRarity.MYTHIC:
      modifierObj.rarityModifier = 1;
      break;
  }

  // check card level
  if (card.level > 1) {
    modifierObj.levelModifier += (card.level - 1) * 0.1;
  }

  // check for home races
  if (currentRound) {
    const homeRaceRounds = card.cardData.homeRaces.map((race) => race.round);
    if (homeRaceRounds.includes(currentRound)) {
      modifierObj.homeRaceModifier += 0.1;
    }

  }
  
  // check for Matching driver & constructor
  const teamId = card.cardData.teamId;

  if (card.cardData.type === CardType.DRIVER) {
    // get all constructor cards from the users current team
    const constructorCards = Object.values(currentTeam || {}).filter((c) => c?.cardData.type === CardType.CONSTRUCTOR);
    // get an array of constructor teamIds
    const constructorTeamIds = constructorCards.map((c) => c?.cardData.teamId).filter(Boolean) as string[];
    if (constructorTeamIds.includes(teamId)) {
      modifierObj.teamMatchModifier += 0.1;
    }
  } else if (card.cardData.type === CardType.CONSTRUCTOR) {
    const driverCards = Object.values(currentTeam || {}).filter((c) => c?.cardData.type === CardType.DRIVER);
    const driverTeamIds = driverCards.map((c) => c?.cardData.teamId).filter(Boolean) as string[];
    if (driverTeamIds.includes(teamId)) {
      modifierObj.teamMatchModifier += 0.1;
    }
  }

  modifierObj.totalScoreModifier = modifierObj.rarityModifier + modifierObj.levelModifier + modifierObj.homeRaceModifier + modifierObj.teamMatchModifier;

  return {
    totalScoreModifier: parseFloat(modifierObj.totalScoreModifier.toFixed(2)),
    rarityModifier: parseFloat(modifierObj.rarityModifier.toFixed(2)),
    levelModifier: parseFloat(modifierObj.levelModifier.toFixed(2)),
    homeRaceModifier: parseFloat(modifierObj.homeRaceModifier.toFixed(2)),
    teamMatchModifier: parseFloat(modifierObj.teamMatchModifier.toFixed(2)),
  };
}