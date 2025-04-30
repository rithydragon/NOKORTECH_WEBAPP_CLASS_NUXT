<template>
  <div class="flex items-center gap-2">
    <div
      v-for="(action, index) in actions"
      :key="index"
      :class="[
        'dynamic-button',
        getButtonClass(action.type),
        getSizeClass(action.size),
        { 'opacity-50 cursor-not-allowed': action.disabled || action.loading }
      ]"
      :disabled="action.disabled || action.loading"
      @click="!action.disabled && !action.loading ? handleClick(action.onClick) : null"
      :aria-label="action.label"
    >
      <!-- Loading spinner -->
      <span
        v-if="action.loading"
        class="button-icon animate-spin"
        :style="getIconStyle(action.iconSize || '18px')"
      >
        <i class="ri-loader-4-line"></i>
      </span>
      <!-- Regular icon -->
      <span
        v-else-if="action.icon || getDefaultIcon(action.type)"
        class="button-icon"
        :style="getIconStyle(action.iconSize || '18px')"
      >
        <i :class="action.icon || getDefaultIcon(action.type)"></i>
      </span>
      <span class="button-label">{{ action.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  actions: {
    type: Array,
    required: true,
    validator: (actions) => {
      return actions.every(action => {
        return (
          typeof action.label === 'string' &&
          typeof action.type === 'string' &&
          (action.icon === undefined || typeof action.icon === 'string') &&
          (action.disabled === undefined || typeof action.disabled === 'boolean') &&
          (action.loading === undefined || typeof action.loading === 'boolean')
        )
      })
    }
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
  edit: 'ri-edit-line',
  view: 'ri-eye-line'
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
    edit: 'btn-edit',
    view: 'btn-view'
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
const getIconStyle = (iconSize) => ({
  fontSize: iconSize || '18px',
  color: 'currentColor',
})

// Get default icon based on button type
const getDefaultIcon = (type) => defaultIcons[type] || 'ri-star-line'

// Handle the click event and pass the respective action handler
const handleClick = (onClick) => {
  if (onClick && typeof onClick === 'function') {
    onClick()
  }
}
</script>

<style scoped lang="scss">
.dynamic-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  // transition: all 0.2s ease-in-out;
  gap: 0.5rem;

  /* Light mode colors */
  background-color: var(--color-background);
  color: var(--color-text);
  border-color: var(--color-border);

  &:hover:not(:disabled) {
    opacity: 0.5;
    cursor:default
    // transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    cursor: default;
    opacity: 0.2;
  }

  /* Button type styles - light mode */
  &.btn-primary {
    background-color: var(--color-primary);
    color: white;
  }

  &.btn-secondary {
    background-color: var(--color-secondary);
    color: white;
  }

  &.btn-create {
    background-color: var(--color-success);
    color: white;
  }

  &.btn-update, &.btn-edit {
    background-color: var(--color-warning);
    color: white;
  }

  &.btn-delete {
    background-color: var(--color-danger);
    color: white;
  }

  &.btn-cancel {
    background-color: var(--nokor-w-b-3);
    color: white;
  }

  &.btn-save {
    background-color: var(--color-info);
    color: white;
  }

  &.btn-view {
    background-color: var(--color-secondary);
    color: white;
  }

  /* Button sizes */
  &.btn-small {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }

  &.btn-medium {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }

  &.btn-large {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }

  .button-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    i {
      display: inline-block;
    }
  }

  .button-label {
    white-space: nowrap;
  }
}


/* Animation for loading spinner */
// @keyframes spin {
//   to {
//     transform: rotate(360deg);
//   }
// }

// .animate-spin {
//   animation: spin 1s linear infinite;
// }
</style>