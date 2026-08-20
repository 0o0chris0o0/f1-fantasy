import { doc, getDoc } from "firebase/firestore";
import type { iRoundInfo } from "@f1pick6/shared/types";

export const useRoundInfo = async () => {
  const db = useFirestore();
  const roundInfo = useState<iRoundInfo | null>("roundInfo", () => null);

  await callOnce(async () => {
    const roundInfoSnapshot = await getDoc(doc(db, "appData", "roundInfo"));

    if (roundInfoSnapshot.exists()) {
      roundInfo.value = roundInfoSnapshot.data() as iRoundInfo;
    }
  });

  return roundInfo;
};
