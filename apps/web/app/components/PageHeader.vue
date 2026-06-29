<template>
  <div class="mt-2 mb-4 flex items-center justify-center gap-4">
    <div class="h-px w-8 bg-outline-variant/50"></div>
    <h2
      class="uppercase font-bold font-headline text-2xl text-on-surface tracking-wide"
    >
      <slot />
    </h2>
    <div class="h-px w-8 bg-outline-variant/50"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
