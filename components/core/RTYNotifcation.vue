<template>
    <Transition name="fade">
      <div 
        v-if="notification.show"
        class="fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50"
        :class="notificationClasses"
      >
        <div class="flex items-center gap-2">
          <Icon :name="notificationIcon" size="20" />
          <span>{{ notification.message }}</span>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup>
  const { notification } = useNotification()
  
  const notificationClasses = computed(() => ({
    'bg-green-500 text-white': notification.type === 'success',
    'bg-red-500 text-white': notification.type === 'error',
    'bg-yellow-500 text-white': notification.type === 'warning',
    'bg-blue-500 text-white': notification.type === 'info'
  }))
  
  const notificationIcon = computed(() => {
    return {
      success: 'ph:check-circle',
      error: 'ph:warning-circle',
      warning: 'ph:warning',
      info: 'ph:info'
    }[notification.type]
  })
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
  </style>