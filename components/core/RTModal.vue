<template>
  <transition name="modal-fade">
    <div v-if="show" class="fixed inset-0 z-40 flex items-center justify-center p-4">
      <!-- Overlay with fade transition -->
      <div 
        class="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        :class="{'opacity-0': !show, 'opacity-100': show}"
        @click.self="closeOnOverlayClick ? closeModal() : null"
      ></div>

      <!-- Modal with springy pop-up effect -->
      <div 
        class="rty-modal rounded-lg overflow-hidden shadow-xl flex flex-col relative transform transition-all duration-300 ease-out-back"
        :class="[modalSizeClass, {'scale-95 opacity-0': !show, 'scale-100 opacity-100': show}]"
        :style="{
          maxWidth: maxWidth, 
          maxHeight: maxHeight,
          'transition-timing-function': 'cubic-bezier(0.18, 0.89, 0.32, 1.28)'
        }"
        role="dialog"
        aria-modal="true"
      >
        <!-- Modal Header -->
        <div class="p-4 flex justify-between items-center border-b sticky top-0 z-10">
          <h3 class="text-lg font-semibold">{{ modalTitle }}</h3>
          <button 
            @click="closeModal" 
            class="hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer focus:outline-none transition-colors duration-200"
            aria-label="Close modal"
          >
            <i class="ri-close-line text-gray-500 hover:text-gray-900 text-xl"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto flex-1">
          <slot></slot>
        </div>

        <!-- Modal Footer -->
        <div 
          v-if="!hideFooter" 
          class="p-4 flex justify-end border-t sticky bottom-0  z-10 space-x-3"
        >
          <slot name="footer">
            <button 
              v-for="(btn, index) in actionButtons" 
              :key="index" 
              @click="emit(btn.event)" 
              :class="[
                btn.class, 
                { 
                  'opacity-50 cursor-not-allowed': btn.disabled,
                  'hover:scale-105 active:scale-95': !btn.disabled
                }
              ]"
              :disabled="btn.disabled"
              class="px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              {{ btn.label }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, defineProps, defineEmits, onMounted, onUnmounted } from 'vue'

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
        disabled: false,
      },
      { 
        label: "Confirm", 
        event: "submit", 
        class: "bg-blue-600 text-white hover:bg-blue-700", 
        disabled: false,
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
  closeOnEsc: { type: Boolean, default: true },
  animationDuration: { type: Number, default: 300 } // ms
})

const emit = defineEmits(['close', 'submit', 'customEvent'])

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

const closeModal = () => {
  emit('close')
}

const onSubmit = () => {
  emit('submit')
}

// Handle ESC key press
const handleKeydown = (e) => {
  if (props.show && props.closeOnEsc && e.key === 'Escape') {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Custom springy animation */
.ease-out-back {
  transition-timing-function: cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

/* Smooth transitions for all animatable properties */
.rty-modal {
  transition-property: transform, opacity;
  will-change: transform, opacity;
}

/* Custom scrollbar styling */
/* .rty-modal ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.rty-modal ::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.rty-modal ::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
  transition: background 0.3s;
}

.rty-modal ::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
} */

/* Button hover effects */
button:not(:disabled) {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:not(:disabled):hover {
  transform: translateY(-1px);
}

button:not(:disabled):active {
  transform: translateY(1px);
}
</style>