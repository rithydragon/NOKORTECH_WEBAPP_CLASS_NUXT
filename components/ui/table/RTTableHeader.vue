<template>
    <thead>
      <tr>
        <!-- Loop through the columns array -->
        <th
          v-for="(column, index) in columns"
          :key="index"
          @click="onColumnClick(column)"
          :class="{
            'cursor-pointer': column.sortable,
            'text-blue-500': column.sortable && column.sorted,
            'text-gray-500': !column.sortable
          }"
          class="px-4 py-2 text-left"
        >
          <span>{{ column.title }}</span>
          <!-- Add sorting indicator if the column is sorted -->
          <span v-if="column.sortable" :class="{'ml-2': column.sorted}">
            <span v-if="column.sorted === 'asc'">↑</span>
            <span v-if="column.sorted === 'desc'">↓</span>
          </span>
        </th>
      </tr>
    </thead>
  </template>
  
  <script setup>
  import { defineProps, defineEmits, computed } from 'vue'
  
  const props = defineProps({
    columns: {
      type: Array,
      required: true
    }
  })
  
  const emit = defineEmits()
  
  // Method to handle column click
  const onColumnClick = (column) => {
    if (column.sortable) {
      const newSortOrder = column.sorted === 'asc' ? 'desc' : 'asc'
      // Emit the sort event to the parent with the column field and the new sort order
      emit('sort', { field: column.field, order: newSortOrder })
      column.sorted = newSortOrder
    }
  }
  </script>
  
  <style scoped>
  /* Add basic styling for table headers */
  th {
    transition: background-color 0.2s ease;
  }
  
  th:hover {
    background-color: #f0f0f0;
  }
  
  .cursor-pointer {
    cursor: pointer;
  }
  </style>
  