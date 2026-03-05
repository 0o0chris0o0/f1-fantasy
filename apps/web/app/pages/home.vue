<template>
  <div>
    <PageHeader class="mb-4"> Home </PageHeader>

    <div class="space-y-6">
      <NextRaceDetails />

      <YourTeam />

      <p>Leaderboard...</p>

      <p>Collection Status...</p>

      <p>News...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
</script>

<style lang="scss" scoped></style>
