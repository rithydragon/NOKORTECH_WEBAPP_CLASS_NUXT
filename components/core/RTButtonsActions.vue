<template>
  <div class="flex items-center gap-2">
    <div
      v-for="(action, index) in actions"
      :key="index"
      :class="['dynamic-button', getButtonClass(action.type), getSizeClass(action.size)]"
      :disabled="action.disabled"
      @click="handleClick(action.onClick)"
      :aria-label="action.label"
      :title="action.label && action.size === 'small' ? action.label : ''"
    >
      <!-- Icon only if size is small, otherwise show both icon and label -->
      <span
        v-if="(action.size === 'small' && action.icon) || !action.size"
        :class="action.icon || getDefaultIcon(action.type)"
        class="button-icon"
        :style="getIconStyle(action.iconSize || '18px')"
      ></span>
      <span v-if="action.size !== 'small'">{{ action.label }}</span>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  actions: {
    type: Array,
    required: true
  }
})

// Default icons for each action type
const defaultIcons = {
  create: 'ri-add-circle-line',
  update: 'ri-edit-line',
  delete: 'ri-delete-bin-line',
  cancel: 'ri-close-line',
  save: 'ri-save-line',
  migrate: 'ri-arrow-right-line',
  close: 'ri-close-circle-line',
  reject: 'ri-close-line',
  primary: 'ri-star-line',
  secondary: 'ri-star-half-line',
}

// Method to return button class based on type
const getButtonClass = (type) => {
  const buttonTypes = {
    create: 'btn-create',
    update: 'btn-update',
    delete: 'btn-delete',
    cancel: 'btn-cancel',
    save: 'btn-save',
    migrate: 'btn-migrate',
    close: 'btn-close',
    reject: 'btn-reject',
    primary: 'btn-primary',
    secondary: 'btn-secondary',
  }
  return buttonTypes[type] || `btn-${type}`
}

// Method to return size class
const getSizeClass = (size) => {
  const sizeClasses = {
    small: 'btn-small',
    medium: 'btn-medium',
    large: 'btn-large',
  }
  return sizeClasses[size] || 'btn-medium'
}

// Method to get icon styles if needed
const getIconStyle = (iconSize) => {
  return {
    fontSize: iconSize || '18px',
    color: 'currentColor',
  }
}

// Get default icon based on button type
const getDefaultIcon = (type) => {
  return defaultIcons[type] || 'ri-star-line'
}

// Handle the click event and pass the respective action handler
const handleClick = (onClick) => {
  if (onClick) {
    onClick()
  }
}
</script>
<style scoped lang="scss">
.dynamic-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 10px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
  font-weight: 500;
  border-radius: 4px;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &.btn-primary {
    background-color: #3498db;
    color: white;
  }

  &.btn-secondary {
    background-color: #95a5a6;
    color: white;
  }

  &.btn-create {
    background-color: #28a745;
    color: white;
  }

  &.btn-update {
    background-color: #ffc107;
    color: white;
  }

  &.btn-delete {
    background-color: #dc3545;
    color: white;
  }

  &.btn-cancel {
    background-color: #6c757d;
    color: white;
  }

  &.btn-save {
    background-color: #007bff;
    color: white;
  }

  &.btn-migrate {
    background-color: #17a2b8;
    color: white;
  }

  &.btn-close {
    background-color: #343a40;
    color: white;
  }

  &.btn-reject {
    background-color: #f8d7da;
    color: #721c24;
  }

  &.btn-small {
    padding: 5px 10px;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;

    .button-icon {
      margin-right: 0;
    }

    span {
      display: none; /* Hide the label */
    }
  }

  &.btn-medium {
    padding: 10px 10px;
    font-size: 16px;
  }

  &.btn-large {
    padding: 15px 30px;
    font-size: 18px;
  }

  .button-icon {
    margin-right: 8px;
  }
}
</style>
