import type { iFBUser } from "@f1pick6/shared";

const newPlayerStarterObj: iFBUser = {
  cards: [],
  cardsInCollection: 0,
  cardsHistory: {},
  collection: {},
  collectionCompletion: 0,
  currentScore: 0,
  currentTeam: {
    uncommonSlot_a: null,
    uncommonSlot_b: null,
    rareSlot_a: null,
    rareSlot_b: null,
    legendarySlot_a: null,
    legendarySlot_b: null,
  },
  dailyDealCardsPurchased: [],
  displayName: "",
  latestResult: null,
  latestResultCleared: false,
  money: 1000,
  packs: {},
  progressInRewardTrack: 0,
  results: [],
  rewardLevel: 1,
  seenCards: [],
};

export default newPlayerStarterObj;
