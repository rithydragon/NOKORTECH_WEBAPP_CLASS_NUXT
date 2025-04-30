<template>
  <div :class="{ 'dark': currentMode === 'dark' }" class="flex justify-center items-center">

    <!-- Dark/Light Mode Toggle Button -->
    <div class="mt-4">
      <label for="theme-toggle" class="mr-2 mb-3">Theme:</label>
      <select v-model="currentMode" @change="applyTheme" id="theme-toggle" class="p-2 border rounded">
        <option value="system">System</option>
        <option value="dark">Dark Mode</option>
        <option value="light">Light Mode</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isOpen = ref(false);
const dropdownRef = ref(null);

// Dark mode logic
const currentMode = ref('system'); // Default to system theme
const isSystemMode = ref(true);

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

// Initial setup for theme based on user preference or system setting
onMounted(() => {
  if (isBrowser) {
    currentMode.value = getStoredTheme(); // Get stored theme from localStorage (if available)
    if (currentMode.value === 'system') {
      detectSystemMode();
    } else {
      updateTheme(currentMode.value);
    }

    // Add click listener to close menu
    document.addEventListener('click', handleClickOutside);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Handle menu item clicks and close dropdown
function handleClick(item) {
  item.action(); // Execute the function passed in the item
  isOpen.value = false; // Close the menu after action
}

// Handle click outside to close the menu
function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false; // Close the menu if clicked outside
  }
}

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


/* Custom select styles to hide the dropdown icon */
.custom-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: transparent;
  padding-right: 0;
  border: 1px solid #ccc;
  background-image: none; /* Remove the default dropdown icon */
}

.custom-select::-ms-expand {
  display: none; /* For Internet Explorer */
}

.custom-select option {
  background-color: #fff;
}
</style>
