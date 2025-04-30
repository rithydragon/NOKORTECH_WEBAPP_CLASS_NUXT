<template>
    <div v-if="show" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div :class="modalSize" class="rty-modal p-6 rounded-lg bg-white shadow-lg">
        
        <!-- Modal Title -->
        <h3 class="text-lg font-semibold mb-4">
          {{ getModalTitle }}
        </h3>
  
        <!-- Modal Content -->
        <div v-if="mode === 'create' || mode === 'update'">
          <form @submit.prevent="handleSubmit">
            <slot :data="modalData"></slot> <!-- Pass modal data as slot -->
            <div class="flex justify-end gap-3 mt-4">
              <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-500 text-white rounded">{{ $t('cancel') }}</button>
              <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">
                {{ mode === 'create' ? $t('create') : $t('update') }}
              </button>
            </div>
          </form>
        </div>
  
        <!-- Delete / Confirm Message -->
        <div v-else-if="mode === 'delete' || mode === 'confirm'" class="flex flex-col items-center">
          <p class="text-center text-gray-700">
            <span v-html="message"></span>
          </p>
          <div class="flex justify-end mt-4 gap-3">
            <button @click="closeModal" class="px-4 py-2 bg-gray-500 text-white rounded">{{ $t('cancel') }}</button>
            <button @click="handleConfirm" class="px-4 py-2 bg-red-500 text-white rounded">
              {{ mode === 'delete' ? $t('delete') : $t('confirm') }}
            </button>
          </div>
        </div>
  
        <!-- View Mode -->
        <div v-else-if="mode === 'view'">
          <slot :data="modalData"></slot> <!-- Pass modal data as slot -->
          <div class="flex justify-end mt-4">
            <button @click="closeModal" class="px-4 py-2 bg-gray-500 text-white rounded">{{ $t('close') }}</button>
          </div>
        </div>
  
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    show: { type: Boolean, required: true },
    mode: { type: String, default: 'view' }, // 'create', 'update', 'delete', 'view', 'confirm'
    message: { type: String, default: '' }, // Message for delete or confirm
    data: { type: Object, default: () => ({}) }, // Dynamic data prop
  });
  
  const emits = defineEmits(['close', 'submit', 'confirm']);
  
  const closeModal = () => emits('close');
  const handleSubmit = () => emits('submit');
  const handleConfirm = () => emits('confirm');
  
  const getModalTitle = computed(() => {
    switch (props.mode) {
      case 'create': return 'Create Academic Setting';
      case 'update': return 'Update Academic Setting';
      case 'delete': return 'Delete Academic Setting';
      case 'confirm': return 'Confirm Action';
      case 'view': return 'View Details';
      default: return 'Modal';
    }
  });
  
  // Define different sizes for each mode
  const modalSize = computed(() => {
    switch (props.mode) {
      case 'create': return 'w-full max-w-lg'; // Large for forms
      case 'update': return 'w-full max-w-lg'; // Large for forms
      case 'delete': return 'w-full max-w-md'; // Medium for confirmations
      case 'confirm': return 'w-full max-w-sm'; // Small for alerts
      case 'view': return 'w-full max-w-xl'; // Extra large for details
      default: return 'w-full max-w-md';
    }
  });
  
  // Pass dynamic data for slot usage
  const modalData = computed(() => props.data);
  </script>
  