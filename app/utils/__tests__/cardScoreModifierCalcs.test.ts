import { describe, expect, it, test } from "vitest";
import { Timestamp } from "firebase/firestore";
import { calcCurrentModifierScore } from "../cardScoreModifierCalcs";
import { CardType, iCardRarity, type iCardInUsersCards, type iConstructorCard, type iDriverCard } from "../../types/card";
import type { iCurrentTeam } from "~/types/user";

const currentRound = 1;
const testDriverCardData: iDriverCard = {
  cardId: 'testDriver',
  cardName: 'Test Driver',
  enabled: true,
  teamId: 'testTeam',
  teamName: 'Test Team',
  nationality: 'United Kingdom',
  nationalityCode: 'GB',
  homeRaces: [{
    raceName: 'Test Race',
    round: 2,
    raceStart: Timestamp.fromDate(new Date()),
    locationCountry: 'United Kingdom',
  }],
  type: CardType.DRIVER,
  stats: {
    currentFantasyPoints: 0,
    averageQualifyingPosition: 0,
    averageRacePosition: 0,
    numberOfDNFs: 0,
  }
};
const testConstructorCardData: iConstructorCard = {
  cardId: 'testConstructor',
  cardName: 'Test Constructor',
  enabled: true,
  teamId: 'testTeam2',
  teamName: 'Test Team 2',
  nationality: 'United Kingdom',
  nationalityCode: 'GB',
  homeRaces: [{
    raceName: 'Test Race',
    round: 2,
    raceStart: Timestamp.fromDate(new Date()),
    locationCountry: 'United Kingdom',
  }],
  type: CardType.CONSTRUCTOR,
  drivers: [
    testDriverCardData
  ],
  stats: {
    currentFantasyPoints: 0,
    averageQualifyingPosition: 0,
    averageRacePosition: 0,
    numberOfDNFs: 0,
  }
};

const testCardInTeam = {
  cardData: testDriverCardData,
  inCollection: false,
  collectedOn: Timestamp.fromDate(new Date()),
  level: 1,
  quantity: 1,
  rarity: iCardRarity.COMMON,
  xp: 0,
}

const testCurrentTeam: iCurrentTeam = {
  rareLegendaryDriver: null,
  rareLegendaryConstructor: null,
  uncommonDriver: null,
  uncommonConstructor: null,
  commonDriver: testCardInTeam,
  commonConstructor: {
    ...testCardInTeam,
    cardData: testConstructorCardData,
  },
};

describe('calcCurrentModifierScore - rarities', () => {
  it('should calculate the correct modifier based on the card rarity', () => {
    const expectedResults = [0, 0.1, 0.2, 0.3, 1];

    [iCardRarity.COMMON, iCardRarity.UNCOMMON, iCardRarity.RARE, iCardRarity.LEGENDARY, iCardRarity.MYTHIC].forEach((rarity, i) => { 
      const result = calcCurrentModifierScore({...testCardInTeam, rarity}, currentRound, testCurrentTeam)

      expect(result).toStrictEqual({ 
        totalScoreModifier: expectedResults[i], 
        rarityModifier: expectedResults[i],   
        levelModifier: 0, 
        homeRaceModifier: 0, 
        teamMatchModifier: 0 
      });
    });
  });
});

describe('calcCurrentModifierScore - home race', () => {
  it('should calculate a modifier score of 0.1 for a common card with a home race boost', () => {
    const result = calcCurrentModifierScore(testCardInTeam, 2, testCurrentTeam)

    expect(result).toStrictEqual({ 
      totalScoreModifier: 0.1, 
      rarityModifier: 0, 
      levelModifier: 0, 
      homeRaceModifier: 0.1, 
      teamMatchModifier: 0 
    });
  });
});

describe('calcCurrentModifierScore - level', () => {
  it('should calculate the correct modifier based on the card level', () => {
    const expectedResults = [0, 0.1, 0.2, 0.3];

    [1, 2, 3, 4].forEach((level, i) => { 
      const result = calcCurrentModifierScore({...testCardInTeam, level}, currentRound, testCurrentTeam)

      expect(result).toStrictEqual({ 
        totalScoreModifier: expectedResults[i], 
        rarityModifier: 0,   
        levelModifier: expectedResults[i], 
        homeRaceModifier: 0, 
        teamMatchModifier: 0 
      });
    });
  });
});

describe('calcCurrentModifierScore - home race', () => {
  it('should calculate the correct modifier score when a team boost is present', () => {
    const newTestTeam: iCurrentTeam = { ...testCurrentTeam };
    newTestTeam.commonConstructor!.cardData = {
      ...testConstructorCardData,
      teamId: 'testTeam',
    }

    const result = calcCurrentModifierScore(testCardInTeam, currentRound, newTestTeam)

    expect(result).toStrictEqual({ 
      totalScoreModifier: 0.1, 
      rarityModifier: 0, 
      levelModifier: 0, 
      homeRaceModifier: 0, 
      teamMatchModifier: 0.1 
    });
  });
});