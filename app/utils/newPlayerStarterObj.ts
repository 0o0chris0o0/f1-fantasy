import type { iFBUser } from "~/types/user";

const newPlayerStarterObj: iFBUser = {
  cards: [],
  cardsInCollection: 0,
  cardsObtained: [],
  collection: [],
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
  money: 500,
  packs: [],
  packsSinceLastLegendary: 0,
  prevRank: 0,
  results: [],
};

export default newPlayerStarterObj;