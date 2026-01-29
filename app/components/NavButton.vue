<template>
  <div class="relative">
    <button
      class="block w-10 h-10"
      :class="{ active: props.navOpen }"
      @click="$emit('toggle-menu')"
    >
      <span></span>
      <span></span>
      <span></span>    
    </button>
    <div 
      v-if="!props.navOpen && userHasNotifications"
      class="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full">
    </div>  
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(["navOpen"]);

const userStore = useUserStore();

const userHasNotifications = computed(() => {

  if (userStore.userPacksCount) return true;

  return false;
});

</script>

<style lang="scss" scoped>
button span {
  position: absolute;
  left: 0;
  border-radius: 10%;
  transition: all 0.3s ease-in-out;
  width: 80%;
  top: 50%;
  left: 50%;
  height: 3px;
  transform: translate(-50%, -50%);
  background: white;
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
