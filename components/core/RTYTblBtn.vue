<template>
  <div class="flex items-center gap-2">
    <RTYTooltip
      v-for="(action, index) in actions"
      :key="index"
      :text="t(`${action?.type}`)"
      position="top"
    >
    
      <button
        :class="[
          'dynamic-button',
          `btn-${action.type}`,
          { 'opacity-50 cursor-not-allowed': action.disabled }
        ]"
        :disabled="action.disabled"
        @click="handleClick(action)"
        :aria-label="action.label || t(`${action.type}`)"
      >
      <i :class="[getIconClass(action), 'button-icon',getIconStyle(action)]"></i>
      </button>
    </RTYTooltip>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  actions: {
    type: Array,
    required: true,
    validator: (actions) => {
      return actions.every(action => 
        action.type && typeof action.type === 'string'
      )
    }
  },
})

const emits = defineEmits(['onClick'])

/** Default icons for each button type */
const defaultIcons = {
  view: 'ri-eye-line',
  create: 'ri-add-circle-line',
  edit: 'ri-edit-line',
  delete: 'ri-delete-bin-line',
  cancel: 'ri-close-line',
  save: 'ri-save-line',
  migrate: 'ri-arrow-right-line',
  close: 'ri-close-circle-line',
  reject: 'ri-close-line',
  approve: 'ri-checkbox-circle-line',
  upload: 'ri-upload-cloud-line',
  download: 'ri-download-cloud-line',
  settings: 'ri-settings-3-line',
  info: 'ri-information-line',
  warning: 'ri-error-warning-line',
  success: 'ri-check-line',
  danger: 'ri-alert-line',
  share: 'ri-share-line',
  send: 'ri-send-plane-line',
  record: 'ri-record-circle-line',
}

/** Get button color class */
const getButtonClass = (type) => `btn-${type}`

/** Get the appropriate icon class */
// const getIconClass = (action) => action.icon || defaultIcons[action.type] || 'ri-question-line'
const getIconClass = (action) =>  defaultIcons[action.type] || 'ri-question-line'

/** Get icon styling */
const getIconStyle = (action) => ({
  color: 'inherit', // Use 'inherit' to match the button's text color
})

const handleClick = (action) => {
  if (action) {
    emits('onClick', action?.type)
  }
  console.log("Action get ===============",action.type)
}

const handleClicerrk = (action) => {
  if (!action.disabled) {
    emits('action-click', action)
  }
}
</script>

<style scoped lang="scss">

// In your main CSS file:
:root {
  --color-view-text: theme('colors.blue.600');
  --color-view-border: theme('colors.blue.100');
  --color-view-bg: theme('colors.blue.50');
  --color-view-text-hover: theme('colors.blue.700');
  --color-view-border-hover: theme('colors.blue.200');
  --color-view-bg-hover: theme('colors.blue.100');
}

