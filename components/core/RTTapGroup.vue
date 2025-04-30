<template>
    <div>
      <!-- Tab buttons -->
      <div class="flex space-x-4">
        <div
          v-for="tab in taps"
          :key="tab.name"
          @click="selectTab(tab.name)"
          :class="{
            'bg-blue-600 text-white': selectedTab === tab.name,
            'bg-gray-800 text-gray-300': selectedTab !== tab.name
          }"
          class="px-4 py-2 cursor-pointer rounded-full"
        >
          {{ tab.name }}
        </div>
      </div>
  
      <!-- Dynamic content based on selected tab -->
      <div class="mt-6">
        <component :is="selectedTabComponent" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  
  // Props passed from the parent component
  defineProps({
    taps: {
      type: Array,
      required: true
    }
  })
  
  // Track the selected tab
  const selectedTab = ref('All Topics')
  
  // Function to handle tab selection
  const selectTab = (tabName: string) => {
    selectedTab.value = tabName
  }
  
  // Compute the selected tab's component dynamically
  const selectedTabComponent = computed(() => {
    const tab = taps.find(t => t.name === selectedTab.value)
    return tab ? tab.component : null
  })
  </script>
  
  <style scoped>
  /* Add styles for tab navigation if needed */
  </style>
  