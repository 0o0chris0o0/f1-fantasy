<template>
  <div v-if="dailyDeals?.length" class="grid grid-cols-6 gap-6">
    <div 
      v-for="deal in dailyDeals"
      :class="{
        'col-span-3': deal.rarity === iCardRarity.LEGENDARY || deal.rarity === iCardRarity.RARE,
        'col-span-2': deal.rarity !== iCardRarity.LEGENDARY && deal.rarity !== iCardRarity.RARE
      }"
    >
      <UserCard 
        :card="deal.cardData" 
        :rarity="deal.rarity"
        :quantity="userStore.getXCardFromUserObj(deal.cardData.cardId, deal.rarity)?.quantity"
        :inCollection="userStore.doesUserHaveCardInCollection(deal.cardData.cardId, deal.rarity)"
        class="w-full"
        :class="{
          'opacity-50': userStore.hasUserPurchasedXCard(deal.cardData.cardId)
        }"
      />
      <div v-if="userObj" class="mt-2">
        <Button 
          textColorClass="text-yellow-500" 
          classes="mx-auto flex items-center gap-2 font-bold border-yellow-500" 
          size="small"
          :disabled="deal.price > userObj.money || userStore.hasUserPurchasedXCard(deal.cardData.cardId)"
          @click="handleBuyCard(deal.cardData, deal.rarity, deal.price)"
        >
          <Icon name="bi:coin" />
          <span>{{ deal.price }}</span>
        </Button>
      </div>
    </div>
  </div>
  <div v-else>
    <p class="text-center text-lg text-orange-500">No daily deals available today. Check back tomorrow!</p>
  </div>
</template>

<script setup lang="ts">
import { iCardRarity } from "@f1pick6/shared";
import type { iConstructorCard, iDailyDealCard, iDriverCard, WeekDay, WeeklySchedule } from "@f1pick6/shared";
import {
  doc,
  getDoc,
} from "firebase/firestore";

const db = useFirestore();
const userStore = useUserStore();

const { userObj } = storeToRefs(userStore);
const dailyDeals = useState<iDailyDealCard[]>('dailyDeals', () => []);

await callOnce(async () => {
  const weekDay = new Date().getDay();
  // if its a weekday, get the appropiate daily deals
  if (weekDay > 0 && weekDay < 6) {
    const dailyDealRef = doc(db, "appData/dailyStores");
    const docSnap = (await getDoc(dailyDealRef)).data() as WeeklySchedule;

    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()) as WeekDay;
    dailyDeals.value = docSnap[dayName];
  } else {
    // TODO: handle weekend message
  }


  // const dailyDealRef = doc(db, "appData/dailyStores");
  // const docSnap = (await getDoc(dailyDealRef)).data() as WeeklySchedule;

  // const dayName = 'Monday'
  // dailyDeals.value = docSnap[dayName];
  
});

const handleBuyCard = async (cardData: iDriverCard | iConstructorCard, rarity: iCardRarity, price: number) => {
  await cardPurchase(cardData, rarity, price);
}
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
    flex: 0 0 40%;
    scroll-snap-align: center;

    @media (min-width: 768px) {
      flex: 0 0 25%;
    }
  }
}
</style>
