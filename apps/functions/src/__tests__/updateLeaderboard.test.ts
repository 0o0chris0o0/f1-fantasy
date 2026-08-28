import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateLeaderboard } from "../updateLeaderboard";

const mockGet = vi.fn();
const mockUpdate = vi.fn();
const mockSet = vi.fn();
const mockCommit = vi.fn();
const mockDoc = vi.fn((id: string) => ({ id }));
const mockCollection = vi.fn(() => ({ get: mockGet, doc: mockDoc }));

vi.mock("firebase-admin/firestore", () => ({
  getFirestore: vi.fn(() => ({
    collection: mockCollection,
    batch: vi.fn(() => ({
      update: mockUpdate,
      set: mockSet,
      commit: mockCommit,
    })),
  })),
}));

describe("updateLeaderboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds race points to totals and ranks tied players by player ID", async () => {
    mockGet.mockResolvedValue({
      docs: [
        {
          ref: { id: "player-a" },
          data: () => ({
            playerId: "player-a",
            playerName: "Player A",
            currentScore: 100,
            currentRank: 1,
            prevRank: 1,
            qualifyingScore: 0,
            raceScore: 0,
            modifierScore: 0,
          }),
        },
        {
          ref: { id: "player-b" },
          data: () => ({
            playerId: "player-b",
            playerName: "Player B",
            currentScore: 50,
            currentRank: 2,
            prevRank: 2,
            qualifyingScore: 0,
            raceScore: 0,
            modifierScore: 0,
          }),
        },
      ],
    });

    const leaderboard = await updateLeaderboard({
      "player-a": {
        playerId: "player-a",
        playerName: "Player A",
        currentScore: 10,
        qualifyingScore: 4,
        raceScore: 6,
        modifierScore: 0,
      },
      "player-b": {
        playerId: "player-b",
        playerName: "Player B",
        currentScore: 60,
        qualifyingScore: 10,
        raceScore: 50,
        modifierScore: 0,
      },
    });

    expect(leaderboard["player-a"]).toMatchObject({
      currentScore: 110,
      currentRank: 1,
      prevRank: 1,
    });
    expect(leaderboard["player-b"]).toMatchObject({
      currentScore: 110,
      currentRank: 2,
      prevRank: 2,
    });
    expect(mockUpdate).toHaveBeenCalledTimes(2);
    expect(mockCommit).toHaveBeenCalledOnce();
  });

  it("creates a leaderboard entry for a player without an existing record", async () => {
    mockGet.mockResolvedValue({ docs: [] });

    const leaderboard = await updateLeaderboard({
      "new-player": {
        playerId: "new-player",
        playerName: "New Player",
        currentScore: 25,
        qualifyingScore: 10,
        raceScore: 15,
        modifierScore: 0,
      },
    });

    expect(leaderboard["new-player"]).toMatchObject({
      currentScore: 25,
      currentRank: 1,
      prevRank: 1,
    });
    expect(mockDoc).toHaveBeenCalledWith("new-player");
    expect(mockSet).toHaveBeenCalledWith(
      { id: "new-player" },
      leaderboard["new-player"],
    );
    expect(mockCommit).toHaveBeenCalledOnce();
  });
});
