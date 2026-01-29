import { doc, setDoc } from "firebase/firestore";
import type { iPack, iPackInUser } from "@/types/pack";

export async function giveUserPack(pack: iPack) {
  const user = useCurrentUser();
  const db = useFirestore();
  const userStore = useUserStore();

  const { userObj, userDocRef } = storeToRefs(userStore);

  if (!user.value || !userObj.value || !userDocRef.value) return;

  const packs = userObj.value.packs as Record<string, iPackInUser>;

  let userPack = packs[pack.packId];

  if (userPack) {
    userPack.quantity += 1;
  } else {
    userPack = {
      packId: pack.packId,
      packName: pack.packName,
      quantity: 1,
    };
  }

  await setDoc(
    userDocRef.value,
    { 
      packs, 
      money: userObj.value.money - pack.cost
    }, { merge: true }
  );
}