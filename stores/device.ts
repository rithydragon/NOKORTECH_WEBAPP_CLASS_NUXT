// stores/device.ts
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export const useDeviceStore = defineStore('device', {
  state: () => ({
    deviceId: ''
  }),
  actions: {
    initDeviceId() {
      if (process.client) {
        const savedId = localStorage.getItem('device_id')
        if (savedId) {
          this.deviceId = savedId
        } else {
          const newId = uuidv4()
          localStorage.setItem('device_id', newId)
          this.deviceId = newId
        }
      }
    }
  }
})

// onMounted(() => {
//     const deviceStore = useDeviceStore()
//     deviceStore.initDeviceId()
//   })
  