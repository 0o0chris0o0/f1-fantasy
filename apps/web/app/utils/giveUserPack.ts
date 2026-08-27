import type { iPack, iPackInUser } from "@f1pick6/shared";
import { doc, setDoc } from "firebase/firestore";

export async function giveUserPack(pack: iPack, chargeCost = true) {
  const userStore = useUserStore();

  const { userObj, userDocRef } = storeToRefs(userStore);

  if (!userObj.value || !userDocRef.value) return;

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

  packs[pack.packId] = userPack;

  await setDoc(
    userDocRef.value,
    {
      packs,
      // reward packs are free, only deduct money when the pack was actually purchased
      money: chargeCost ? userObj.value.money - pack.cost : userObj.value.money,
    },
    { merge: true },
  );
}
