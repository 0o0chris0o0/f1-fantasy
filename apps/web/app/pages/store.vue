<template>
  <div v-if="userObj">
    <PageHeader class="col-span-6 col-start-4"> Store </PageHeader>

    <StoreDailyDeals />
    <div class="h-8"></div>
    <StorePacks />
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();

const { userObj } = storeToRefs(userStore);

definePageMeta({
  middleware: "auth",
});
</script>

<style lang="scss" scoped></style>
