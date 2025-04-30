<template>
  <div :class="{ 'dark': currentMode === 'dark' }" class="flex justify-center items-center">
    <!-- Dark/Light Mode Toggle Button -->
    <div ref="dropdownRef" class="mt-4 relative">
      <!-- <label for="theme-toggle" class="mr-2">Theme:</label> -->
      
      <!-- Custom Dropdown Button with Dynamic Icon -->
      <div @click="toggleDropdown" class="p-2 w-32 text-gray-900 bg-blue-50  border rounded cursor-pointer flex justify-between items-center">
        <span class="flex items-center">
          <i :class="currentModeIcon" class="mr-2"></i> <!-- Dynamic icon for current mode -->
          {{ currentModeText }}
        </span>
      </div>
      <!-- Dropdown Menu -->
      <ul v-if="isDropdownOpen" class="absolute text-gray-900 bg-blue-50 shadow-lg rounded border mt-1 w-full z-10">
        <!-- System Mode -->
        <li @click="selectMode('system')" class="p-2 hover:bg-purple-500 cursor-pointer flex items-center">
          <i class="ri-contrast-2-line mr-2"></i> <!-- Remix Icon for System -->
          <span>System</span>
        </li>

        <!-- Dark Mode -->
        <li @click="selectMode('dark')" class="p-2 hover:bg-gray-100 cursor-pointer flex items-center">
          <i class="ri-moon-line mr-2"></i> <!-- Remix Icon for Dark Mode -->
          <span>Dark Mode</span>
        </li>

        <!-- Light Mode -->
        <li @click="selectMode('light')" class="p-2 hover:bg-gray-100 cursor-pointer flex items-center">
          <i class="ri-sun-line mr-2"></i> <!-- Remix Icon for Light Mode -->
          <span>Light Mode</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

const isDropdownOpen = ref(false);
const currentMode = ref('system'); // Default to system theme
const dropdownRef = ref(null); // Reference to the dropdown container

// Check if we're running in the browser
const isBrowser = typeof window !== 'undefined';

// Function to get the stored theme from localStorage (if available)
function getStoredTheme() {
  if (isBrowser && localStorage.getItem('theme')) {
    return localStorage.getItem('theme');
  }
  return 'system'; // Default to 'system' if no theme is set
}

// Change theme based on the selected mode
function applyTheme() {
  if (currentMode.value === 'system') {
    detectSystemMode();
  } else {
    updateTheme(currentMode.value);
  }
}

// Detect system preference and apply it
function detectSystemMode() {
  if (isBrowser) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery.matches) {
      updateTheme('dark');
    } else {
      updateTheme('light');
    }

    // Watch for system theme changes
    mediaQuery.addEventListener('change', (e) => {
      updateTheme(e.matches ? 'dark' : 'light');
    });
  }
}

// Update the theme based on user preference
function updateTheme(mode) {
  if (isBrowser) {
    document.documentElement.classList.remove('dark', 'light');
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('light');
    }
    localStorage.setItem('theme', mode); // Save preference to localStorage
  }
}

// Set selected theme and close dropdown
function selectMode(mode) {
  currentMode.value = mode;
  applyTheme();
  isDropdownOpen.value = false; // Close the dropdown after selecting an option
}

// Toggle the visibility of the dropdown
function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

// Close dropdown if clicked outside
function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false; // Close the dropdown if clicked outside
  }
}

// Initial setup for theme based on user preference or system setting
onMounted(() => {
  if (isBrowser) {
    currentMode.value = getStoredTheme(); // Get stored theme from localStorage (if available)
    if (currentMode.value === 'system') {
      detectSystemMode();
    } else {
      updateTheme(currentMode.value);
    }

    // Add click listener to close dropdown if clicked outside
    document.addEventListener('click', handleClickOutside);
  }
});

onBeforeUnmount(() => {
  // Remove click listener when component is unmounted
  document.removeEventListener('click', handleClickOutside);
});

// Get the current display text for the dropdown based on mode
const currentModeText = computed(() => {
  switch (currentMode.value) {
    case 'dark': return 'Dark Mode';
    case 'light': return 'Light Mode';
    case 'system': return 'System';
    default: return 'System';
  }
});

// Dynamic Icon Computation
const currentModeIcon = computed(() => {
  switch (currentMode.value) {
    case 'dark': return 'ri-moon-line'; // Dark mode icon
    case 'light': return 'ri-sun-line'; // Light mode icon
    case 'system': return 'ri-contrast-2-line'; // System icon
    default: return 'ri-contrast-2-line'; // Default icon
  }
});
</script>

<style scoped>
/* Dark Mode Styles */
.dark {
  background-color: #333;
  color: white;
}

.dark .menu {
  background-color: #444;
  border-color: #555;
}

.dark .menu-item {
  color: white;
}

.dark .menu-item:hover {
  background-color: #555;
}

/* Light Mode Styles (default) */
.light {
  background-color: white;
  color: black;
}

.light .menu {
  background-color: white;
  border-color: #ddd;
}

.light .menu-item {
  color: black;
}

.light .menu-item:hover {
  background-color: #f1f1f1;
}

/* Custom Dropdown Styles */
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 0.5rem;
  transition: background-color 0.3s ease;
}

li:hover {
  background-color: #f1f1f1;
}

.cursor-pointer {
  cursor: pointer;
}

.bg-white {
  background-color: white;
}

.shadow-lg {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.mt-1 {
  margin-top: 0.25rem;
}

.z-10 {
  z-index: 10;
}

.relative {
  position: relative;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.mr-2 {
  margin-right: 0.5rem;
}
</style>
