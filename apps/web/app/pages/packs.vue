<template>
  <div v-if="userObj">
    <PageHeader class="mb-6"> Packs </PageHeader>

    <div class="flex flex-col gap-10">
      <template v-for="pack in userObj.packs">
        <UserPack  v-if="pack.quantity" :key="pack.packId" :pack="pack"/>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();

const { userObj } = storeToRefs(userStore);

definePageMeta({
  middleware: "auth",
});
</script>

<style lang="scss" scoped>

</style>
