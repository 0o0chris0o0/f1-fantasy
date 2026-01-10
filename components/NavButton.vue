<template>
  <button
    class="block w-10 h-10 relative"
    :class="{ active: props.navOpen }"
    @click="$emit('toggle-menu')"
  >
    <span></span>
    <span></span>
    <span></span>
  </button>
</template>

<script lang="ts" setup>
const props = defineProps(["navOpen"]);
</script>

<style lang="scss" scoped>
button span {
  @apply absolute;
  @apply left-0;
  @apply rounded;
  @apply bg-white;

  transition: all 0.3s ease-in-out;
  width: 80%;
  top: 50%;
  left: 50%;
  height: 3px;
  transform: translate(-50%, -50%);
}

button span:first-child {
  top: 25%;
}

button span:nth-child(2) {
  transition: all 0.2s ease-in-out;
}

button span:last-child {
  top: 75%;
}

button.active span {
  transition: all 0.2s ease-in-out;
}

button.active span:first-child {
  top: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
}

button.active span:nth-child(2) {
  left: 25%;
  width: 0px;
}

button.active span:last-child {
  top: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
}
</style>
