<template>
  <Loader v-if="isLoading" />
  <PageHeader class="mb-6">Collection</PageHeader>

  <!-- Progress Bar -->
  <div
    v-if="userObj?.collectionCompletion !== undefined"
    class="flex items-center justify-between gap-3 px-4"
  >
    <div class="font-f1 font-bold leading-tight uppercase text-center">
      <span class="text-xs">Cards</span>
      <p>{{ userObj.cardsInCollection }}/{{ totalCards }}</p>
    </div>

    <div class="flex-1 relative">
      <div
        class="absolute mx-auto w-full h-3 rounded-full border-2 border-dashed overflow-hidden opacity-75 collection-track"
      >
        <div
          class="absolute h-full bg-green-600 collection-track-inner"
          :style="`width: ${userObj.collectionCompletion}%;`"
        />
      </div>
      <div
        class="absolute collection-track-car"
        :style="`left: ${userObj.collectionCompletion < 5 ? 5 : userObj.collectionCompletion}%;`"
      >
        <Icon name="cbi:f1-alt" class="rotate-90 text-5xl" />
      </div>
    </div>
    <div class="font-f1 font-bold">
      <p>{{ userObj.collectionCompletion }}<span class="text-xs">%</span></p>
    </div>
  </div>

  <!-- Collection Spinner Icon -->
  <div
    v-if="userObj?.rewardLevel && userObj.rewardLevel <= 10"
    class="mt-2 mb-4 text-center"
  >
    <p class="font-headline font-semibold">Next Reward</p>
    <div class="inline-block relative">
      <SegmentedCircle
        :count="calcRewardsCount()"
        :activeCount="userObj.progressInRewardTrack"
      />
      <div
        class="absolute w-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <RewardImage :rewardObj="rewardObj[userObj.rewardLevel]" />
      </div>
    </div>
  </div>

  <div
    class="flex items-center justify-between mb-4 border-b border-gray-700 pb-4 px-4"
  >
    <div class="flex gap-4">
      <button
        @click="setSelectedType('ALL')"
        :class="[
          'font-headline pb-1 border-b-2 text-sm transition-colors',
          selectedType === 'ALL'
            ? 'border-primary text-primary'
            : 'border-transparent text-on-surface-variant hover:text-on-surface',
        ]"
      >
        ALL
      </button>
      <button
        @click="setSelectedType(CardType.DRIVER)"
        :class="[
          'font-headline pb-1 border-b-2 text-sm transition-colors',
          selectedType === CardType.DRIVER
            ? 'border-primary text-primary'
            : 'border-transparent text-on-surface-variant hover:text-on-surface',
        ]"
      >
        DRIVERS
      </button>
      <button
        @click="setSelectedType(CardType.CONSTRUCTOR)"
        :class="[
          'font-headline pb-1 border-b-2 text-sm transition-colors',
          selectedType === CardType.CONSTRUCTOR
            ? 'border-primary text-primary'
            : 'border-transparent text-on-surface-variant hover:text-on-surface',
        ]"
      >
        CONSTRUCTORS
      </button>
    </div>
    <button aria-label="Open filters" @click="toggleFilters" class="pb-1">
      <Icon name="bi:sort-down" class="text-2xl text-primary" />
    </button>
  </div>

  <FiltersDrawer
    v-model:showFilters="showFilters"
    v-model:searchText="searchText"
    v-model:selectedRarity="selectedRarity"
    v-model:selectedTeam="selectedTeam"
    v-model:sortBy="selectedSort"
    v-model:onlyOwnedCards="onlyOwnedCards"
    :teams="teams"
    :sort-options="teamSortOptions"
    @reset="resetFilters"
  />

  <ClientOnly>
    <TransitionGroup name="cards" tag="div" class="space-y-6">
      <div
        v-for="(cardGroups, team) in filteredCardsByTeamAndCard"
        :key="team"
        class="px-4"
      >
        <div class="flex gap-2 items-center mb-3">
          <img
            :src="`/img/teams/${cardGroups[0]?.teamId}.avif`"
            class="h-6 w-auto"
          />
          <p class="font-f1 text-lg font-bold">{{ toTitleCase(team) }}</p>
        </div>
        <div class="grid grid-cols-1 gap-3">
          <div
            v-for="group in cardGroups"
            :key="group.cardId"
            class="bg-gray-800/80 border border-gray-700/60 rounded-xl overflow-hidden shadow-sm"
            :class="{
              'border-green-600 bg-green-600/20':
                getCollectedCountForGroup(group) === 4,
            }"
          >
            <!-- Dropdown Header -->
            <button
              @click="toggleCardOpen(group.cardId)"
              class="w-full px-4 py-3 flex items-center gap-4 justify-between hover:bg-gray-700/50 transition-colors text-left"
            >
              <div class="flex items-center gap-3">
                <Icon
                  :name="
                    group.type === CardType.CONSTRUCTOR
                      ? 'at-icons:wheel'
                      : 'game-icons:full-motorcycle-helmet'
                  "
                  class="text-primary text-xl shrink-0"
                />
                <div>
                  <h4 class="font-headline font-semibold text-base text-white">
                    {{ group.displayName }}
                  </h4>
                  <p class="text-xs text-gray-400">
                    {{ getCollectedCountForGroup(group) }}/4 Collected
                  </p>
                </div>
              </div>

              <div class="ml-auto">
                <Icon
                  v-if="userStore.canUserAddACardToCollection(group.cardId)"
                  name="material-symbols:add-circle"
                  color="#008236"
                  class="opacity-80"
                />
              </div>

              <div class="flex items-center gap-2">
                <!-- Rarity dots -->
                <div class="flex gap-1">
                  <span
                    v-for="card in group.cards"
                    :key="card.rarity"
                    :class="[
                      'w-2 h-2 rounded-full',
                      userStore.doesUserHaveCardInCollection(
                        card.cardId,
                        card.rarity,
                      )
                        ? getRarityBgColor(card.rarity)
                        : 'bg-gray-600 opacity-40',
                    ]"
                    :title="`${card.rarity}: ${userStore.doesUserHaveCardInCollection(card.cardId, card.rarity) ? 'In Collection' : 'Not Collected'}`"
                  />
                </div>
                <Icon
                  name="material-symbols:keyboard-arrow-down-rounded"
                  :class="[
                    'text-2xl text-gray-400 transition-transform duration-200',
                    isCardOpen(group.cardId) ? 'rotate-180 text-primary' : '',
                  ]"
                />
              </div>
            </button>

            <!-- Dropdown Content (Rarities) -->
            <div
              v-show="isCardOpen(group.cardId)"
              class="p-4 border-t border-gray-700/60 bg-gray-900/50"
            >
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div
                  v-for="card in group.cards"
                  :key="`${card.cardId}-${card.rarity}`"
                  class="flex flex-col items-center"
                >
                  <div class="relative w-full">
                    <div
                      v-if="
                        !userStore.doesUserHaveCardInCollection(
                          card.cardId,
                          card.rarity,
                        )
                      "
                      class="absolute inset-0 z-10 text-3xl grid place-content-center gap-1"
                    >
                      <Icon
                        v-if="
                          !userStore.doesUserHaveCard(card.cardId, card.rarity)
                        "
                        name="uis:padlock"
                        class="text-gray-400"
                      />
                      <button
                        v-else
                        @click="handleAddToCollection(card.cardId, card.rarity)"
                        title="Add to collection"
                        class="absolute inset-0 grid place-content-center"
                      >
                        <Icon
                          name="material-symbols:add-circle"
                          color="#008236"
                        />
                      </button>
                    </div>
                    <div class="bg-gray-900 rounded-lg">
                      <UserCard
                        :card="card"
                        :rarity="card.rarity"
                        hideUserData
                        :class="{
                          'opacity-25': !userStore.doesUserHaveCardInCollection(
                            card.cardId,
                            card.rarity,
                          ),
                        }"
                      />
                    </div>
                  </div>
                  <div
                    class="flex justify-center items-center gap-2 mt-1.5 text-xs font-f1 font-bold"
                  >
                    <div
                      v-if="
                        userStore.doesUserHaveCard(card.cardId, card.rarity) &&
                        !userStore.doesUserHaveCardInCollection(
                          card.cardId,
                          card.rarity,
                        )
                      "
                      class="flex items-center gap-1"
                    >
                      <Icon name="bi:stack" />
                      <p>
                        x{{
                          userStore.getXCardFromUserObj(
                            card.cardId,
                            card.rarity,
                          )?.quantity
                        }}
                      </p>
                    </div>
                    <div
                      v-if="
                        userStore.isXCardInUsersCurrentTeam(
                          card.cardId,
                          card.rarity,
                        )
                      "
                    >
                      <Icon
                        name="game-icons:steering-wheel"
                        class="text-green-600"
                      />
                    </div>
                    <div
                      v-if="
                        userStore.doesUserHaveCardInCollection(
                          card.cardId,
                          card.rarity,
                        )
                      "
                    >
                      <Icon
                        name="bi:check-circle-fill"
                        class="text-green-600 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { QueryDocumentSnapshot } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import type { SelectItem } from "@nuxt/ui";
