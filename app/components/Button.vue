<template>
  <button
    :type="type || 'button'"
    :class="[
      'rounded-xl border-2 font-f1',
      version,
      classes,
      size || 'medium',
      textColorClass || 'text-white',
    ]"
  >
    <slot/>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  type?: "button" | "submit";
  size?: "x-small" | "small" | "medium"; 
  version?: string;
  classes?: string;
  textColorClass?: string;
}>();
</script>

<style lang="scss" scoped>
button:disabled {
  @apply opacity-25;
}

.green {
  @apply border border-green-700 bg-green-600;
}

.orange {
  @apply border border-orange-700 bg-orange-600;
}

.red {
  @apply border border-red-700 bg-red-600;
}

.medium {
  @apply py-3 px-6;
}

.small {
  @apply py-2 px-5 text-sm;
}

.x-small {
  @apply py-1 px-3 text-xs;
}
</style>
