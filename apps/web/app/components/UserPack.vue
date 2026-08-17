<template>
  <div class="glass-panel p-1 rounded-xl relative group overflow-hidden">
    <!-- Rarity Border Effect -->
    <div
      class="absolute inset-0 bg-linear-to-br via-transparent opacity-50 z-0 shimmer"
      :class="packRarityMap[pack.packId]?.border"
    ></div>
    <div
      class="bg-surface-container-low p-6 rounded-lg relative z-10 h-full flex flex-col border border-legendary/30"
    >
      <!-- Pack Image & Badge -->
      <div
        class="relative mb-6 aspect-3/4 flex justify-center items-center bg-surface-dim rounded-md overflow-hidden"
      >
        <div class="absolute inset-0 bg-legendary/10 blur-xl"></div>
        <img
          :src="`/img/${pack.packId}-pack.png`"
          class="p-10"
          @error="loadFallbackPackImage($event)"
        />
      </div>
      <!-- Info -->
      <div class="mb-6 grow">
        <h3
          class="font-f1 text-xl font-semibold text-on-surface uppercase italic tracking-tight mb-1"
        >
          {{ pack.packName }}
        </h3>
        <div class="flex items-center gap-2">
          <span
            class="w-2 h-2 rounded-full animate-pulse"
            :class="packRarityMap[pack.packId]?.background"
          ></span>
          <span
            class="font-mono text-lg"
            :class="packRarityMap[pack.packId]?.text"
            >{{ pack.quantity }} UNOPENED</span
          >
        </div>
      </div>
      <!-- Actions -->
      <div class="flex flex-col gap-3">
        <Button version="normal">
          <span
            class="block speed-slant-reverse font-bold text-sm z-10 relative"
            >OPEN SINGLE</span
          >
        </Button>

        <Button size="sm" version="secondary-outline">
          <span class="block speed-slant-reverse text-xs">
            OPEN ALL ({{ pack.quantity }})
          </span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { iPackInUser } from "@f1pick6/shared/types";
import { loadFallbackPackImage } from "~/utils/loadDefaultImage";

const props = defineProps<{
  pack: iPackInUser;
}>();

const packRarityMap: Record<
  string,
  { border: string; background: string; text: string }
> = {
  normal: {
    border: "from-common to-common",
    background: "bg-common",
    text: "text-common",
  },
  premium: {
    border: "from-rare to-rare",
    background: "bg-rare",
    text: "text-rare",
  },
  collector: {
    border: "from-legendary to-legendary",
    background: "bg-legendary",
    text: "text-legendary",
  },
};
</script>

<style scoped>
.glass-panel {
  background: rgba(52, 52, 62, 0.2);
  backdrop-filter: blur(12px);
}
.shimmer {
  overflow: hidden;
}
.shimmer::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transform: skewX(-20deg);
  animation: shimmer 5s infinite;
}
@keyframes shimmer {
  0% {
    left: -100%;
  }
  20% {
    left: 200%;
  }
  100% {
    left: 200%;
  }
}
</style>
