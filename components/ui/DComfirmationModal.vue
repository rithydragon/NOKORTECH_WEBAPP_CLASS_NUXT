<!-- DeleteConfirmationModal.vue -->
<template>
    <div v-if="visible" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-auto max-w-sm p-4 text-center text-black">
        <h3 class="text-lg font-semibold mb-4">Confirm Deletion</h3>
        <p class="mb-4">Are you sure you want to delete this user?</p>
        <div class="flex justify-center space-x-4">
          <button @click="confirmDelete" class="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
          <button @click="close" class="px-2 py-1 bg-gray-300 rounded">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    visible: Boolean,
  });
  
  const emit = defineEmits(['confirm', 'close']);
  
  const confirmDelete = () => emit('confirm');
  const close = () => emit('close');
  </script>
  
  <style scoped>
  /* You can add any custom styles here */
  </style>
  