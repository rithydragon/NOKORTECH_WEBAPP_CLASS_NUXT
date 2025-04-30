<template>
  <transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Overlay with fade transition -->
      <transition name="fade">
        <div 
          v-if="show"
          class="absolute inset-0 bg-black bg-opacity-50"
          @click.self="closeOnOverlayClick ? closeModal() : null"
        ></div>
      </transition>

      <!-- Modal with scale transition -->
      <transition name="scale">
        <div 
          v-if="show"
          class="rty-modal rounded-lg overflow-hidden shadow-lg bg-white flex flex-col relative"
          :class="[modalSizeClass]"
          :style="{ maxWidth: maxWidth, maxHeight: maxHeight }"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="modalTitleId"
        >
          <!-- Modal Header -->
          <div class="p-4 flex justify-between items-center border-b sticky top-0 bg-white z-10">
            <h3 :id="modalTitleId" class="text-lg font-semibold">{{ modalTitle }}</h3>
            <button 
              @click="closeModal" 
              class="hover:bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close modal"
            >
              <i class="ri-close-circle-line text-gray-500 hover:text-gray-900"></i>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 overflow-y-auto flex-1">
            <slot></slot>
          </div>

          <!-- Modal Footer -->
          <div 
            v-if="!hideFooter" 
            class="p-4 flex justify-end border-t sticky bottom-0 bg-white z-10 space-x-2"
          >
            <slot name="footer">
              <button 
                v-for="(btn, index) in actionButtons" 
                :key="index" 
                @click="emit(btn.event)" 
                :class="[btn.class, { 'opacity-50 cursor-not-allowed': btn.disabled }]"
                :disabled="btn.disabled"
                class="px-4 py-2 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                :style="btn.style"
              >
                {{ btn.label }}
              </button>
            </slot>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { computed, defineProps, defineEmits, ref, onMounted } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  modalTitle: { type: String, default: 'Modal Title' },
  actionButtons: { 
    type: Array, 
    default: () => [
      { 
        label: "Cancel", 
        event: "close", 
        class: "bg-gray-100 text-gray-800 hover:bg-gray-200", 
        disabled: false 
      },
      { 
        label: "Submit", 
        event: "submit", 
        class: "bg-blue-600 text-white hover:bg-blue-700", 
        disabled: false 
      }
    ] 
  },
  size: { 
    type: String, 
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value) 
  },
  maxWidth: { type: String, default: '90vw' },
  maxHeight: { type: String, default: '90vh' },
  hideFooter: { type: Boolean, default: false },
  closeOnOverlayClick: { type: Boolean, default: true },
  closeOnEsc: { type: Boolean, default: true }
})

const emit = defineEmits(['close', 'submit', 'customEvent'])

const modalTitleId = ref(`modal-title-${Math.random().toString(36).substring(2, 9)}`)

const modalSizeClass = computed(() => {
  const sizes = {
    sm: 'w-full max-w-sm',
    md: 'w-full max-w-md',
    lg: 'w-full max-w-lg',
    xl: 'w-full max-w-xl',
    full: 'w-full max-w-full'
  }
  return sizes[props.size]
})

const closeModal = () => emit('close')
const onSubmit = () => emit('submit')

// Handle ESC key press
const handleKeydown = (e) => {
  if (props.show && props.closeOnEsc && e.key === 'Escape') {
    closeModal()
  }
}

// Add/remove event listener when component mounts/unmounts
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Fade transition for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scale transition for modal */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Custom scrollbar for modal body */
.rty-modal ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.rty-modal ::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.rty-modal ::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.rty-modal ::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>