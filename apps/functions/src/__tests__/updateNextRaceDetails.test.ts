import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateNextRaceDetails } from "../updateNextRaceDetails";

const { mockDoc, mockSet } = vi.hoisted(() => ({
  mockDoc: vi.fn(),
  mockSet: vi.fn(),
}));

vi.mock("firebase-admin/firestore", () => ({
  getFirestore: vi.fn(() => ({ doc: mockDoc })),
}));

describe("updateNextRaceDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("advances the round and stores the next race details", async () => {
    const nextScheduleDoc = {
      get: vi.fn().mockResolvedValue({
        exists: true,
        data: () => ({
          raceName: "Next Grand Prix",
          raceStart: "race-start",
          firstPractice: "practice-start",
        }),
      }),
    };
    const roundInfoDoc = { set: mockSet };
    mockDoc.mockImplementation((path: string) =>
      path === "schedule/round6" ? nextScheduleDoc : roundInfoDoc,
    );

    await updateNextRaceDetails(5);

    expect(mockSet).toHaveBeenCalledWith(
      {
        currentRound: 6,
        nextRaceName: "Next Grand Prix",
        nextRaceStart: "race-start",
        teamEditCutoff: "practice-start",
      },
      { merge: true },
    );
  });

  it("advances the round when no next race exists", async () => {
    const nextScheduleDoc = {
      get: vi.fn().mockResolvedValue({ exists: false, data: () => undefined }),
    };
    const roundInfoDoc = { set: mockSet };
    mockDoc.mockImplementation((path: string) =>
      path === "schedule/round25" ? nextScheduleDoc : roundInfoDoc,
    );

    await updateNextRaceDetails(24);

    expect(mockSet).toHaveBeenCalledWith({ currentRound: 25 }, { merge: true });
  });
});
