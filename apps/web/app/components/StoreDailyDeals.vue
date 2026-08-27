<template>
  <div class="flex justify-between items-center">
    <h2 class="font-semibold font-headline uppercase text-primary px-4">
      Daily Deals
    </h2>

    <div class="flex justify-center gap-1">
      <button
        type="button"
        class="slider-nav"
        aria-label="Previous daily deals"
        @click="scrollDeals('prev')"
      >
        <Icon name="mdi:chevron-left" size="36" />
      </button>
      <button
        type="button"
        class="slider-nav"
        aria-label="Next daily deals"
        @click="scrollDeals('next')"
      >
        <Icon name="mdi:chevron-right" size="36" />
      </button>
    </div>
  </div>

  <div v-if="dailyDeals?.length">
    <div
      ref="sliderRef"
      class="flex gap-6 overflow-x-auto p-4 snap-x snap-mandatory scroll-smooth max-md:scrollbar-none max-md:[-webkit-overflow-scrolling:touch] max-md:[&::-webkit-scrollbar]:hidden"
    >
      <div
        v-for="deal in dailyDeals"
        :key="deal.cardData.cardId"
        class="shrink-0 grow-0 min-w-[40%] snap-center"
      >
        <UserCard
          :card="deal.cardData"
          :rarity="deal.rarity"
          :quantity="
            userStore.getXCardFromUserObj(deal.cardData.cardId, deal.rarity)
              ?.quantity
          "
          :level="userStore.getCardLevelForUser(deal.cardData.cardId)"
          :inCollection="
            userStore.doesUserHaveCardInCollection(
              deal.cardData.cardId,
              deal.rarity,
            )
          "
          :isNew="!userStore.hasUserSeenCard(deal.cardData.cardId, deal.rarity)"
          class="w-full"
          :class="{
            'opacity-25': userStore.hasUserPurchasedXCard(deal.cardData.cardId),
          }"
        />
        <div v-if="userObj" class="mt-2 text-center">
          <Button
            type="submit"
            size="sm"
            version="secondary"
            :disabled="
              deal.price > userObj.money ||
              userStore.hasUserPurchasedXCard(deal.cardData.cardId)
            "
            class="bg-green-600"
            @click="openBuyConfirmation(deal)"
          >
            <div class="flex items-center gap-1">
              <Icon name="bi:coin" />
              <span>{{ deal.price }}</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="my-4 px-10">
      <p class="text-sm text-center italic text-primary-container">
        No daily deals available today. Check back tomorrow!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { iCardRarity } from "@f1pick6/shared";
import type {
  iConstructorCard,
  iDailyDealCard,
  iDriverCard,
  WeekDay,
  WeeklySchedule,
} from "@f1pick6/shared";
import { doc, getDoc } from "firebase/firestore";
import DailyDealConfirmationModal from "./modals/DailyDealConfirmationModal.vue";

const db = useFirestore();
const userStore = useUserStore();
const overlay = useOverlay();
const dailyDealConfirmationModal = overlay.create(DailyDealConfirmationModal);

const { userObj } = storeToRefs(userStore);
const dailyDeals = useState<iDailyDealCard[]>("dailyDeals", () => []);
const sliderRef = ref<HTMLElement | null>(null);

await callOnce(
  async () => {
    const weekDay = new Date().getDay();
    // if its a weekday, get the appropiate daily deals
    if (weekDay > 0 && weekDay < 6) {
      const dailyDealRef = doc(db, "appData/dailyStores");
      const docSnap = (await getDoc(dailyDealRef)).data() as WeeklySchedule;

      const dayName = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
      }).format(new Date()) as WeekDay;
      dailyDeals.value = docSnap[dayName];
    }

    // TEMP WEEKEND FIX
    // const dailyDealRef = doc(db, "appData/dailyStores");
    // const docSnap = (await getDoc(dailyDealRef)).data() as WeeklySchedule;

    // const dayName = 'Monday'
    // dailyDeals.value = docSnap[dayName];
  },
  { mode: "navigation" },
);

const handleBuyCard = async (
  cardData: iDriverCard | iConstructorCard,
  rarity: iCardRarity,
  price: number,
) => {
  await cardPurchase(cardData, rarity, price);
};

const openBuyConfirmation = (deal: iDailyDealCard) => {
  dailyDealConfirmationModal.open({
    deal,
    confirm: async (selectedDeal: iDailyDealCard) => {
      await handleBuyCard(
        selectedDeal.cardData,
        selectedDeal.rarity,
        selectedDeal.price,
      );
    },
  });
};

const scrollDeals = (direction: "prev" | "next") => {
  if (!sliderRef.value) {
    return;
  }

  const slider = sliderRef.value;
  const cards = Array.from(slider.children) as HTMLElement[];

  if (!cards.length) {
    return;
  }

  const sliderCenter = slider.scrollLeft + slider.clientWidth / 2;
  const currentCardIndex = cards.reduce((closestIndex, card, index) => {
    const cardCenter = card.offsetLeft + card.clientWidth / 2;
    const closestCard = cards[closestIndex]!;
    const closestCenter = closestCard.offsetLeft + closestCard.clientWidth / 2;

    return Math.abs(cardCenter - sliderCenter) <
      Math.abs(closestCenter - sliderCenter)
      ? index
      : closestIndex;
  }, 0);

  const targetCardIndex = Math.max(
    0,
    Math.min(
      cards.length - 1,
      currentCardIndex + (direction === "next" ? 1 : -1),
    ),
  );
  const targetCard = cards[targetCardIndex]!;
  const targetLeft =
    targetCard.offsetLeft - (slider.clientWidth - targetCard.clientWidth) / 2;

  slider.scrollTo({
    left: targetLeft,
    behavior: "smooth",
  });
};
</script>
