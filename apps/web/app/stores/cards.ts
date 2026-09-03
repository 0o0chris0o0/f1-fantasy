import { defineStore } from "pinia";
import { collection, query, getDocs } from "firebase/firestore";

// Types
import type { iDriverCard, iConstructorCard } from "@f1pick6/shared";

export const useCardsStore = defineStore("cards", () => {
  const allCards = ref<(iDriverCard | iConstructorCard)[]>([]);

  const db = useFirestore();

  const getAllCards = async () => {
    if (!allCards.value.length) {
      const q = query(collection(db, "cards"));
      const querySnapshot = await getDocs(q);
      allCards.value = querySnapshot.docs.map(
        (doc) => doc.data() as iDriverCard | iConstructorCard,
      );
    }
  };

  return { allCards, getAllCards };
});
