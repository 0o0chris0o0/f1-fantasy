<template>
  <div>
    <h2 class="text-lg font-semibold mb-2 text-center font-f1">Leaderboard</h2>
    <div class="rounded overflow-hidden border border-gray-800">
      <table class="w-full border-separate border-spacing-0 bg-gray-800 leaderboard-table">
        <thead class="font-f1 font-bold text-sm">
          <tr>
            <td></td>
            <td>Player</td>
            <td>Race Pts</td>
            <td>Qual Pts</td>
            <td>Mod Pts</td>
            <td>Total Pts</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in leaderboard" :class="{
            'active-user-row': currentUser?.uid === user.playerId
          }">
            <td class="rank-icon">
              <Icon 
                :name="user.currentRank !== user.prevRank ? 'material-symbols:arrow-drop-up-rounded' : 'material-symbols:circle'" 
                :class="[
                  'mx-auto',
                  {
                    'text-gray-300 text-xs': user.currentRank === user.prevRank,
                    'text-green-500 text-2xl': user.currentRank < user.prevRank,
                    'text-red-500 rotate-180 text-2xl': user.currentRank > user.prevRank
                  }]
                "
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
import type { iLeaderboardScore } from '@f1pick6/shared';
import { collection, getDocs } from 'firebase/firestore';

const db = useFirestore();
const currentUser = useCurrentUser();

const leaderboard = useState<iLeaderboardScore[]>();

await callOnce(async () => {
  const leaderboardRef = collection(db, "leaderboard")
  const leaderboardDocs = await getDocs(leaderboardRef);

  const unsortedLeaderboard = leaderboardDocs.docs.map((doc) => doc.data() as iLeaderboardScore);

  leaderboard.value = unsortedLeaderboard.sort((a, b) => a.currentScore > b.currentScore ? -1 : 1);
});
</script>

<style lang="scss" scoped>
.leaderboard-table {
  tr:nth-child(even) {
    @apply bg-gray-900;
  }

  td {
    @apply border p-1;
  }

  .active-user-row {
    td:not(.rank-icon) {
      @apply text-blue-300 font-semibold;
    }
  }
}
</style>
