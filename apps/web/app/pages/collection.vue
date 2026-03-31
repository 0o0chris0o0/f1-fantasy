<template>
  <Loader v-if="isLoading"/>
  <PageHeader class="mb-6">Collection</PageHeader>

  <div 
    v-if="userObj?.collectionCompletion !== undefined"
    class="flex items-center justify-between gap-3"
  >
    <div class="font-f1 font-bold leading-tight uppercase text-center">
      <span class="text-xs">Cards</span>
      <p>{{ userObj.cardsInCollection}}/{{ totalCards }}</p>
    </div>
    <div class="flex-1 relative">
      <div class="absolute mx-auto w-full h-3 rounded-full border-2 border-dashed overflow-hidden opacity-75 collection-track">
        <div 
          class="absolute h-full bg-green-600 collection-track-inner" 
          :style="`width: ${userObj.collectionCompletion}%;`" 
        />
      </div>
      <div 
        class="absolute collection-track-car" 
        :style="`left: ${userObj.collectionCompletion < 5 ? 5 : userObj.collectionCompletion}%;`" >
        <Icon name="cbi:f1-alt" class="rotate-90 text-5xl" />
      </div>
    </div>
    <div class="font-f1 font-bold">
      <p>{{userObj.collectionCompletion }}<span class="text-xs">%</span></p>
    </div>
  </div>
  <div v-if="userObj?.rewardLevel" class="my-4 text-center">
    <div class="inline-block relative">
      <SegmentedCircle 
        :count="userObj.rewardLevel <= 2 ? 14 : 13" 
        :activeCount="userObj.progressInRewardTrack" 
      />
      <div class="absolute w-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <RewardImage :rewardObj="rewardObj[userObj.rewardLevel]" />
      </div>
    </div>
  </div>

  <div class="flex items-end justify-between mb-4 border-b border-gray-700 pb-4">
    <div>
      <p class="text-sm mb-1">Grid size</p>
      <div class="grid grid-cols-3 gap-1">
        <button
          v-for="n in gridSizes"
          :key="n"
          :class="[
            'flex gap-0.5 px-1 py-3 border-2 border-gray-500 rounded-xl justify-center card-size', 
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
    <div class="relative">
      <Button size="small" @click="toggleFilters">
        <Icon name="mage:filter" class="text-2xl" />
      </Button>
      <div 
        v-if="areFiltersActive"
        class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full">
      </div>  
    </div>
  </div>

  <CollectionFiltersDrawer
    v-model:showFilters="showFilters"
    v-model:searchText="searchText"
    v-model:selectedRarity="selectedRarity"
    v-model:selectedTeam="selectedTeam"
    v-model:sortBy="sortBy"
    v-model:onlyOwnedCards="onlyOwnedCards"
    :teams="teams"
    @reset="resetFilters"
  />

  <ClientOnly>
    <TransitionGroup
      name="cards"
      tag="div"
      class="space-y-6" 
    >
      <div 
        v-for="(cards, team) in filteredCardsByTeam" 
        :key="team"
      >
        <div class="flex gap-2 items-center mb-1">
          <img :src="`/img/teams/${cards[0]?.teamId}.avif`" />
          <p class="font-f1 text-lg">{{ toTitleCase(team) }}</p>
        </div>
        <div 
        class="grid gap-2" 
        :class="{
          'grid-cols-2': gridSize === '2',
          'grid-cols-3': gridSize === '3',
          'grid-cols-4': gridSize === '4'
        }">
          <template v-for="card in cards" :key="`${card.cardId}-${card.rarity}`">
            <div>
              <div class="relative">
                <div v-if="!userStore.doesUserHaveCardInCollection(card.cardId, card.rarity)" class="absolute inset-0 z-10 text-3xl grid place-content-center gap-1">
                  <Icon
                    v-if="!userStore.doesUserHaveCard(card.cardId, card.rarity)" 
                    name="uis:padlock"
                  />
                  <button
                    v-else
                    @click="handleAddToCollection(card.cardId, card.rarity)"
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
                      'opacity-25': !userStore.doesUserHaveCardInCollection(card.cardId, card.rarity),
                    }"
                  />
                </div>
              </div>
              <div class="flex justify-center items-center gap-2 mt-1">
                <div 
                  v-if="userStore.doesUserHaveCard(card.cardId, card.rarity) && !userStore.doesUserHaveCardInCollection(card.cardId, card.rarity)"
                  class="flex items-center justify-center gap-1 text-xs sm:text-sm font-f1 font-bold"
                >
                  <Icon name="bi:stack" />
                  <p>x{{ userStore.getXCardFromUserObj(card.cardId, card.rarity)?.quantity }}</p>
                </div>
                <div v-if="userStore.isXCardInUsersCurrentTeam(card.cardId, card.rarity)">
                  <Icon name="game-icons:steering-wheel" class="text-green-600" />
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </TransitionGroup>

  </ClientOnly>
</template>

<script setup lang="ts">
import type {
  QueryDocumentSnapshot} from "firebase/firestore";