import AddToCollectionConfirmation from "~/components/modals/AddToCollectionConfirmation.vue";
import RewardsInfo from "~/components/modals/RewardsInfo.vue";
import {
  CardType,
  iCardRarity,
  type iConstructorCard,
  type iConstructorCollectionCard,
  type iDriverCard,
  type iDriverCollectionCard,
  type iLoot,
} from "@f1pick6/shared";

definePageMeta({
  middleware: "auth",
});

interface CardGroup {
  cardId: string;
  cardName: string;
  type: CardType;
  teamId: string;
  teamName: string;
  displayName: string;
  cards: (iConstructorCollectionCard | iDriverCollectionCard)[];
}

const db = useFirestore();
const userStore = useUserStore();
const overlay = useOverlay();
const addToCollectionModal = overlay.create(AddToCollectionConfirmation);
const rewardsModal = overlay.create(RewardsInfo);

const { userObj } = storeToRefs(userStore);

// filter / sort state
const selectedType = ref<CardType | "ALL">("ALL");
const searchText = ref("");
const selectedRarity = ref("ALL");
const selectedTeam = ref("ALL");
const selectedSort = ref("default");
const onlyOwnedCards = ref(false);
const showFilters = ref(false);
const openCardIds = ref<Record<string, boolean>>({});

