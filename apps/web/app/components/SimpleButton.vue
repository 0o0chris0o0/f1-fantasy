<template>
  <button
    :type="type"
    :class="[
      'rounded-sm transition-colors',
      versionClasses[version],
      sizeClasses[size],
      disabled ? 'opacity-25 cursor-not-allowed' : '',
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
  version?: keyof typeof versionClasses;
  disabled?: boolean;
}>();

const sizeClasses = {
  sm: "p-2 text-sm",
  md: "p-3 text-base",
  lg: "p-4 text-lg",
};

const versionClasses = {
  primary: "bg-primary text-on-primary-container border-0",
  "primary-outline": "border-primary-container/60 text-on-primary-container",
  secondary:
    "border-secondary text-secondary hover:bg-secondary hover:text-on-secondary",
  "secondary-outline":
    "border-secondary text-secondary hover:bg-secondary hover:text-on-secondary",
  tertiary:
    "border-tertiary text-tertiary hover:bg-tertiary hover:text-on-tertiary",
  "tertiary-outline":
    "border-tertiary text-tertiary hover:bg-tertiary hover:text-on-tertiary",
  neutral: "border-neutral text-white hover:bg-neutral",
  normal: "border-common text-black hover:bg-common",
  close: "bg-primary-container text-on-primary-container border-0",
};
</script>
