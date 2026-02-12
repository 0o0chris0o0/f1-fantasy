<template>
  <svg :width="size" :height="size" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle 
      cx="50" 
      cy="50" 
      :r="radius" 
      fill="transparent" 
      stroke="transparent" 
      :stroke-width="strokeWidth" 
    />
    
    <circle 
      v-for="(_, index) in count" 
      :key="index"
      cx="50" 
      cy="50" 
      :r="radius" 
      fill="transparent" 
      :stroke="index + 1 <= activeCount ? activeColor : color" 
      :stroke-width="index + 1 <= activeCount ? strokeWidth : strokeWidth - 1" 
      :stroke-dasharray="dashArray" 
      :stroke-dashoffset="getOffset(index)" 
      stroke-linecap="round"
      transform="rotate(-90 50 50)"
      style="transition: all 0.3s ease;"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  count: number;         // Number of segments
  activeCount?: number;
  color?: string;        // The single color for all segments
  activeColor?: string;
  gapSize?: number;      // Size of the gap (in SVG units)
  strokeWidth?: number;
  radius?: number;
  size?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 6,
  activeCount: 0,
  activeColor: 'rgba(253, 154, 0, 1)',
  color: 'rgba(0, 242, 254, 0.3)',
  gapSize: 9,            // Default gap size
  strokeWidth: 5,
  radius: 40,
  size: 210
});

const circumference = computed(() => 2 * Math.PI * props.radius);

const dashArray = computed(() => {
  const totalSegmentSpace = circumference.value / props.count;
  const dashLength = totalSegmentSpace - props.gapSize;
  
  // Pattern: [Visible Dash] [Gap to end of segment] [Rest of circle]
  // We add the rest of the circumference as a gap to ensure 
  // only one dash appears per circle element.
  return `${dashLength.toFixed(2)} ${(circumference.value - dashLength).toFixed(2)}`;
});

const getOffset = (index: number) => {
  const totalSegmentSpace = circumference.value / props.count;
  // We shift by the total space (dash + gap) for each index
  return -(index * totalSegmentSpace);
};
</script>