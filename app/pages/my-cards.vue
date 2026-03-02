<template>
  <div>
    <PageHeader class="mb-6">My Cards</PageHeader>

    <div class="flex items-end justify-between mb-4 border-b border-gray-700 pb-4">
      <div>
        <p class="text-sm mb-1">Grid size</p>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="n in gridSizes"
            :key="n"
            :class="[
              'flex gap-0.5 px-2 py-3 border-2 border-gray-500 rounded-xl justify-center card-size', 
              { 
                'opacity-50 bg-gray-600': gridSize === n,
              }
            ]"
            @click="changeGridSize(n as '2' | '3')"
            :aria-pressed="gridSize === n"
            :disabled="gridSize === n"
            :title="`Set grid to ${n} columns`"
          >
            <span v-for="i in Number(n)" :key="i"></span>
          </button>
        </div>
      </div>
      <div>
        <Button size="small" @click="toggleFilters">Show Filters</Button>
      </div>
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

    <div>
      <p v-if="!userObj?.cards?.length" class="italic opacity-50">
        No cards...
      </p>
      <div class="mb-4 text-sm">Showing {{ filteredCards.length }} / {{ userObj?.cards?.length || 0 }}</div>
      <TransitionGroup
        name="cards"
        tag="div"
        class="grid gap-x-2 gap-y-3 mb-6"
        :class="{
          'grid-cols-2': gridSize === '2',
          'grid-cols-3': gridSize === '3'
        }"
      >
        <button 
          v-for="card in filteredCards" 
          :key="`${card.cardData.cardId}-${card.rarity}`" 
          @click="handleSelectCard(card)"
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
    </div>
  </div>
</template>

<script setup lang="ts">
// Components
import { useModal } from "vue-final-modal";
import { storeToRefs } from "pinia";
import CardInfoModal from "~/components/modals/CardInfoModal.vue";
import FiltersDrawer from "~/components/FiltersDrawer.vue";
import { type iCardInUsersCards } from "~/types/card";
import { ref, computed } from 'vue';
import { sortCardsForMyCards } from "~/utils/filteringSorting";

const userStore = useUserStore();

const { userObj } = storeToRefs(userStore);

// filter / sort state
const searchText = ref('');
const selectedRarity = ref('ALL');
const selectedTeam = ref('ALL');
const sortBy = ref('rarity:desc,name');
const gridSize = ref<'2' | '3'>('3');
const gridSizes = ['3', '2'] as const;
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

const changeGridSize = (newSize: '2' | '3') => {
  gridSize.value = newSize;
}

const filteredCards = computed(() => {
  const cards = userObj.value?.cards || [];

  return sortCardsForMyCards(cards, searchText.value, selectedRarity.value, selectedTeam.value, sortBy.value)
});

const { open: openCardInfoModal, close: closeCardInfoModal, patchOptions } = useModal({
  component: CardInfoModal,
  attrs: {
    close: () => closeCardInfoModal(),
  }
});

const handleSelectCard = async (card: iCardInUsersCards) => {
  // Update the modal attributes explicitly if it's already "created"
  patchOptions({
    attrs: {
      cardData: card.cardData,
      userData: card,
    },
  });
  
  openCardInfoModal();
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
}

const resetFilters = () => {
  searchText.value = '';
  selectedRarity.value = 'ALL';
  selectedTeam.value = 'ALL';
  sortBy.value = 'name';
}
</script>

<style lang="scss" scoped>
.card-size {
  span {
    display: inline-block;
    width: 10px;
    height: 16px;
    border-radius: 3px;
    border: 2px solid white;
  }
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
