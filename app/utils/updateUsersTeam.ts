import { setDoc } from "firebase/firestore";
import type { iCardInUsersCards } from "~/types/card";
import type { iCurrentTeam } from "~/types/user";

export async function addCardToTeam(teamKey: keyof iCurrentTeam, card: iCardInUsersCards) {
  const userStore = useUserStore();

  const { userObj, userDocRef } = storeToRefs(userStore);

  if (!userObj.value || !userDocRef.value) return;

  const usersCurrentTeam = userObj.value.currentTeam

  usersCurrentTeam[teamKey] = card;

  await setDoc(
    userDocRef.value,
    { 
      currentTeam: usersCurrentTeam
    }, { merge: true }
  );
}

export async function removeCardFromTeam(teamKey: keyof iCurrentTeam) {
  const userStore = useUserStore();

  const { userObj, userDocRef } = storeToRefs(userStore);

  if (!userObj.value || !userDocRef.value) return;

  const usersCurrentTeam = userObj.value.currentTeam

  usersCurrentTeam[teamKey] = null;

  await setDoc(
    userDocRef.value,
    { 
      currentTeam: usersCurrentTeam
    }, { merge: true }
  );
}