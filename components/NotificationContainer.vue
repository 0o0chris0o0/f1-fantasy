<template>
  <div class="mb-4 relative">
    <div class="fixed bottom-10 right-0 space-y-2 z-50 p-2">
      <div 
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        class="bg-green-500 rounded-lg p-4 text-sm notification"
      >
        <p>{{ notification.message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification';

const notificationStore = useNotificationStore();
</script>

<style scoped>
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 100%;
  }
}

.notification {
  animation: fadeIn 0.5s ease-in-out
}
</style>