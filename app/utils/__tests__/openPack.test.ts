import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pickCardsForUser, createLootCards } from '../openPack';
import { type iConstructorCard, type iDriverCard } from '../../types/card';
import type { iPack } from '../../types/pack';

import { mockDriverCards } from '../__mocks__/mockDriverCards';
import { mockConstructorCards } from '../__mocks__/mockConstructorCards';
import { mockPackData } from '../__mocks__/mockPackData';
import { mockUsersCurrentCards } from '../__mocks__/mockUsersCurrentCards';
import { mockUsersCardHistory } from '../__mocks__/mockUsersCardHistory';


describe('pickCardsForUser', () => {
  let mockAllCards: (iDriverCard | iConstructorCard)[];

  beforeEach(() => {
    mockAllCards = [...mockDriverCards, ...mockConstructorCards];
  });

  it('should return an array of cards', () => {
    const result = pickCardsForUser(mockAllCards, 6);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return the correct number of new cards based on param', () => {
    const result = pickCardsForUser(mockAllCards, 6);
    expect(result.length).toBe(6);
  });

  it('should not pick the same card twice in a single pack', () => {
    const pickedIds = [];

    for (let i = 0; i < 50; i++) {
      const result = pickCardsForUser(mockAllCards, 6);
      const cardIds = result.map((card) => card.cardId);
      const uniqueCardIds = new Set(cardIds);
      expect(uniqueCardIds.size).toBe(cardIds.length);
    }
  });

  it('should enforce driver on last slot if no driver has been selected', () => {
    // create test object containing only 1 driver
    const modifiedAllCards = [mockDriverCards[0]!, ...mockConstructorCards]

    const result = pickCardsForUser(modifiedAllCards, 2);

    const hasDriver = result.some((card) =>
      mockDriverCards.some((dc) => dc.cardId === card.cardId)
    );
    expect(hasDriver).toBe(true);
  });

  it('should enforce constructor on last slot if no constructor has been selected', () => {
    // create test object containing only 1 driver
    const modifiedAllCards = [...mockDriverCards, mockConstructorCards[0]!];

    const result = pickCardsForUser(modifiedAllCards, 2);

    const hasConstructor = result.some((card) =>
      mockConstructorCards.some((cc) => cc.cardId === card.cardId)
    );
    expect(hasConstructor).toBe(true);
  });
});

describe('createLootCards', () => {
  let mockAllCards: (iDriverCard | iConstructorCard)[];

  beforeEach(() => {
    mockAllCards = [...mockDriverCards, ...mockConstructorCards];
  });

  it('adds new cards when user does not have any', () => {
    const newCards = pickCardsForUser(mockAllCards, 6);
    const result = createLootCards(newCards, mockPackData, [], {});

    expect(result).toHaveLength(6);
    expect(result[0]!.cardData.cardId).toBe(newCards[0]!.cardId);
    expect(result[0]!.rarity).toBe('COMMON');
    expect(result[0]!.quantity).toBe(1);
  });

  it('increments quantity when user already has the same card and rarity', () => {
    // force random card to be first available (will gurantee albon selection)
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const newCards = pickCardsForUser(mockAllCards, 6);
    const result = createLootCards(newCards, mockPackData, mockUsersCurrentCards, mockUsersCardHistory);

    const albonCard = result.find((card) => card.cardData.cardId === 'albon');

    expect(result).toHaveLength(6);
    expect(albonCard!.quantity).toBe(2);
  });
});
