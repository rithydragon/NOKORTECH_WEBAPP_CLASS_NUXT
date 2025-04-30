

<template>
    <transition name="fade">
      <div 
        v-if="isLoading"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      >
        <div class="flex flex-col items-center space-y-4">
          <!-- Animated spinner -->
          <div class="relative w-16 h-16">
            <div class="absolute inset-0 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
            <div class="absolute inset-2 border-4 border-t-transparent border-blue-300 rounded-full animate-spin animation-delay-150"></div>
            <div class="absolute inset-4 border-4 border-t-transparent border-blue-100 rounded-full animate-spin animation-delay-300"></div>
          </div>
          
          <!-- Loading text with fade animation -->
          <transition name="fade-slide">
            <p class="text-white font-medium text-lg">{{ message }}</p>
          </transition>
          
          <!-- Optional progress bar -->
          <div v-if="showProgress" class="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 ease-out"
              :style="{ width: progress + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup>
  const props = defineProps({
    isLoading: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'Loading...'
    },
    showProgress: {
      type: Boolean,
      default: false
    },
    progress: {
      type: Number,
      default: 0,
      validator: value => value >= 0 && value <= 100
    }
  })
  </script>
  
  <style scoped>
  /* Animation styles */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  
  .fade-slide-enter-active {
    transition: all 0.3s ease 0.15s;
  }
  .fade-slide-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  .animation-delay-150 {
    animation-delay: 0.15s;
  }
  .animation-delay-300 {
    animation-delay: 0.3s;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  </style>