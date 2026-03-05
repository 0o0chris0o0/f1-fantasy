<template>
  <label
    :class="{
      'field-error': errored,
    }"
  >
    {{ placeholder }}
    <span v-if="errored && errorMessage" class="block text-sm text-red-600 mb-1">{{ errorMessage }}</span>
    <input
      v-model="model"
      :class="['block w-full bg-transparent rounded-lg border px-2 py-4']"
      :type="type || 'text'"
      :placeholder="placeholder"
      :required="required"
    >
  </label>
</template>

<script setup lang="ts">
defineProps<{
  errored?: boolean;
  required?: boolean;
  type?: "text" | "number" | "email" | "password";
  placeholder: string;
  errorMessage?: string;
}>();

const model = defineModel();
</script>

<style lang="scss" scoped>
.field-error {
  @apply text-red-500;

  input {
    @apply border-red-500;
  }
}
</style>
