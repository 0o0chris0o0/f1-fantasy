<template>
  <div>
    <Loader v-if="loading" />
    <PageHeader class="mb-6">My Team</PageHeader>

    <div v-if="roundInfo" class="mb-4 text-center">
      <p class="font-headline font-semibold text-2xl">
        Round {{ roundInfo.currentRound }} - {{ roundInfo.nextRaceName }}
      </p>
      <p class="font-mono">{{ raceDateV2(roundInfo.nextRaceStart) }}</p>
    </div>

    <div class="px-4">
      <div
        class="glass-panel rounded-lg p-3 mb-6 border-primary-container flex items-center gap-3 bg-primary-container/40"
      >
        <Icon name="bi:info-circle" class="text-lg text-white" />
        <p class="font-headline text-xs text-white">
          Your team is still incomplete. X/6 cards selected.
        </p>
      </div>

      <CurrentTeamCards
        @begin-editing="beginEditing"
        :editMode="editMode"
        :editing="editing"
        :currentRound="roundInfo.currentRound"
        @remove-card="handleRemoveCard"
      />
    </div>

    <UDrawer v-model:open="editMode" :ui="{ content: 'h-[80vh]' }">
      <template #content>
        <div class="h-full max-h-screen overflow-y-auto pb-6">
          <div class="flex gap-4 items-center justify-between mb-4">
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
            <div class="relative">
              <SimpleButton
                version="primary"
                aria-label="Open filters"
                @click="toggleFilters"
              >
                <Icon name="bi:sort-down" class="text-lg" />
              </SimpleButton>
            </div>
          </div>
          <FiltersDrawer
            v-model:showFilters="showFilters"
            v-model:searchText="searchText"
            v-model:selectedRarity="selectedRarity"
            v-model:selectedTeam="selectedTeam"
            v-model:sortBy="selectedSort"
            :teams="teams"
            @update:searchText="refreshFilteredCards"
            @update:selectedRarity="refreshFilteredCards"
            @update:selectedTeam="refreshFilteredCards"
            @update:sortBy="setSelectedSort"
            @reset="resetFilters"
          />
          <ClientOnly>
            <TransitionGroup
              name="cards"
              tag="div"
              class="grid grid-cols-1 gap-x-2 gap-y-3 mb-6"
            >
              <div
                v-for="card in filteredCards"
                :key="`${card.cardData.cardId}-${card.rarity}`"
              >
                <AddToTeamCard
                  :card="card"
                  :currentRound="roundInfo.currentRound"
                />
              </div>
            </TransitionGroup>
          </ClientOnly>
        </div>
      </template>
    </UDrawer>
  </div>
</template>

<script setup lang="ts">
// Components
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { doc, getDoc } from "firebase/firestore";
import FiltersDrawer from "~/components/FiltersDrawer.vue";

import { CardType } from "@f1pick6/shared/types";
import {
  filterCardsForMyTeam,
  sortCardsForMyCards,
} from "~/utils/filteringSorting";
import type {
  iRoundInfo,
  iCurrentTeam,
  iCardInUsersCards,
} from "@f1pick6/shared/types";

const db = useFirestore();
const userStore = useUserStore();

const { userObj } = storeToRefs(userStore);

// filter / sort state
const loading = ref(false);
const editMode = ref(false);
const editing = ref<keyof iCurrentTeam | null>(null);
const selectedType = ref<CardType | "ALL">("ALL");
const searchText = ref("");
const selectedRarity = ref("ALL");
const selectedTeam = ref("ALL");
const selectedSort = ref("rarity:desc,points:desc,name");
const showFilters = ref(false);
const filteredCards = ref<iCardInUsersCards[]>([]);

const roundInfo = useState<iRoundInfo>();

const teams = computed(() => {
  const teamNames = new Set<string>();

  (userObj.value?.cards || []).forEach((card) => {
    if (card.cardData.teamName) teamNames.add(card.cardData.teamName);
  });

  return Array.from(teamNames).sort();
});

definePageMeta({
  middleware: "auth",
});

await callOnce(async () => {
  // get all cards
  const roundInfoRef = doc(db, "appData", "roundInfo");
  const roundInfoSnapshot = await getDoc(roundInfoRef);

  if (roundInfoSnapshot.exists()) {
    roundInfo.value = roundInfoSnapshot.data() as iRoundInfo;
  }
});

const refreshFilteredCards = () => {
  if (!editing.value || !userObj.value?.cards) {
    filteredCards.value = [];
    return;
  }

  const cards = filterCardsForMyTeam(editing.value, userObj.value.cards).filter(
    (card) =>
      selectedType.value === "ALL"
        ? true
        : card.cardData.type === selectedType.value,
  );

  filteredCards.value = sortCardsForMyCards(
    cards,
    searchText.value,
    selectedRarity.value,
    selectedTeam.value,
    selectedSort.value,
  );
};

const beginEditing = (editingValue: keyof iCurrentTeam) => {
  if (!userObj.value?.cards) return;

  editing.value = editingValue;
  refreshFilteredCards();
  editMode.value = true;
};

const setSelectedType = (type: CardType | "ALL") => {
  selectedType.value = type;
  refreshFilteredCards();
};

const setSelectedSort = (sort: string) => {
  selectedSort.value = sort;
  refreshFilteredCards();
};

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const resetFilters = () => {
  searchText.value = "";
  selectedRarity.value = "ALL";
  selectedTeam.value = "ALL";
  selectedSort.value = "rarity:desc,points:desc,name";
  refreshFilteredCards();
};

const handleAddToTeam = async (card: iCardInUsersCards) => {
  if (!editing.value) return;

  // closeAddToTeamConfirmationModal();

  loading.value = true;

  await addCardToTeam(editing.value, card);

  editing.value = null;
  editMode.value = false;
  loading.value = false;
};

const handleRemoveCard = async (key: keyof iCurrentTeam) => {
  loading.value = true;

  await removeCardFromTeam(key);

  // begin editing the slot we just removed from
  beginEditing(key);

  loading.value = false;
};
</script>

<style lang="scss" scoped>
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
