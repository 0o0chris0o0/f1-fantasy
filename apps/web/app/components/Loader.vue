<template>
  <div
    class="fixed inset-0 bg-neutral/90 z-50 flex items-center justify-center h-screen"
  >
    <div class="spinner-container">
      <div class="outer-ring"></div>
      <div class="scanning-segment"></div>
      <div class="inner-dots"></div>
      <div class="core"></div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.spinner-container {
  position: relative;
  width: 120px;
  height: 120px;
}

.outer-ring {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(255, 24, 1, 0.1);
  border-radius: 50%;
}

.scanning-segment {
  position: absolute;
  inset: -4px;
  border: 4px solid transparent;
  border-top-color: #ff1801;
  border-radius: 50%;
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  filter: drop-shadow(0 0 8px #ff1801);
}

.inner-dots {
  position: absolute;
  inset: 20px;
  border: 1px dashed rgba(255, 24, 1, 0.4);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.core {
  position: absolute;
  inset: 45px;
  background: #ff1801;
  border-radius: 50%;
  box-shadow: 0 0 20px #ff1801;
  animation: core-pulse 1.5s ease-in-out infinite;
}

.status-text {
  margin-top: 32px;
  color: #ff1801;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 12px;
  font-weight: 700;
  opacity: 0.8;
  animation: text-blink 1.5s step-end infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.6;
  }
}

@keyframes core-pulse {
  0%,
  100% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(0.8);
    filter: brightness(1.5);
  }
}

@keyframes text-blink {
  0%,
  100% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.3;
  }
}
</style>
