<template>
  <div>
    <p>{{ packId }}</p>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: "auth",
  });

  const route = useRoute()

  const packId = route.query.packId as string;
</script>

<style lang="scss">
</style>
