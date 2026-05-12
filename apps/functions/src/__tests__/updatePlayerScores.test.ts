import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updatePlayerScores } from '../updatePlayerScores'; // Update this path
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { Timestamp } from 'firebase/firestore';

// 1. Define the mock functions outside so we can control them in tests
const mockGet = vi.fn();
const mockUpdate = vi.fn();
const mockCommit = vi.fn();

// Mock the firebase-admin/firestore module
vi.mock('firebase-admin/firestore', () => {
  return {
    getFirestore: vi.fn(() => ({
      // This matches firestore.collection("players").get()
      collection: vi.fn(() => ({
        get: mockGet, 
      })),
      batch: vi.fn(() => ({
        update: mockUpdate,
        commit: mockCommit,
      })),
    })),
    FieldValue: {
      increment: vi.fn((val) => val),
      arrayUnion: vi.fn((val) => val),
    },  
  };
});

// Mock your helper function
vi.mock('../generatePlayerScores.ts', () => ({
  generatePlayerScores: vi.fn(() => ({ totalModifiedScore: 10 })),
}));

describe('updatePlayerScores', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should correctly decrement card quantities and commit updates', async () => {
    const db = getFirestore();
    const mockBatch = db.batch();

    // Setup mock player data
    const mockPlayerDoc = {
      ref: { id: 'player1' },
      get: vi.fn((field) => {
        if (field === 'currentTeam') return { 
          commonDriver: { cardData: { cardId: 'driver_1' } } 
        };
        if (field === 'cards') return [
          { cardData: { cardId: 'driver_1' }, quantity: 2 }
        ];
        if (field === 'cardsHistory') return {};
        if (field === 'displayName') return 'Test Player';
      }),
    };

    // Mock the collection.get() response
    mockGet.mockResolvedValue({
      docs: [mockPlayerDoc]
    });

    const fantasyScores = {}; // Mock data as needed
    await updatePlayerScores(fantasyScores, {
      nextRaceName: 'Test Race',
      nextRaceStart: new Timestamp(0, 0),
      teamEditCutoff: new Timestamp(0, 0),
      currentRound: 1
    });

    // Assertions
    expect(db.batch).toHaveBeenCalled();
    
    // Check if cards quantity was decremented (2 -> 1)
    const updateCall = vi.mocked(mockBatch.update).mock.calls[0];
    const updatedData = updateCall[1] as any;

    expect(updatedData.cards[0].quantity).toBe(1);
    
    // Verify FieldValue.increment was called correctly
    expect(FieldValue.increment).toHaveBeenCalledWith(10);

    // Verify commit was called
    expect(mockBatch.commit).toHaveBeenCalled();
  });

  it('should remove a card if quantity is 1', async () => {
    const db = getFirestore();
    const mockBatch = db.batch();

    const mockPlayerDoc = {
      ref: { id: 'player1' },
      get: vi.fn((field) => {
        if (field === 'currentTeam') return { d1: { cardData: { cardId: 'card_to_delete' } } };
        if (field === 'cards') return [{ cardData: { cardId: 'card_to_delete' }, quantity: 1 }];
        if (field === 'cardsHistory') return {};
      }),
    };

     // Mock the collection.get() response
    mockGet.mockResolvedValue({
      docs: [mockPlayerDoc]
    });

    await updatePlayerScores({}, { currentRound: 1, nextRaceName: 'Test Race', nextRaceStart: new Timestamp(0, 0), teamEditCutoff: new Timestamp(0, 0) });

    const updatedData = vi.mocked(mockBatch.update).mock.calls[0][1] as any;
    expect(updatedData.cards.length).toBe(0); // Card should be spliced out
  });

  it('should update the players card history object correctly', async () => {
    const db = getFirestore();
    const mockBatch = db.batch();

    let testCardHistory = {
      testCardId: {
        xp: 1,
        level: 1
      }
    }

    const mockPlayerDoc = {
      ref: { id: 'player1' },
      get: vi.fn((field) => {
        if (field === 'currentTeam') return { d1: { cardData: { cardId: 'testCardId' } } };
        if (field === 'cards') return [{ cardData: { cardId: 'testCardId' }, quantity: 1 }];
        if (field === 'cardsHistory') return testCardHistory;
      }),
    };

     // Mock the collection.get() response
    mockGet.mockResolvedValueOnce({
      docs: [mockPlayerDoc]
    });

    await updatePlayerScores({}, { currentRound: 1, nextRaceName: 'Test Race', nextRaceStart: new Timestamp(0, 0), teamEditCutoff: new Timestamp(0, 0) });

    const updatedData = vi.mocked(mockBatch.update).mock.calls[0][1] as any;
    expect(updatedData.cardsHistory.testCardId.level).toBe(2);
    expect(updatedData.cardsHistory.testCardId.xp).toBe(2); // Card should be spliced out
  })
});