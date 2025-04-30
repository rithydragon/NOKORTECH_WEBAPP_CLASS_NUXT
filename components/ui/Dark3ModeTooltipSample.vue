<template>
  <div :class="{ 'dark': currentMode === 'dark' }" class="flex justify-center items-center space-x-4 mt-4">
    <!-- Dark Mode Icon -->
    <div 
      @click="cycleMode" 
      class="cursor-pointer flex justify-center items-center" 
      title="Click to switch to next mode">
      <i class="ri-moon-line text-xl" :class="{ 'text-gray-600': currentMode !== 'dark', 'text-yellow-500': currentMode === 'dark' }"></i>
    </div>
    
    <!-- Light Mode Icon -->
    <div 
      @click="cycleMode" 
      class="cursor-pointer flex justify-center items-center" 
      title="Click to switch to next mode">
      <i class="ri-sun-line text-xl" :class="{ 'text-gray-600': currentMode !== 'light', 'text-yellow-500': currentMode === 'light' }"></i>
    </div>

    <!-- System Mode Icon -->
    <div 
      @click="cycleMode" 
      class="cursor-pointer flex justify-center items-center" 
      title="Click to switch to next mode">
      <i class="ri-contrast-2-line text-xl" :class="{ 'text-gray-600': currentMode !== 'system', 'text-blue-500': currentMode === 'system' }"></i>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Modes array: Dark, Light, System
const modes = ['dark', 'light', 'system'];
let currentModeIndex = ref(0); // Track the current mode index

// Check if we're in the browser
const isBrowser = typeof window !== 'undefined';

// Function to get the stored theme from localStorage (if available)
function getStoredTheme() {
  if (isBrowser && localStorage.getItem('theme')) {
    return localStorage.getItem('theme');
  }
  return 'system'; // Default to 'system' if no theme is set
}

// Apply the current theme
function applyTheme() {
  const mode = modes[currentModeIndex.value];
  if (mode === 'system') {
    detectSystemMode();
  } else {
    updateTheme(mode);
  }
}

// Detect the system theme preference (dark or light) and apply it
function detectSystemMode() {
  if (isBrowser) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery.matches) {
      updateTheme('dark');
    } else {
      updateTheme('light');
    }

    // Listen for changes to the system theme preference
    mediaQuery.addEventListener('change', (e) => {
      updateTheme(e.matches ? 'dark' : 'light');
    });
  }
}

// Update the theme by adding the respective class to the document
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

// Cycle through the modes (Dark -> Light -> System -> Dark -> ...)
function cycleMode() {
  currentModeIndex.value = (currentModeIndex.value + 1) % modes.length; // Move to next mode in the array
  applyTheme(); // Apply the new theme
}

// Initialize the theme based on stored preference or system setting
onMounted(() => {
  if (isBrowser) {
    const storedTheme = getStoredTheme(); // Get the stored theme from localStorage
    currentModeIndex.value = modes.indexOf(storedTheme); // Set the current mode index based on stored theme
    applyTheme(); // Apply the theme immediately
  }
});
</script>

<style scoped>
/* Dark Mode Styles */
.dark {
  background-color: #333;
  color: white;
}

/* Light Mode Styles (default) */
.light {
  background-color: white;
  color: black;
}

/* Tooltip Styling */
[title] {
  position: relative;
}

[title]:hover::after {
  content: attr(title);
  position: absolute;
  background-color: black;
  color: white;
  padding: 5px;
  border-radius: 4px;
  font-size: 12px;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  z-index: 100;
}

/* Icon styling */
.cursor-pointer {
  cursor: pointer;
}

/* Styling for active icons */
.text-yellow-500 {
  color: #fbbf24; /* Yellow for Dark Mode */
}

.text-blue-500 {
  color: #3b82f6; /* Blue for System Mode */
}

.text-gray-600 {
  color: #4b5563; /* Gray for inactive modes */
}

.text-xl {
  font-size: 1.25rem;
}
</style>
