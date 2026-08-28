import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateMythicPool } from "../updateMythicPool";

const { mockArrayUnion, mockDoc, mockGet, mockSet } = vi.hoisted(() => {
  const mockGet = vi.fn();
  const mockSet = vi.fn();

  return {
    mockGet,
    mockSet,
    mockDoc: vi.fn(() => ({ get: mockGet, set: mockSet })),
    mockArrayUnion: vi.fn((driverId: string) => driverId),
  };
});

vi.mock("firebase-admin/firestore", () => ({
  getFirestore: vi.fn(() => ({ doc: mockDoc })),
  FieldValue: { arrayUnion: mockArrayUnion },
}));

function createRaceResult(position: string, driverId: string) {
  return {
    position,
    Driver: { driverId },
  } as any;
}

describe("updateMythicPool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds a new race winner to the mythic pool", async () => {
    mockGet.mockResolvedValue({ get: vi.fn(() => []) });

    await updateMythicPool([createRaceResult("1", "winner-id")]);

    expect(mockArrayUnion).toHaveBeenCalledWith("winner-id");
    expect(mockSet).toHaveBeenCalledWith(
      { mythicPool: "winner-id" },
      { merge: true },
    );
  });

  it("does not write when the winner is already in the mythic pool", async () => {
    mockGet.mockResolvedValue({ get: vi.fn(() => ["winner-id"]) });

    await updateMythicPool([createRaceResult("1", "winner-id")]);

    expect(mockSet).not.toHaveBeenCalled();
  });

  it("does not write when race results do not include a winner", async () => {
    mockGet.mockResolvedValue({ get: vi.fn(() => []) });

    await updateMythicPool([createRaceResult("2", "second-place")]);

    expect(mockSet).not.toHaveBeenCalled();
  });
});
