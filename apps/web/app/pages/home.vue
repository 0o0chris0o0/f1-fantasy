<template>
  <div>
    <PageHeader class="mb-4"> Home </PageHeader>

    <div class="space-y-6">
      <LatestResult
        v-if="userObj && userObj.latestResult && !userObj.latestResultCleared"
        :latestResult="userObj.latestResult"
      />

      <NextRaceDetails />

      <YourTeam />

      <Leaderboard />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const userStore = useUserStore();

const { userObj } = storeToRefs(userStore);
</script>

<style lang="scss" scoped></style>
