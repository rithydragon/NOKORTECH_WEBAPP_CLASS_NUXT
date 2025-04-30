<template>
  <!-- Toast Panel at the bottom right corner -->
  <div class="fixed bottom-4 right-4 space-y-2 z-50">
    <transition-group name="toast">
      <div v-for="toast in toasts" :key="toast.id"
        :class="['flex items-center p-4 rounded-lg shadow-lg', toast.type === 'success' ? 'bg-green-600' : 'bg-red-600']">
        <i
          :class="[toast.type === 'success' ? 'ri-wifi-fill' : 'ri-wifi-off-fill', 'text-white mr-2']"></i>
        <span class="text-white">{{ toast.message }}</span>
      </div>
    </transition-group>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Online status
const isOnline = ref<boolean>(true);

// Toast notifications
interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

const toasts = ref<Toast[]>([]);
let toastId = 0;

// Function to add a toast
const addToast = (type: 'success' | 'error', message: string) => {
  const id = toastId++;
  toasts.value.push({ id, type, message });
  // Automatically remove the toast after 3 seconds
  setTimeout(() => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }, 6000);
};

onMounted(() => {
  // Ensure that navigator.onLine is only accessed on the client
  if (process.client) {
    isOnline.value = navigator.onLine;

    // Listen for online/offline events
    window.addEventListener('online', () => {
      isOnline.value = true;
      addToast('success', t('restore_internet_connection'));
    });

    window.addEventListener('offline', () => {
      isOnline.value = false;
      addToast('error', t('waiting_internet_connection'));
    });
  }
});
</script>

<style lang="scss" scoped>
/* Toast transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>