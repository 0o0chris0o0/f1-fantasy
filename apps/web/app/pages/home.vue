<template>
  <div>
    <PageHeader class="mb-4"> Home </PageHeader>

    <div class="space-y-10">
      <p>Latest results...</p>

      <NextRaceDetails />

      <YourTeam />

      <Leaderboard />

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
