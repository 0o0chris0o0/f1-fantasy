import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { iPack } from "@/types/pack";

export async function giveUserPack(packId: string) {
  const db = useFirestore();
  const userStore = useUserStore();

  const { userFromStore } = storeToRefs(userStore);
  
  if (userFromStore.value) {
    // award them with a normal pack
    const packRef = doc(db, 'packs', packId);
    const packSnap = await getDoc(packRef);

    if (packSnap.exists()) {
      const packData = packSnap.data() as iPack;

      const playerRef = doc(db, "players", userFromStore.value.userId);
      const playerData = userFromStore.value;

      const packIndex = playerData.packs.findIndex(
        (userPack) => userPack.packId === packData.packId
      );

      if (packIndex !== -1) {
        playerData.packs[packIndex].quantity += 1;
      } else {
        playerData.packs.push({
          packId: packData.packId,
          packName: packData.packName,
          quantity: 1,
        });
      }

      await updateDoc(playerRef, {
        packs: playerData.packs
      })
    } else {
      console.log(`pack ID: ${packId} doesnt exist`)
    }
  } else {
    console.log('missing user');
  }
}