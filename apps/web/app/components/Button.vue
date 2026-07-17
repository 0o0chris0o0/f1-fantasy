<template>
  <button
    :type="type"
    :class="[
      'slant-button font-bold uppercase tracking-widest',
      versionClasses[version],
      sizeClasses[size],
      disabled ? 'opacity-25' : '',
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const {
  type = "button",
  size = "md",
  version = "primary",
  disabled = false,
} = defineProps<{
  type?: "button" | "submit";
  size?: "sm" | "md" | "lg";
  version?: "primary" | "secondary" | "tertiary" | "neutral";
  disabled?: boolean;
}>();

const sizeClasses = {
  sm: "py-2 px-8 text-xs slant-button-sm",
  md: "py-5 px-12 text-base slant-button",
  lg: "py-6 px-12 text-xl slant-button",
};

const versionClasses = {
  primary: "bg-primary-container text-on-primary-container",
  secondary: "bg-secondary-container text-on-primary-container",
  tertiary: "bg-tertiary text-white",
  neutral: "bg-neutral text-white",
};
</script>

<style lang="css" scoped>
.slant-button {
  clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
}

.slant-button-sm {
  clip-path: polygon(6% 0, 100% 0, 94% 100%, 0 100%);
}
</style>
