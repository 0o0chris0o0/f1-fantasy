<template>
  <div>
    <Loader v-if="loading" />
    <PageHeader class="mb-6">My Team</PageHeader>

    <div v-if="roundInfo" class="mb-4 text-center">
      <p class="text-xl">
        Round {{ roundInfo.currentRound }} - {{ roundInfo.nextRaceName }}
      </p>
      <p>{{ raceDateV2(roundInfo.nextRaceStart) }}</p>
    </div>

    <div class="mb-10">
      <CurrentTeamCards
        :type="CardType.DRIVER"
        @begin-editing="beginEditing"
        :editMode="editMode"
        :editing="editing"
        :currentRound="roundInfo.currentRound"
        :count="teamCounts().driverCards"
        @remove-card="handleRemoveCard"
      />
      <hr class="block my-6 opacity-30 mx-auto max-w-[80%]" />
      <CurrentTeamCards
        :type="CardType.CONSTRUCTOR"
        @begin-editing="beginEditing"
        :editMode="editMode"
        :editing="editing"
        :currentRound="roundInfo.currentRound"
        :count="teamCounts().constructorCards"
        @remove-card="handleRemoveCard"
      />
    </div>

    <div v-if="editMode">
      <ClientOnly>
        <TransitionGroup
          name="cards"
          tag="div"
          class="grid grid-cols-3 gap-x-2 gap-y-3 mb-6"
        >
          <button
            v-for="card in filteredCards"
            :key="`${card.cardData.cardId}-${card.rarity}`"
            @click="handleSelectCard(card)"
            :disabled="isCardInTeam(card.cardData.cardId)"
            :class="{
              'opacity-25': isCardInTeam(card.cardData.cardId),
            }"
          >
            <UserCard
              :card="card.cardData"
              :rarity="card.rarity"
              :level="card.level"
              :quantity="card.quantity"
              :in-collection="card.inCollection"
            />
          </button>
        </TransitionGroup>
      </ClientOnly>
    </div>
    <div v-else>
      <p class="text-center italic opacity-50">Pick a slot on your team...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Components
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { doc, getDoc } from "firebase/firestore";

import AddToTeamConfirmation from "~/components/modals/AddToTeamConfirmation.vue";
import { CardType } from "@f1pick6/shared/types";
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

const handleSelectCard = async (card: iCardInUsersCards) => {
  // Update the modal attributes explicitly if it's already "created"
  // openAddToTeamConfirmationModal();
};

const beginEditing = (editingValue: keyof iCurrentTeam) => {
  editMode.value = true;
  editing.value = editingValue;

  if (!userObj.value?.cards) return;

  filteredCards.value = filterCardsForMyTeam(
    editingValue,
    userObj.value?.cards,
  );
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

const teamCounts = () => {
  if (!userObj.value?.currentTeam)
    return { constructorCards: 0, driverCards: 0 };

  const constructorCards = Object.values(userObj.value.currentTeam)
    .filter((c): c is iCardInUsersCards => c !== null)
    .filter((c) => c.cardData.type === CardType.CONSTRUCTOR);

  const driverCards = Object.values(userObj.value.currentTeam)
    .filter((c): c is iCardInUsersCards => c !== null)
    .filter((c) => c.cardData.type === CardType.DRIVER);

  return {
    constructorCards: constructorCards.length,
    driverCards: driverCards.length,
  };
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
