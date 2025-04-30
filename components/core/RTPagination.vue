<template>
    <div class="flex justify-between items-center mt-4">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-gray-300 text-white rounded"
      >
        Previous
      </button>
      
      <span class="text-lg">{{ currentPage }} / {{ totalPages }}</span>
      
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-gray-300 text-white rounded"
      >
        Next
      </button>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue'
  
  const props = defineProps({
    currentPage: {
      type: Number,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      required: true,
    },
    totalItems: {
      type: Number,
      required: true,
    },
  })
  
  const emit = defineEmits(['update:currentPage'])
  
  const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))
  
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      emit('update:currentPage', page)
    }
  }
  </script>
  
  <style scoped>
  button:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }
  </style>
  