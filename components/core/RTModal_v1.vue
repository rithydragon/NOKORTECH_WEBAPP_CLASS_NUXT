<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div 
      class="rty-modal rounded-lg overflow-hidden shadow-lg bg-white flex flex-col"
      :style="{ width: modalWidth, height: modalHeight }"
    >
      <!-- Modal Header -->
      <div class="p-3 flex justify-between items-center border-b px-6">
        <h3 class="text-lg font-semibold">{{ modalTitle }}</h3>
        <div 
          @click="closeModal" 
          class="hover:bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
        >
          <i class="ri-close-circle-line text-gray-500 hover:text-gray-900"></i>
        </div>
      </div>

      <!-- Modal Body (Scrollable Y-axis) -->
      <div class="p-6 overflow-y-auto flex-1">
        <slot></slot>
      </div>

      <!-- Modal Footer -->
      <!-- <div class="p-4 flex justify-end border-t">
        <button @click="closeModal" class="bg-gray-500 text-white px-4 py-2 mr-2 rounded">Cancel</button>
        <button @click="onSubmit" :disabled="disabled" class="bg-blue-500 text-white px-4 py-2 rounded">
          {{ actionLabel }}
        </button>
      </div> -->
       <!-- Modal Footer (Hide or Show) -->
       <!-- <div v-if="!hideFooter" class="p-4 flex justify-end border-t">
        <slot name="footer">
          <button @click="closeModal" class="bg-gray-500 text-white px-4 py-2 mr-2 rounded">Cancel</button>
          <button @click="onSubmit" :disabled="disabled" class="bg-blue-500 text-white px-4 py-2 rounded">
            {{ actionLabel }}
          </button>
        </slot>
      </div> -->
      <div v-if="!hideFooter" class="p-4 flex justify-end border-t">
        <slot name="footer">
          <button 
            v-for="(btn, index) in actionButtons" 
            :key="index" 
            @click="emit(btn.event)" 
            :class="btn.class"
            :disabled="btn.disabled"
            class="px-4 py-2 rounded mx-1"
          >
            {{ btn.label }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  modalTitle: { type: String, default: 'Modal Title' },
  actionLabel: { type: String, default: 'Submit' },
  disabled: { type: Boolean, default: false },
  actionButtons: { 
    type: Array, 
    default: () => [
      { label: "Cancel", event: "close", class: "bg-gray-500 text-white", disabled: false },
      { label: "Submit", event: "submit", class: "bg-blue-500 text-white", disabled: false }
    ] 
  },
  width: { type: String, default: '90vw' },  // Default width 90% of viewport
  height: { type: String, default: '90vh' },  // Default height 90% of viewport
  hideFooter: { type: Boolean, default: false } // Option to hide action buttons
})


const emits = defineEmits(['close', 'submit', 'customEvent']) // Declare possible emitted events

const emit = (event) => emits(event)

const closeModal = () => emits('close')
const onSubmit = () => emits('submit')

const modalWidth = computed(() => props.width)
const modalHeight = computed(() => props.height)
</script>

<style lang="scss">
/* Hide scrollbar but allow scrolling */
// .overflow-y-auto::-webkit-scrollbar {
//   display: none;
// }
</style>