const teamSortOptions: SelectItem[] = [
  { id: "default", label: "Default" },
  { id: "points:desc,rarity:desc,name", label: "Fantasy Points" },
  { id: "rarity:desc,points:desc,name", label: "Rarity (Legendary First)" },
  { id: "rarity:asc,points:desc,name", label: "Rarity (Common First)" },
  { id: "name", label: "Name (A-Z)" },
  { id: "quantity:desc,rarity:desc,name", label: "Quantity" },
];

const isLoading = ref(false);
const allCards = useState<
  (iDriverCollectionCard | iConstructorCollectionCard)[]
>("allCards", () => []);
const totalCards = useState<number>("totalCards", () => 0);
const teams = useState<string[]>("teams", () => []);

const calcRewardsCount = (): number => {
  const totalNumRewards: number = Object.keys(rewardObj).length;
  const userRewardsLevel = userObj.value?.rewardLevel;

  if (userRewardsLevel === undefined) return 0;

  const wholeParts = Math.floor(totalCards.value / totalNumRewards);
  const remainder = totalCards.value % totalNumRewards;

  return userRewardsLevel >= remainder ? wholeParts + 1 : wholeParts;
};

await callOnce(
  async () => {
    // get all cards
    const cardsRef = collection(db, "cards");
    const cardsSnapshot = await getDocs(cardsRef);
    const teamsSet = new Set<string>();

    const cardDocs = cardsSnapshot.docs.map(
      (cardDoc: QueryDocumentSnapshot) => {
        const teamName = cardDoc.get("teamName");
        if (teamName) teamsSet.add(teamName);
        return cardDoc.data() as iDriverCard | iConstructorCard;
      },
    );

    // get a list of all teams
    teams.value = Array.from(teamsSet).sort();

    // get the total number of cards - multiply by 4 for each rarity
    totalCards.value = cardDocs.length * 4;

    // sort the cards for collection
    // this will also duplicate the cards for each rarity
    allCards.value = createCardsForCollection(
      cardDocs,
      userObj.value?.cards || [],
      userObj.value?.collection || {},
    );
  },
  { mode: "navigation" },
);

const setSelectedType = (type: CardType | "ALL") => {
  selectedType.value = type;
};

const isCardOpen = (cardId: string) => {
  if (openCardIds.value[cardId] !== undefined) {
    return openCardIds.value[cardId];
  }
  return !!searchText.value;
};