import { collection, getDocs } from 'firebase/firestore';
import { useModal } from "vue-final-modal";
import AddToCollectionConfirmation from "~/components/modals/AddToCollectionConfirmation.vue";
import RewardsInfo from "~/components/modals/RewardsInfo.vue";
import { iCardRarity, type iConstructorCard, type iConstructorCollectionCard, type iDriverCard, type iDriverCollectionCard } from '@f1pick6/shared';

definePageMeta({
  middleware: "auth",
});

const db = useFirestore();
const userStore = useUserStore();

const { userObj } = storeToRefs(userStore);

// filter / sort state
const searchText = ref('');
const selectedRarity = ref('ALL');
const selectedTeam = ref('ALL');
const sortBy = ref('default');
const onlyOwnedCards = ref(false);
const gridSize = ref<'2' | '3' | '4'>('4');
const gridSizes = ['4', '3', '2'] as const;
const showFilters = ref(false);

const isLoading = ref(false);
const allCards = useState<(iDriverCollectionCard | iConstructorCollectionCard)[]>('allCards', () => []);
const totalCards = useState<number>('totalCards', () => 0);
const teams = useState<string[]>('teams', () => []);

await callOnce(async () => {
  // get all cards
  const cardsRef = collection(db, "cards");
  const cardsSnapshot = await getDocs(cardsRef);
  const teamsSet = new Set<string>();

  const cardDocs = cardsSnapshot.docs.map(
    (cardDoc: QueryDocumentSnapshot) => {
      const teamName = cardDoc.get('teamName');
      if (teamName) teamsSet.add(teamName);
      return cardDoc.data() as iDriverCard | iConstructorCard
    }
  );

  // get a list of all teams
  teams.value = Array.from(teamsSet).sort();

  // get the total number of cards - multiply by 4 for each rarity
  totalCards.value = cardDocs.length * 4;

  // sort the cards for collection
  // this will also duplicate the cards for each rarity
  allCards.value = createCardsForCollection(cardDocs, userObj.value?.cards || [], userObj.value?.collection || {});
});

const changeGridSize = (newSize: '2' | '3') => {
  gridSize.value = newSize;
}

const filteredCards = computed(() => {
  const cards = allCards.value || [];

  return sortCardsForCollection(
    cards,
    searchText.value,
    selectedRarity.value,
    selectedTeam.value,
    onlyOwnedCards.value,
    sortBy.value
  )
});

const filteredCardsByTeam = computed(() => {
  const returnObj: Record<string, (iConstructorCollectionCard | iDriverCollectionCard)[]> = {};

  filteredCards.value.forEach((card) => {
    if (!returnObj[card.teamName.toLowerCase()]) {
      returnObj[card.teamName.toLowerCase()] = [card]
    } else {
      returnObj[card.teamName.toLowerCase()]?.push(card)
    }
  })

  return returnObj;
});

const confirmAddToCollection = async (cardId: string, rarity: iCardRarity) => {
  closeAddToCollectionConfirmationModal();

  isLoading.value = true;

  await addCardToCollection(cardId, rarity, totalCards.value);

  // if we've completed a reward level give the user the reward
  if (userObj.value?.progressInRewardTrack === 0) {
    const rewardObject = rewardObj[userObj.value.rewardLevel]
    if (!rewardObject) return;
    const rewardCards = await giveUserReward(rewardObject);
    
    patchRewardsInfoModal({
      attrs: {
        rewardObj: rewardObject,
        rewardCards
      },
    });

    openRewardInfoModal();
  }

  isLoading.value = false;
}

const { 
  open: openAddToCollectionConfirmationModal, 
  close: closeAddToCollectionConfirmationModal, 
  patchOptions: patchAddToCollectionConfirmationModal 
} = useModal({
  component: AddToCollectionConfirmation,
  attrs: {
    close: () => {
      closeAddToCollectionConfirmationModal();
    },
    confirm: confirmAddToCollection
  },
});

const handleAddToCollection = (cardId: string, cardRarity: iCardRarity) => {

  const userCardObj = userStore.getXCardFromUserObj(cardId, cardRarity);

  patchAddToCollectionConfirmationModal({
    attrs: {
      card: userCardObj,
      rarity: cardRarity,
    },
  });
  
  openAddToCollectionConfirmationModal();
}

const { 
  open: openRewardInfoModal, 
  close: closeRewardInfoModal, 
  patchOptions: patchRewardsInfoModal,
} = useModal({
  component: RewardsInfo,
  attrs: {
    rewardObj: rewardObj['2'],
    close: () => {
      closeRewardInfoModal();
    },
  },
});

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
}

const resetFilters = () => {
  searchText.value = '';
  selectedRarity.value = 'ALL';
  selectedTeam.value = 'ALL';
  sortBy.value = 'default';
  onlyOwnedCards.value = false;
}

const areFiltersActive = computed(() => {
  return !!searchText.value || selectedRarity.value !== 'ALL' || selectedTeam.value !== 'ALL' || sortBy.value !== 'default' || onlyOwnedCards.value
})
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
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
}

.collection-track-inner {
  background: linear-gradient(90deg, rgb(79, 172, 254) 0%, rgb(0, 242, 254) 100%);
}

.collection-track-car {
  background: radial-gradient(circle,rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 75%);
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
