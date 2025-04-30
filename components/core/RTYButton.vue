<template>
  <div
    :class="['dynamic-button', buttonClass, sizeClass]"
    :disabled="disabled"
    @click="handleClick"
    :aria-label="label"
    class="cursor-pointer"
  >
    <!-- Display icon only if it exists -->
    <span v-if="icon" :class="icon" class="button-icon"></span>
    <span>{{ label }}</span>
  </div>
</template>

<script setup>
import { computed, defineEmits } from 'vue'

// Define events to emit to the parent
const emit = defineEmits(['clicked'])

// Default icon and color configurations based on button type
const buttonDefaults = {
  create: {
    icon: 'ri-add-line',   // Default icon for 'create'
    color: 'bg-green-500', // Default color for 'create'
    size: 'medium',        // Default size for 'create'
  },
  update: {
    icon: 'ri-edit-line',  // Default icon for 'update'
    color: 'bg-yellow-500', // Default color for 'update'
    size: 'medium',         // Default size for 'update'
  },
  delete: {
    icon: 'ri-delete-bin-line', // Default icon for 'delete'
    color: 'bg-red-500',  // Default color for 'delete'
    size: 'medium',       // Default size for 'delete'
  },
  cancel: {
    icon: 'ri-close-line',  // Default icon for 'cancel'
    color: 'bg-gray-500',   // Default color for 'cancel'
    size: 'medium',         // Default size for 'cancel'
  },
  save: {
    icon: 'ri-save-line',   // Default icon for 'save'
    color: 'bg-blue-500',   // Default color for 'save'
    size: 'medium',         // Default size for 'save'
  },
  default: {
    icon: 'ri-question-line', // Default fallback icon
    color: 'bg-blue-500',     // Default fallback color
    size: 'medium',           // Default fallback size
  }
}

// Define props from parent
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'default', // Default to 'default' button type
  },
  icon: {
    type: String,
    default: '', // Icon passed by parent (if any)
  },
  color: {
    type: String,
    default: '', // Color passed by parent (if any)
  },
  size: {
    type: String,
    default: '', // Size passed by parent (if any)
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

// Compute the button configuration based on the `type` prop
const buttonConfig = computed(() => {
  const defaultConfig = buttonDefaults[props.type] || buttonDefaults.default

  return {
    icon: props.icon || defaultConfig.icon,  // Use default icon if none passed
    color: props.color || defaultConfig.color,  // Use default color if none passed
    size: props.size || defaultConfig.size,   // Use default size if none passed
  }
})

// Dynamic classes for button styles and size
const buttonClass = computed(() => buttonConfig.value.color)
const sizeClass = computed(() => {
  const sizeClasses = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg',
  }
  return sizeClasses[buttonConfig.value.size] || sizeClasses.medium
})

const iconStyle = computed(() => ({
  fontSize: '15px', // Set a fixed icon size
}))

// Handle button click event and emit 'clicked' event
function handleClick() {
  if (!props.disabled) {
    emit('clicked') // Emit the click event to the parent
  }
}
</script>

<style scoped lang="scss">
.dynamic-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  border-radius: 10px;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .button-icon {
    margin-right: 8px;
  }
}
</style>
