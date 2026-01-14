<template>
  <div>
    <p>{{ packId }}</p>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: "auth",
    layout: 'required-data',
  });

  const route = useRoute()

  const packId = route.query.packId as string;
</script>

<style lang="scss">
</style>