.dark {
  --color-view-text: theme('colors.blue.400');
  --color-view-border: theme('colors.blue.800/30');
  --color-view-bg: theme('colors.blue.900/20');
  --color-view-text-hover: theme('colors.blue.300');
  --color-view-border-hover: theme('colors.blue.700/40');
  --color-view-bg-hover: theme('colors.blue.900/30');
}
.dynamic-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px; // Border radius of 5px
  transition: all 0.3s;
  cursor: pointer;
  border: 1px solid; // Default border width
  padding: 3px;
  font-size: 19px;
  width: 30px;
  height: 30px;

  .button-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  &:disabled {
    cursor: default;
    opacity: 0.2;
  }

  &:hover:not(:disabled) {
    // transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:hover:not(:disabled) {
    opacity: 0.5;
    // transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &.btn-view {
    border-color: var(--color-view-border);
    color: var(--color-view-text);
    background-color: var(--color-view-bg);
    
    &:hover:not(:disabled) {
      border-color: var(--color-view-border-hover);
      color: var(--color-view-text-hover);
      background-color: var(--color-view-bg-hover);
    }
  }

  &.btn-edit {
    border-color: var(--color-view-border);
    color: var(--color-view-text);
    background-color: var(--color-view-bg);
    
    &:hover{
      border-color: var(--color-view-border-hover);
      color: var(--color-view-text-hover);
      background-color: var(--color-view-bg-hover);
    }
  }


  &.btn-create {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background-color: rgba(var(--color-primary-rgb), 0.05); // 5% background
  }

  &.btn-update {
    border-color: var(--color-secondary);
    color: var(--color-secondary);
    background-color: rgba(var(--color-secondary-rgb), 0.05); // 5% background
  }

  &.btn-delete {
    border-color: var(--color-danger);
    color: var(--color-danger);
    background-color: rgba(var(--color-danger-rgb), 0.05); // 5% background
  }

  &.btn-cancel {
    border-color: var(--color-text);
    color: var(--color-text);
    background-color: rgba(var(--color-text-rgb), 0.05); // 5% background
  }

  &.btn-save {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background-color: rgba(var(--color-primary-rgb), 0.05); // 5% background
  }
  &.btn-record {
    border-color: var(--color-info);
    color: var(--color-info);
    background-color: rgba(var(--color-info-rgb), 0.05); // 5% background
  }
  &.btn-migrate {
    border-color: var(--color-info);
    color: var(--color-info);
    background-color: rgba(var(--color-info-rgb), 0.05); // 5% background
  }

  &.btn-close {
    border-color: var(--color-text);
    color: var(--color-text);
    background-color: rgba(var(--color-text-rgb), 0.05); // 5% background
  }

  &.btn-reject {
    border-color: var(--color-danger);
    color: var(--color-danger);
    background-color: rgba(var(--color-danger-rgb), 0.05); // 5% background
  }

  &.btn-approve {
    border-color: var(--color-success);
    color: var(--color-success);
    background-color: rgba(var(--color-success-rgb), 0.05); // 5% background
  }

  &.btn-upload {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background-color: rgba(var(--color-primary-rgb), 0.05); // 5% background
  }

  &.btn-download {
    border-color: var(--color-secondary);
    color: var(--color-secondary);
    background-color: rgba(var(--color-secondary-rgb), 0.05); // 5% background
  }

  &.btn-settings {
    border-color: var(--color-text);
    color: var(--color-text);
    background-color: rgba(var(--color-text-rgb), 0.05); // 5% background
  }

  &.btn-info {
    border-color: var(--color-info);
    color: var(--color-info);
    background-color: rgba(var(--color-info-rgb), 0.05); // 5% background
  }

  &.btn-warning {
    border-color: var(--color-warning);
    color: var(--color-warning);
    background-color: rgba(var(--color-warning-rgb), 0.05); // 5% background
  }

  &.btn-success {
    border-color: var(--color-success);
    color: var(--color-success);
    background-color: rgba(var(--color-success-rgb), 0.05); // 5% background
  }

  &.btn-danger {
    border-color: var(--color-danger);
    color: var(--color-danger);
    background-color: rgba(var(--color-danger-rgb), 0.05); // 5% background
  }

  &.btn-share {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background-color: rgba(var(--color-primary-rgb), 0.05); // 5% background
  }

  &.btn-send {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background-color: rgba(var(--color-primary-rgb), 0.05); // 5% background
  }

  .button-icon {
    margin: 0;
  }
}
</style>



<!-- 
Usage example:
<RTYTblBtn :actions="[
{ type: 'view', label: 'View', onClick: () => viewUser(row.id) },
{ type: 'edit', label: 'Edit', onClick: () => editUser(row.id) }
]"/> -->

<!-- Basic Cursor Types in Sass:
.element {
  cursor: pointer;       // Hand pointer (for clickable elements)
  cursor: default;       // Default arrow
  cursor: text;          // I-beam for text
  cursor: move;          // Move/grabbing hand
  cursor: not-allowed;   // Circle with line (disabled state)
  cursor: help;          // Question mark
  cursor: wait;          // Hourglass/wait
  cursor: progress;      // Spinning circle (processing)
  cursor: crosshair;     // Crosshair (for selection)
  cursor: zoom-in;       // Magnifying glass with +
  cursor: zoom-out;      // Magnifying glass with -
  cursor: grab;          // Open hand (draggable)
  cursor: grabbing;      // Closed hand (while dragging)
}

Custom Image Cursors:
  .element {
  cursor: url('path/to/cursor.png'), auto;  // Custom cursor with fallback
  cursor: url('path/to/cursor.cur'), pointer; // Windows cursor format
} -->