<template>
  <Loader v-if="isLoading"/>
  <PageHeader>Collection</PageHeader>
  <div 
    v-if="userObj?.collectionCompletion !== undefined"
    class="flex items-center justify-between gap-3 mt-6"
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
      <img 
        :src="`/img/pack-normal.png`"
        class="absolute w-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        @error="loadFallbackPackImage($event)"
      >
    </div>
  </div>
  <div class="grid grid-cols-4 gap-2">
    <template v-for="card in allCards">
      <template v-for="rarity in [iCardRarity.COMMON, iCardRarity.UNCOMMON, iCardRarity.RARE, iCardRarity.LEGENDARY]">
        <div>
          <div class="relative">
            <div class="absolute inset-0 z-10 text-3xl grid place-content-center gap-2">
              <Icon 
                v-if="!userStore.doesUserHaveCardInCollection(card.cardId, rarity)" 
                name="uis:padlock"
              />
              <button
                v-if="userStore.doesUserHaveCard(card.cardId, rarity) && !userStore.doesUserHaveCardInCollection(card.cardId, rarity)" 
                @click="handleAddToCollection(card.cardId, rarity)"
              >
                <Icon 
                  name="material-symbols:add-circle"
                  color="#008236"
                />
              </button>
            </div>
            <Card 
              :card="card" 
              :rarity="rarity" 
              :class="{ 
                'opacity-25': !userStore.doesUserHaveCardInCollection(card.cardId, rarity),
              }"
            />
          </div>
          <div 
            v-if="userStore.doesUserHaveCard(card.cardId, rarity) && !userStore.doesUserHaveCardInCollection(card.cardId, rarity)"
            class="flex items-center justify-center gap-1 text-xs sm:text-sm pt-1 font-f1 font-bold"
          >
            <Icon name="bi:stack" />
            <p>x{{ userStore.getXCardFromUserObj(card.cardId, rarity)?.quantity }}</p>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import type {
  QueryDocumentSnapshot} from "firebase/firestore";
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { storeToRefs } from "pinia";
import { useModal } from "vue-final-modal";
import { useFirestore } from "vuefire";
import AddToCollectionConfirmation from "~/components/modals/AddToCollectionConfirmation.vue";
import RewardsInfo from "~/components/modals/RewardsInfo.vue";
import { CardType, iCardRarity, type iConstructorCard, type iDriverCard } from '~/types/card';
import { sortCardsForCollection } from "~/utils/filteringSorting";

definePageMeta({
  middleware: "auth",
});

const db = useFirestore();
const userStore = useUserStore();

const { userObj } = storeToRefs(userStore);

const isLoading = ref(false);
const allCards = useState<(iDriverCard | iConstructorCard)[]>('allCards', () => []);
const totalCards = useState<number>('totalCards', () => 0);

await callOnce(async () => {
  // get all cards
  const cardsRef = collection(db, "cards");
  const cardsSnapshot = await getDocs(cardsRef);

  const cardDocs = cardsSnapshot.docs.map(
    (cardDoc: QueryDocumentSnapshot) => cardDoc.data() as iDriverCard | iConstructorCard
  );

  const miscRef = doc(db, 'appData', 'misc');
  const miscSnap = await getDoc(miscRef);

  // multiply by 4 for each rarity
  totalCards.value = miscSnap.get('totalCards') * 4;
  allCards.value = sortCardsForCollection(cardDocs);
});

onMounted(() => {
  let imgUrls: string[] = [];

  ['common', 'uncommon', 'rare', 'legendary'].forEach((rarity) => {
    imgUrls.push(...allCards.value.map((c) => `/img/${c.type === CardType.CONSTRUCTOR ? 'constructors' : 'drivers'}/${c.cardId}-${rarity}.png`))
  });
  
  const { startPreloading } = useImagePreloader(imgUrls);
  // Start preloading after the main page is interactive
  requestIdleCallback(() => startPreloading(2));
})

const confirmAddToCollection = async (cardId: string, rarity: iCardRarity) => {
  closeAddToCollectionConfirmationModal();

  isLoading.value = true;

  await addCardToCollection(cardId, rarity, totalCards.value);

  // if we've completed a reward level give the user the reward
  if (userObj.value?.progressInRewardTrack === 0) {
    const rewardObject = rewardObj[userObj.value.rewardLevel]
    if (!rewardObject) return;
    await giveUserReward(rewardObject);
    
    patchRewardsInfoModal({
      attrs: {
        rewardObj: rewardObject,
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
    close: () => {
      closeRewardInfoModal();
    },
  },
});
</script>

<style lang="scss" scoped>
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
</style>
