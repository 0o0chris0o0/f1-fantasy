import { defineStore } from 'pinia';
import { collection, query, getDocs } from "firebase/firestore";

// Utils
// import { sortDriverCards, sortConstructorCards } from '~/utils/sortCards';

// Stores
import { useUserStore } from './user';

// Types
import { CardType } from '~/types/card';
import type { iDriverCard, iCardInUsersCards, iConstructorCard } from '~/types/card';

export const useCardsStore = defineStore('cards', () => {
  const allCards = ref<(iDriverCard | iConstructorCard)[]>([]);

  const db = useFirestore();
  const userStore = useUserStore();

  const getAllCards = async () => {
    if (!allCards.value.length) {
      const q = query(collection(db, "cards"));
      const querySnapshot = await getDocs(q);
      allCards.value = querySnapshot.docs.map((doc) => doc.data() as iDriverCard | iConstructorCard)
    }
  }

//   const driverCards = computed(() => {
//     const cards = allCards.value.filter(card => card.type === CardType.DRIVER)
    
//     return sortDriverCards(cards)
//   })

//   const carCards = computed(() => {
//     const cards = allCards.value.filter(card => card.type === CardType.CAR)

//     return sortConstructorCards(cards);
//   })

//   const tpCards = computed(() => {
//     const cards = allCards.value.filter(card => card.type === CardType.TEAMPRINCIPLE)
//     return sortConstructorCards(cards);
//   })

//   const userDriverCards = computed(() => {
//     if (userStore.userFromStore?.cards) {
//       const cards = filterCards(userStore.userFromStore.cards, driverCards.value);
      
//       return sortDriverCards(cards) as iCardWithQuantity[];
//     }
//   })

//   const userCarCards = computed(() => {
//     if (userStore.userFromStore?.cards) {
//       const cards = filterCards(userStore.userFromStore.cards, carCards.value)
      
//       return sortConstructorCards(cards) as iCardWithQuantity[];
//     }
//   })

//   const userTpCards = computed(() => {
//     if (userStore.userFromStore?.cards) {
//       const cards = filterCards(userStore.userFromStore.cards, tpCards.value)
      
//       return sortConstructorCards(cards) as iCardWithQuantity[];
//     }
//   })

//   const getXCard = (cardId: string) => {
//     return allCards.value.find((card) => card.cardId === cardId)
//   }
// })

// function filterCards(userCards: iCardInUsersCards[], typedCards: iCard[]) {
//   const returnObj: iCardWithQuantity[] = [];

//   userCards.forEach((userCard) => {
//     const fullCard = typedCards.find(
//       (card) => card.cardId === userCard.cardId
//     );
//     if (fullCard) {
//       returnObj.push({
//         ...fullCard,
//         quantity: userCard.quantity,
//         tyres: userCard.tyres,
//       });
//     }
//   });

//   return returnObj;
// }

  return { allCards, getAllCards }

});