const toggleCardOpen = (cardId: string) => {
  openCardIds.value[cardId] = !isCardOpen(cardId);
};

const getCollectedCountForGroup = (group: CardGroup) => {
  return group.cards.filter((card) =>
    userStore.doesUserHaveCardInCollection(card.cardId, card.rarity),
  ).length;
};

const getRarityBgColor = (rarity: string) => {
  switch (rarity) {
    case "COMMON":
      return "bg-slate-400";
    case "UNCOMMON":
      return "bg-uncommon";
    case "RARE":
      return "bg-rare";
    case "LEGENDARY":
      return "bg-legendary";
    default:
      return "bg-gray-400";
  }
};

const filteredCards = computed(() => {
  const cards = allCards.value || [];

  return sortCardsForCollection(
    cards,
    searchText.value,
    selectedRarity.value,
    selectedTeam.value,
    onlyOwnedCards.value,
    selectedSort.value,
    selectedType.value,
  );
});

const filteredCardsByTeamAndCard = computed(() => {
  const returnObj: Record<string, CardGroup[]> = {};

  filteredCards.value.forEach((card) => {
    const teamKey = card.teamName?.toLowerCase() || "";
    if (!returnObj[teamKey]) {
      returnObj[teamKey] = [];
    }

    let cardGroup = returnObj[teamKey].find((g) => g.cardId === card.cardId);
    if (!cardGroup) {
      const displayName =
        card.type === CardType.CONSTRUCTOR ? "Constructor Card" : card.cardName;

      cardGroup = {
        cardId: card.cardId,
        cardName: card.cardName,
        type: card.type,
        teamId: card.teamId,
        teamName: card.teamName,
        displayName,
        cards: [],
      };
      returnObj[teamKey].push(cardGroup);
    }

    cardGroup.cards.push(card);
  });

  return returnObj;
});

const confirmAddToCollection = async (cardId: string, rarity: iCardRarity) => {
  isLoading.value = true;
  let rewardedCards: iLoot[] = [];

  try {
    await addCardToCollection(cardId, rarity, totalCards.value);

    // if we've completed a reward level give the user the reward
    if (userObj.value?.progressInRewardTrack === 0) {
      const rewardObject = rewardObj[userObj.value.rewardLevel];
      if (rewardObject) {
        rewardedCards = (await giveUserReward(rewardObject)) || [];
      }

      rewardsModal.open({
        rewardObj: rewardObject,
        rewardCards: rewardedCards,
      });
    }
  } finally {
    isLoading.value = false;
  }
};

const handleAddToCollection = (cardId: string, cardRarity: iCardRarity) => {
  const userCardObj = userStore.getXCardFromUserObj(cardId, cardRarity);
  if (!userCardObj) return;

  addToCollectionModal.open({
    card: userCardObj,
    rarity: cardRarity,
    confirm: confirmAddToCollection,
  });
};

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const resetFilters = () => {
  searchText.value = "";
  selectedRarity.value = "ALL";
  selectedTeam.value = "ALL";
  selectedSort.value = "default";
  onlyOwnedCards.value = false;
  selectedType.value = "ALL";
};
</script>

<style lang="scss" scoped>
.card-size {
  span {
    display: inline-block;
    width: 9px;
    height: 16px;
    border-radius: 3px;
    border: 2px solid white;
  }
}

.collection-track {
  top: 50%;
  transform: translateY(-50%);

  // background-color: #e0e0e0;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
}

.collection-track-inner {
  background: linear-gradient(
    90deg,
    rgb(79, 172, 254) 0%,
    rgb(0, 242, 254) 100%
  );
}

.collection-track-car {
  background: radial-gradient(
    circle,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0) 75%
  );
  top: 50%;
  transform: translate(-50%, -50%);
}

/* 1. THE MOVE ANIMATION (for sorting) */
.cards-move,
.cards-enter-active,
.cards-leave-active {
  transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. THE ENTER/LEAVE ANIMATIONS (for filtering) */
.cards-enter-from,
.cards-leave-to {
  opacity: 0;
  transform: scale(0.6) translateY(20px);
}

/* 3. ENSURE LEAVING ITEMS ARE TAKEN OUT OF FLOW (so others can slide) */
.cards-leave-active {
  position: absolute;
}
</style>
