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

    <UDrawer v-model:open="editMode">
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
            <div class="flex items-center gap-2">
              <Icon
                name="bi:sort-down"
                class="text-lg text-on-surface-variant"
              />
              <select
                id="sortBy"
                v-model="selectedSort"
                @change="setSelectedSort(selectedSort)"
                class="rounded-lg border border-outline-variant bg-surface-container-high px-3 py-2 text-sm text-on-surface"
              >
                <option value="points:desc">Fantasy Points</option>
                <option value="rarity:desc">Rarity</option>
                <option value="name:asc">Name</option>
              </select>
            </div>
          </div>
          <ClientOnly>
            <TransitionGroup
              name="cards"
              tag="div"
              class="grid grid-cols-1 gap-x-2 gap-y-3 mb-6"
            >
              <div
                v-for="card in filteredCards"
                :key="`${card.cardData.cardId}-${card.rarity}`"
                class="flex"
              >
                <div class="w-20">
                  <UserCard
                    :card="card.cardData"
                    :rarity="card.rarity"
                    :level="card.level"
                    :quantity="card.quantity"
                    :in-collection="card.inCollection"
                    disableModal
                  />
                </div>
                <button
                  @click="handleSelectCard(card, $event)"
                  :disabled="isCardInTeam(card.cardData.cardId)"
                  :class="{
                    'opacity-25': isCardInTeam(card.cardData.cardId),
                  }"
                >
                  Add card
                </button>
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
const selectedSort = ref("points:desc");
const filteredCards = ref<iCardInUsersCards[]>([]);

const roundInfo = useState<iRoundInfo>();

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

const handleSelectCard = async (card: iCardInUsersCards, e: Event) => {
  e.preventDefault();
  e.stopPropagation();
  // Update the modal attributes explicitly if it's already "created"
  // openAddToTeamConfirmationModal();
};

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
    "",
    "ALL",
    "ALL",
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

const handleAddToTeam = async (card: iCardInUsersCards) => {
  if (!editing.value) return;

  // closeAddToTeamConfirmationModal();

  loading.value = true;

  await addCardToTeam(editing.value, card);

  editing.value = null;
  editMode.value = false;
  loading.value = false;
};

const isCardInTeam = (cardId: string) => {
  if (!userObj.value?.currentTeam) return false;

  const cardsInTeam = Object.values(userObj.value?.currentTeam)
    .filter((c): c is iCardInUsersCards => c !== null)
    .map((c) => c.cardData.cardId);

  return cardsInTeam.includes(cardId);
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
