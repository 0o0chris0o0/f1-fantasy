<template>
  <div>
    <PageHeader class="mb-6">My Cards</PageHeader>

    <div
      class="flex items-end justify-between mb-4 border-b border-gray-700 pb-4 px-4"
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
      <SimpleButton
        version="primary"
        aria-label="Open filters"
        @click="toggleFilters"
      >
        <Icon name="bi:sort-down" class="text-lg" />
      </SimpleButton>
    </div>

    <FiltersDrawer
      v-model:showFilters="showFilters"
      v-model:searchText="searchText"
      v-model:selectedRarity="selectedRarity"
      v-model:selectedTeam="selectedTeam"
      v-model:sortBy="sortBy"
      :teams="teams"
      @reset="resetFilters"
    />

    <div class="px-4">
      <p v-if="!userObj?.cards?.length" class="italic opacity-50">
        No cards...
      </p>
      <div class="mb-4 text-sm">
        Showing {{ filteredCards.length }} / {{ userObj?.cards?.length || 0 }}
      </div>
      <TransitionGroup
        name="cards"
        tag="div"
        class="grid grid-cols-2 gap-x-2 gap-y-3 mb-6"
      >
        <button
          v-for="card in filteredCards"
          :key="`${card.cardData.cardId}-${card.rarity}`"
        >
          <UserCard
            :card="card.cardData"
            :rarity="card.rarity"
            :level="card.level"
            :quantity="card.quantity"
            :inTeam="
              userStore.isXCardInUsersCurrentTeam(
                card.cardData.cardId,
                card.rarity,
              )
            "
            :in-collection="card.inCollection"
          />
        </button>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
// Components
import { storeToRefs } from "pinia";
import FiltersDrawer from "~/components/FiltersDrawer.vue";
import { ref, computed } from "vue";
import { CardType } from "@f1pick6/shared/types";
import { sortCardsForMyCards } from "~/utils/filteringSorting";

const userStore = useUserStore();

const { userObj } = storeToRefs(userStore);

// filter / sort state
const searchText = ref("");
const selectedRarity = ref("ALL");
const selectedTeam = ref("ALL");
const sortBy = ref("rarity:desc,points:desc,name");
const selectedType = ref<CardType | "ALL">("ALL");
const showFilters = ref(false);

definePageMeta({
  middleware: "auth",
});

const teams = computed(() => {
  const t = new Set<string>();
  (userObj.value?.cards || []).forEach((c: any) => {
    if (c?.cardData?.teamName) t.add(c.cardData.teamName);
  });
  return Array.from(t).sort();
});

const filteredCards = computed(() => {
  const cards = userObj.value?.cards || [];

  return sortCardsForMyCards(
    cards,
    searchText.value,
    selectedRarity.value,
    selectedTeam.value,
    sortBy.value,
    undefined,
    selectedType.value,
  );
});

const setSelectedType = (type: CardType | "ALL") => {
  selectedType.value = type;
};

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const resetFilters = () => {
  searchText.value = "";
  selectedRarity.value = "ALL";
  selectedTeam.value = "ALL";
  sortBy.value = "name";
  selectedType.value = "ALL";
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
