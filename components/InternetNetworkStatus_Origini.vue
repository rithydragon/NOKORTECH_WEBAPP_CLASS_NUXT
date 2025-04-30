<template>
      <!-- Transition block for online/offline status messages -->
      <transition name="fade" mode="out-in">
        <!-- Display when offline -->
        <div v-if="!isOnline" key="offline" class="fixed top-0 left-0 w-full bg-red-600/80 text-white text-center p-2">
          <i class="ri-wifi-off-fill"></i> <span>{{ t('waiting_internet_connection') }}</span>
        </div>
        <!-- Display when online and internet is restored -->
        <div v-else-if="showRestoredMessage" key="restored" class="fixed top-0 left-0 w-full bg-green-600 text-white text-center p-2">
          <i class="ri-wifi-fill"></i> <span>{{ t('restore_internet_connection') }}</span>
        </div>
              <!-- Placeholder div to prevent layout shift -->
      <div v-else="isOnline && !showRestoredMessage" class="h-8"></div>
      </transition>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  const { t } = useI18n();
  
  // We will check for the online status on the client only
  const isOnline = ref<boolean>(true)
  const showRestoredMessage = ref<boolean>(false)
  
  onMounted(() => {
    // Ensure that navigator.onLine is only accessed on the client
    if (process.client) {
      isOnline.value = navigator.onLine
  
      // Listen for online/offline events
      window.addEventListener('online', () => {
        isOnline.value = true
        showRestoredMessage.value = true
        // Hide the restored message after 3 seconds
        setTimeout(() => {
          showRestoredMessage.value = false
        }, 3000)
      })
  
      window.addEventListener('offline', () => {
        isOnline.value = false
      })
    }
  })
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1.5s;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 70;
  }
  </style>
 