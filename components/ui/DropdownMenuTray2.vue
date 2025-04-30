<template>
  <div class="flex justify-center items-center">
    <div ref="dropdownRef" class="relative inline-block">
      <!-- Dropdown Trigger -->
      <slot name="trigger" :toggleMenu="toggleMenu">
        <button @click="toggleMenu" class="btn-dropdown">
          <i class="ri-more-2-line text-lg"></i> <!-- Default Trigger Icon -->
        </button>
      </slot>

      <!-- Dropdown Menu Items -->
      <div v-if="isOpen" class="menu absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-10">
        <slot name="menu-items" :handleClick="handleClick">
          <!-- Theme Toggle Options -->
          <div
            v-for="(item, index) in themeOptions"
            :key="index"
            class="menu-item px-4 py-2 cursor-pointer hover:bg-gray-100"
            :class="{'text-red-500': item.isDanger}"
            @click="handleThemeChange(item)"
          >
            {{ item.label }}
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

// Theme options
const themeOptions = [
  { label: 'System d', value: 'system' },
  { label: 'Dark Mode', value: 'dark' },
  { label: 'Light Mode', value: 'light' },
];

const currentMode = ref('system'); // Initial theme mode
const isOpen = ref(false);
const dropdownRef = ref(null);

// Check and apply the current theme based on localStorage or system preference
function applyTheme(mode) {
  if (mode === 'dark') {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
  } else if (mode === 'light') {
    document.body.classList.add('light');
    document.body.classList.remove('dark');
  } else {
    // For system preference, use the system's media query to decide
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (systemDarkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }
}

// Toggle the menu open/close
function toggleMenu() {
  isOpen.value = !isOpen.value;
}

// Handle the theme change based on selected option
function handleThemeChange(item) {
  currentMode.value = item.value;
  localStorage.setItem('theme', currentMode.value); // Persist theme to localStorage
  applyTheme(currentMode.value); // Apply the selected theme
  isOpen.value = false; // Close the menu after selection
}

// Close the dropdown if clicked outside
function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
}

// Load theme from localStorage on initial load
onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    currentMode.value = savedTheme;
  }
  applyTheme(currentMode.value);

  // Watch for system theme preference changes
  const systemThemeListener = (e) => {
    if (currentMode.value === 'system') {
      applyTheme('system');
    }
  };
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', systemThemeListener);

  document.addEventListener('click', handleClickOutside);
});

// Clean up listeners on component unmount
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
  cursor: pointer;
  padding: 0.5rem;
}

.menu-item:hover {
  background-color: #f1f1f1;
}

.text-red-500 {
  color: red;
}

.dark {
  background-color: #333;
  color: white;
}

.light {
  background-color: #fff;
  color: black;
}
</style>
