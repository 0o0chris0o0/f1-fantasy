<template>
  <div v-if="leaderboard.length">
    <h2 class="text-lg font-semibold mb-2 text-center font-f1">Leaderboard</h2>
    <div class="rounded overflow-hidden border border-gray-800">
      <table
        class="w-full border-separate border-spacing-0 bg-gray-800 [&_td]:border [&_td]:p-1 [&_tbody_tr:nth-child(even)]:bg-gray-900"
      >
        <thead class="font-headline font-bold text-sm">
          <tr>
            <td></td>
            <td>Player</td>
            <td>Race</td>
            <td>Qual</td>
            <td>Bonus</td>
            <td>Total Pts</td>
          </tr>
        </thead>
        <tbody class="font-mono">
          <tr
            v-for="user in leaderboard"
            :class="{
              '[&>td:not(.rank-icon)]:text-blue-300 [&>td:not(.rank-icon)]:font-semibold':
                currentUser?.uid === user.playerId,
            }"
          >
            <td class="rank-icon">
              <Icon
                :name="
                  user.currentRank !== user.prevRank
                    ? 'material-symbols:arrow-drop-up-rounded'
                    : 'material-symbols:circle'
                "
                :class="[
                  'mx-auto',
                  {
                    'text-gray-300 text-xs': user.currentRank === user.prevRank,
                    'text-green-600 text-2xl': user.currentRank < user.prevRank,
                    'text-red-500 rotate-180 text-2xl':
                      user.currentRank > user.prevRank,
                  },
                ]"
              />
            </td>
            <td>{{ user.playerName }}</td>
            <td>{{ user.raceScore }}</td>
            <td>{{ user.qualifyingScore }}</td>
            <td>{{ user.modifierScore }}</td>
            <td>{{ user.currentScore }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { iLeaderboardScore } from "@f1pick6/shared";
import { collection, getDocs } from "firebase/firestore";

const db = useFirestore();
const currentUser = useCurrentUser();

const leaderboard = useState<iLeaderboardScore[]>();

await callOnce(
  async () => {
    const leaderboardRef = collection(db, "leaderboard");
    const leaderboardDocs = await getDocs(leaderboardRef);

    const unsortedLeaderboard = leaderboardDocs.docs.map(
      (doc) => doc.data() as iLeaderboardScore,
    );

    leaderboard.value = unsortedLeaderboard.sort((a, b) =>
      a.currentScore > b.currentScore ? -1 : 1,
    );
  },
  { mode: "navigation" },
);
</script>
