import type { iFBUser } from "@f1pick6/shared";

const newPlayerStarterObj: iFBUser = {
  cards: [],
  cardsInCollection: 0,
  cardsHistory: {},
  collection: {},
  collectionCompletion: 0,
  currentScore: 0,
  currentTeam: {
    legendaryDriver: null,
    legendaryConstructor: null,
    rareDriver: null,
    rareConstructor: null,
    uncommonDriver: null,
    uncommonConstructor: null,
  },
  dailyDealCardsPurchased: [],
  displayName: '',
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