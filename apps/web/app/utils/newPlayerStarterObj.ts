import type { iFBUser } from "@f1pick6/shared";

const newPlayerStarterObj: iFBUser = {
  cards: [],
  cardsInCollection: 0,
  cardsHistory: {},
  collection: {},
  collectionCompletion: 0,
  currentRank: 0,
  currentScore: 0,
  currentTeam: {
    rareLegendaryDriver: null,
    rareLegendaryConstructor: null,
    uncommonDriver: null,
    uncommonConstructor: null,
    commonDriver: null,
    commonConstructor: null,
  },
  displayName: '',
  latestResult: null,
  money: 1200,
  packs: {},
  prevRank: 0,
  progressInRewardTrack: 0,
  results: [],
  rewardLevel: 1,
};

export default newPlayerStarterObj;