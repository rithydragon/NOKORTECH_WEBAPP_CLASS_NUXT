// stores/notification.ts
export const useNotificationStore = defineStore('notification', () => {
    const notifications = ref<Array<{
      id: string
      message: string
      type: string
      timeout?: number
    }>>([])
  
    const addNotification = (message: string, type: string, timeout = 3000) => {
      const id = Date.now().toString()
      notifications.value.push({ id, message, type })
      
      if (timeout > 0) {
        setTimeout(() => {
          removeNotification(id)
        }, timeout)
      }
    }
  
    const removeNotification = (id: string) => {
      notifications.value = notifications.value.filter(n => n.id !== id)
    }
  
    return {
      notifications,
      addNotification,
      removeNotification
    }
  })