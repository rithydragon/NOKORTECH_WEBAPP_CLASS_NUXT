<template>
    <NuxtLink 
      :to="route"  
      class="flex items-center my-2 px-1 w-auto  text-xl  rounded-full dark:hover:bg-gray-500 hover:bg-gray-200 relative"
      :class="defaultTransition, {
      'border-l-4 border-blue-500': active,  // Left border when active
      'hover:bg-gray-500': !active  // Background color on hover for inactive links
    }"
    >
      <!-- Icon Slot with Tooltip -->
      <div 
        class="px-2" 
        @mouseenter="handleMouseEnter" 
        @mouseleave="handleMouseLeave"
      >
        <slot name="icon"></slot>
        
        <!-- Tooltip (displayed when sidebar is closed) -->
        <div 
          v-if="showTooltip" 
          class="absolute left-full ml-2 px-2 py-1 rounded bg-gray-800 text-whitewhitespace-nowrap z-10"
        >
          {{ label }}
        </div>
      </div>
      
      <!-- Name Slot (conditionally shown) -->
      <div v-if="sidebarOpen" class="md:block xl:block text-xs" :class="textClasses">
        <slot name="name"></slot>
      </div>
    </NuxtLink>
  </template>
    
  <script setup>
  import { computed, ref } from 'vue';
  
  // Define props
  const props = defineProps({
    active: {
      type: Boolean,
      default: false
    },
    route: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true // Tooltip label for each sidebar item
    },
    defaultTransition: {
      type: String,
      default: "transition-all duration-300 ease-in-out"
    },
    sidebarOpen: {
      type: Boolean,
      default: true
    }
  });
  
  // Tooltip visibility state
  const showTooltip = ref(true);
  
  // Functions to handle tooltip visibility
  const handleMouseEnter = () => {
    if (!props.sidebarOpen) {
      showTooltip.value = true;
    }
  };
  
  const handleMouseLeave = () => {
    showTooltip.value = false;
  };
  
  // Dynamically set text class based on active state
  const textClasses = computed(() => (props.active ? 'font-semibold' : 'font-normal'));
  </script>
  
  <style scoped>
  /* Additional styling can go here */
  </style>
  