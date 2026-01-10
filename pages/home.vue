<template>
  <div>
    <PageHeader class="mb-4"> Home </PageHeader>

    <div class="space-y-6">
      <!-- <NewRaceResultsBanner v-if="shouldShowLatestResult" />

      <NextRaceDetails />

      <YourTeam />

      <Leaderboard /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
// import NextRaceDetails from "@/components/NextRaceDetails.vue";

// import { showLatestResult } from "@/utils/dateFuncs";

// const { data: shouldShowLatestResult } = useAsyncData(showLatestResult)

definePageMeta({
  middleware: "auth",
});
</script>

<style lang="scss" scoped></style>
