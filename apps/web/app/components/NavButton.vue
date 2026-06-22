<template>
  <div class="relative">
    <button
      class="w-8 h-8 flex flex-col gap-1.5 items-center justify-center"
      :class="{ active: props.navOpen }"
      @click="$emit('toggle-menu')"
    >
      <span
        v-for="i in 3"
        :key="i"
        class="rounded-lg w-[80%] h-0.5 bg-primary"
      ></span>
    </button>
    <div
      v-if="!props.navOpen && userHasNotifications"
      class="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"
    ></div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(["navOpen"]);

const userStore = useUserStore();

const userHasNotifications = computed(() => {
  if (userStore.userPacksCount) return true;

  return false;
});
</script>

<style lang="scss" scoped></style>
