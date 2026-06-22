<template>
  <button
    :type="type || 'button'"
    :class="[
      baseClasses,
      variantClasses[version || ''] || '',
      sizeClasses[size || 'medium'],
      classes,
      textColorClass || 'text-white',
    ]"
  >
    <slot />
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

const baseClasses = "rounded-xl border-2 font-f1";

const variantClasses: Record<string, string> = {
  green: "border border-green-700 bg-green-600",
  orange: "border border-orange-700 bg-orange-600",
  red: "border border-red-700 bg-red-600",
};

const sizeClasses: Record<"x-small" | "small" | "medium", string> = {
  "x-small": "py-1 px-3 text-xs",
  small: "py-2 px-5 text-sm",
  medium: "py-3 px-6",
};
</script>
