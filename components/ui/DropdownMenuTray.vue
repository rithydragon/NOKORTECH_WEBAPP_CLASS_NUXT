<template>
    <div class="flex justify-center items-center">
      <div ref="dropdownRef" class="relative inline-block">
      <button @click="toggleMenu" class="btn-dropdown">
        <i class="ri-more-2-line text-lg"></i> <!-- Using Remix Icon -->
      </button>
      <div v-if="isOpen" class="menu absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-10">
        <div
          v-for="(item, index) in menuItems"
          :key="index"
          class="menu-item px-4 py-2 cursor-pointer hover:bg-gray-100"
          :class="{'text-red-500': item.isDanger}"
          @click="handleClick(item)"
        >
          <i v-if="item.icon" :class="item.icon + ' mr-2'"></i> <!-- Dynamic Remix Icon -->
          {{ item.label }}
        </div>
      </div>
    </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  const menuItems = [
    { label: 'Edit name', icon: 'ri-edit-line', action: () => alert('Edit clicked') },
    { label: 'Adjust sets', icon: 'ri-barbell-line', action: () => alert('Adjust clicked') },
    { label: 'Delete exercise', icon: 'ri-delete-bin-line', isDanger: true, action: () => alert('Delete clicked') },
    { label: 'About exercise', icon: 'ri-question-line', action: () => alert('About clicked') }
  ];
  
  const isOpen = ref(false);
  const dropdownRef = ref(null);
  
  function toggleMenu() {
    isOpen.value = !isOpen.value;
  }
  
  function handleClick(item) {
    item.action(); // Execute the function passed in the item
    isOpen.value = false; // Close the menu after action
  }
  
  function handleClickOutside(event) {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
      isOpen.value = false; // Close the menu if clicked outside
    }
  }
  
  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });
  
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
  </script>
  
  <style scoped>
  .btn-dropdown {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }
  .menu {
    width: max-content;
  }
  .menu-item {
    display: flex;
    align-items: center;
  }
  </style>
  