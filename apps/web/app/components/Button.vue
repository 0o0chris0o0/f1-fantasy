<template>
  <button
    :type="type"
    :class="[
      'slant-button font-bold uppercase tracking-widest',
      versionClasses[version],
      sizeClasses[size],
    ]"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const {
  type = "button",
  size = "md",
  version = "primary",
} = defineProps<{
  type?: "button" | "submit";
  size?: "sm" | "md" | "lg";
  version?: "primary" | "secondary" | "tertiary" | "neutral";
}>();

const sizeClasses = {
  sm: "py-4 px-8 text-xs",
  md: "py-5 px-12 text-base",
  lg: "py-6 px-12 text-xl",
};

const versionClasses = {
  primary: "bg-primary-container text-on-primary-container",
  secondary: "bg-secondary-container text-on-primary-container",
  tertiary: "bg-tertiary text-white",
  neutral: "bg-neutral text-white",
};
</script>

<style lang="css" scoped>
button {
  clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
}
</style>
