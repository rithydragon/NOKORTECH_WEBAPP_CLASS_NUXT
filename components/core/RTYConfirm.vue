<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen p-4 text-center">
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-50"></div>
      </div>

      <Transition name="scale">
        <div
          class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          <!-- Icon based on confirm type -->
          <div class="flex items-center justify-center w-12 h-12 mx-auto rounded-full" :class="typeClasses.iconBg">
            <i :class="[typeIcon, typeClasses.iconText, 'text-2xl']" aria-hidden="true" />
          </div>

          <!-- Title and description -->
          <div class="mt-3 text-center">
            <h3 class="text-lg leading-6 text-gray-900  font-bold">
              {{ confirmText }}
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                {{ title }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense flex gap-3  items-center">
            <button type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
              @click="cancel">
              {{ cancelText }}
            </button>
            <button type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
              :class="typeClasses.confirmButton" @click="confirm">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const confirmStore = useConfirmStore();

const {
  isOpen,
  title,
  description,
  confirmText,
  cancelText,
  type
} = storeToRefs(confirmStore);

const { confirm, cancel } = confirmStore;

// Dynamic icon based on confirm type using RemixIcon
const typeIcon = computed(() => {
  switch (type.value) {
    case 'success': return 'ri-checkbox-circle-fill';
    case 'warning': return 'ri-error-warning-fill';
    case 'error': return 'ri-close-circle-fill';
    default: return 'ri-information-fill'; // info
  }
});

// Dynamic classes based on confirm type
const typeClasses = computed(() => {
  const base = {
    confirmButton: '',
    iconBg: '',
    iconText: ''
  };

  switch (type.value) {
    case 'success':
      return {
        ...base,
        confirmButton: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
        iconBg: 'bg-green-100',
        iconText: 'text-green-600'
      };
    case 'warning':
      return {
        ...base,
        confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
        iconBg: 'bg-yellow-100',
        iconText: 'text-yellow-600'
      };
    case 'error':
      return {
        ...base,
        confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        iconBg: 'bg-red-100',
        iconText: 'text-red-600'
      };
    default: // info
      return {
        ...base,
        confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        iconBg: 'bg-blue-100',
        iconText: 'text-blue-600'
      };
  }
});
</script>

<style>
@import 'remixicon/fonts/remixicon.css';
</style>