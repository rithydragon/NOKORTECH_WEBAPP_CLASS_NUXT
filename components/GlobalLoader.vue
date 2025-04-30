<template>
  <div class="global-loader" :class="{ active: isLoading }">
    <div class="loader-content">
      <!-- Customize your loader content here -->
      <div class="spinner"></div>
      <div class="text">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
const isLoading = ref(false)
const message = ref('Loading...')

// Expose methods to control the loader
const start = (msg) => {
  message.value = msg || 'Loading...'
  isLoading.value = true
}

const finish = () => {
  isLoading.value = false
}

// Make methods available globally
defineExpose({ start, finish })
</script>

<style lang="scss">
.global-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;

  &.active {
    opacity: 1;
    visibility: visible;
  }

  .loader-content {
    text-align: center;

    .spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top-color: #3498db;
      animation: spin 1s ease-in-out infinite;
      margin: 0 auto 15px;
    }

    .text {
      color: #333;
      font-size: 1.2rem;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>