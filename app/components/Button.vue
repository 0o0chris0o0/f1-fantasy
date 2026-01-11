<template>
  <button
    :type="type || 'button'"
    :class="[
      'rounded-xl border-2 font-f1',
      version,
      classes,
      size || 'medium',
      textColorClass || 'text-black',
    ]"
  >
    <slot/>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  type?: "button" | "submit";
  size?: "small" | "medium"; 
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
  border-color: green;
}

.orange {
  border-color : orange;
}

.red {
  border-color: rgba(184,16,16,1);
}

.medium {
  @apply py-3 px-6;
}

.small {
  @apply py-2 px-5;
}
</style>
