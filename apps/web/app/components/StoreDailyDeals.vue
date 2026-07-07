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
    <div ref="sliderRef" class="store-container flex gap-6 overflow-x-auto p-4">
      <div
        v-for="deal in dailyDeals"
        :key="deal.cardData.cardId"
        class="store-container__card"
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
            'opacity-50': userStore.hasUserPurchasedXCard(deal.cardData.cardId),
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
            class="bg-green-400"
            @click="handleBuyCard(deal.cardData, deal.rarity, deal.price)"
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

const db = useFirestore();
const userStore = useUserStore();

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

const scrollDeals = (direction: "prev" | "next") => {
  if (!sliderRef.value) {
    return;
  }

  const scrollAmount = sliderRef.value.clientWidth * 0.8;

  sliderRef.value.scrollBy({
    left: direction === "next" ? scrollAmount : -scrollAmount,
    behavior: "smooth",
  });
};
</script>

<style lang="scss" scoped>
.store-container {
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  &__card {
    flex: 0 0 min(40%, 16rem);
    scroll-snap-align: center;

    @media (min-width: 768px) {
      flex: 0 0 14rem;
    }
  }
}

.slider-nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid rgb(var(--color-primary));
  border-radius: 9999px;
  color: rgb(var(--color-primary));
  background: rgb(var(--color-background));
}
</style>
