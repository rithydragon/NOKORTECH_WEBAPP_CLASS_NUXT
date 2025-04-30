<template>
  <transition name="modal-fade">
    <div v-if="modelValue" class="modal-container">
      <!-- Overlay -->
      <div 
        class="modal-overlay"
        :class="{'is-visible': modelValue}"
        @click="handleOverlayClick"
      ></div>

      <!-- Modal Content -->
      <div
        class="modal-content"
        :class="[sizeClass, {'is-visible': modelValue}]"
        :style="{ maxWidth: maxWidth, maxHeight: maxHeight }"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="modalTitleId"
      >
        <!-- Header -->
        <div class="modal-header">
          <h3 :id="modalTitleId" class="modal-title">{{ modalTitle }}</h3>
          <button 
            @click="handleClose"
            class="modal-close-btn"
            aria-label="Close modal"
          >
            <i class="ri-close-line"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <slot></slot>
        </div>

          <!-- Footer with Action Buttons -->
        <div v-if="!hideFooter" class="modal-footer">
          <slot name="footer">
            <!-- Default Cancel Button -->
            <button
              v-if="showCancelButton"
              @click="$emit('cancel')"
              class="modal-btn is-cancel"
              :disabled="cancelDisabled"
            >
              {{ cancelText }}
            </button>

            <!-- Custom Action Buttons -->
            <button
              v-for="(action, index) in actions"
              :key="index"
              @click="$emit('action', action.event)"
              class="modal-btn"
              :class="action.class || 'is-primary'"
              :disabled="action.disabled"
            >
              <i v-if="action.icon" :class="action.icon"></i>
              {{ action.label }}
            </button>

            <!-- Default Confirm Button -->
            <button
              v-if="showConfirmButton"
              @click="$emit('confirm')"
              class="modal-btn is-confirm"
              :disabled="confirmDisabled"
            >
              {{ confirmText }}
            </button>
          </slot>
        </div>

        <!-- Footer -->
        <!-- <div v-if="!hideFooter" class="modal-footer">
          <slot name="footer">
            <button
              v-for="(btn, index) in actionButtons"
              :key="index"
              @click="$emit(btn.event)"
              :class="['modal-btn', btn.class, { 'is-disabled': btn.disabled }]"
              :disabled="btn.disabled"
            >
              {{ btn.label }}
            </button>
          </slot>
        </div> -->
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, defineProps, defineEmits, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  modalTitle: {
    type: String,
    default: 'Modal Title'
  },
  actionButtons: {
    type: Array,
    default: () => []
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  maxWidth: {
    type: String,
    default: '90vw'
  },
  maxHeight: {
    type: String,
    default: '90vh'
  },
  hideFooter: Boolean,
  closeOnOverlayClick: {
    type: Boolean,
    default: true
  },
  animationDuration: {
    type: Number,
    default: 300
  }
  ,  preventClose: {
    type: Boolean,
    default: false
  },
  closeOnOverlayClick: {
    type: Boolean,
    default: true
  },
  closeOnEsc: {
    type: Boolean,
    default: true
  },
  beforeClose: {
    type: Function,
    default: null
  }
})

const isOpen = ref(false)

const emit = defineEmits([
  'update:modelValue',
  'close',
  'cancel',
  'confirm',
  'action',
  'open'
])

// const handleOverlayClick = () => {
//   if (!props.closeOnOverlayClick || props.preventClose) return
//   attemptClose()
// }

const handleCloseClick = () => {
  if (props.preventClose) return
  attemptClose()
}

const handleConfirm = () => {
  if (props.preventClose) return
  emit('confirm')
  attemptClose()
}
const handleAction = (action) => {
  if (props.preventClose) return
  emit('action', action)
  attemptClose()
}
const handleOpen = () => {
  emit('open', true)
  document.body.style.overflow = 'hidden'
}

const handleCancel = () => {
  if (props.preventClose) return
  emit('cancel')
  attemptClose()
}

const attemptClose = () => {
  if (props.beforeClose) {
    const shouldClose = props.beforeClose()
    if (shouldClose !== false) {
      doClose()
    }
  } else {
    doClose()
  }
}

const handleOverlayClick = () => {
  if (props.closeOnClickOutside) {
    handleClose()
  }
}

const handleClose = () => {
  closeModal()
  if (props.preventClose) return
}
const closeModal = () => {
  isOpen.value = false
  emit('update:modelValue', false)
  emit('close')
}

const doClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

// Handle ESC key
const handleKeydown = (e) => {
  if (props.modelValue && props.closeOnEsc && !props.preventClose && e.key === 'Escape') {
    emit('update:modelValue', false)
    attemptClose()
  }
}

const modalTitleId = ref(`modal-title-${Math.random().toString(36).substring(2, 9)}`)
const sizeClass = computed(() => `is-${props.size}`)

// Handle ESC key press
// const handleKeydown = (e) => {
//   if (props.modelValue && props.closeOnEsc && e.key === 'Escape') {
//     emit('update:modelValue', false)
//   }
// }

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  if (props.modelValue) {
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

watch(() => props.modelValue, (newVal) => {
  document.body.style.overflow = newVal ? 'hidden' : ''
})
</script>

<style lang="scss">
@use "sass:math";

// Variables
$modal-z-index: 1000;
$modal-overlay-z-index: $modal-z-index + 1;
$modal-content-z-index: $modal-z-index + 2;
$modal-animation-duration: 300ms;
$modal-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);

// Button Variables
$btn-primary: #3b82f6;
$btn-danger: #ef4444;
$btn-success: #10b981;
$btn-warning: #f59e0b;
$btn-secondary: #6b7280;
// Animation variables
$modal-z-index: 999 !default;
$modal-overlay-z-index: $modal-z-index + 1 !default;
$modal-content-z-index: $modal-z-index + 2 !default;
$modal-animation-duration: 300ms !default;
$modal-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275) !default;

// Base styles
.modal {
  &-container {
    position: fixed;
    inset: 0;
    z-index: 50 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    &-close-btn {
    &[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
      
      &:hover {
        background-color: transparent !important;
      }
    }
  }
  }

  &-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity $modal-animation-duration ease-out;
    will-change: opacity;
    z-index: $modal-overlay-z-index;

    &.is-visible {
      opacity: 1;
    }
  }

  &-content {
    position: relative;
    background-color: var(--nokor-w-b-5);
    border-radius: 0.5rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    max-height: 90vh;
    transform: translateY(20px) scale(0.95);
    opacity: 0;
    transition: all $modal-animation-duration $modal-timing-function;
    will-change: transform, opacity;
    z-index: 5000;
    width: 100%;
    margin: 0 auto;

    &.is-visible {
      transform: translateY(0) scale(1);
      opacity: 1;
    }

    // Size variants
    &.is-sm { max-width: 24rem; }
    &.is-md { max-width: 28rem; }
    &.is-lg { max-width: 32rem; }
    &.is-xl { max-width: 36rem; }
    &.is-full { max-width: 100%; }
  }

  &-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--nokor-w-b-3);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  &-title {
    font-size: 1.125rem;
    line-height: 1.75rem;
    font-weight: 600;
    margin: 0;
  }

  &-close-btn {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #6b7280;
    transition: all 0.2s ease;
    background-color: transparent;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: #f3f4f6;
      color: #1f2937;
    }

    i {
      font-size: 1.25rem;
    }
  }

  &-body {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;

    // Custom scrollbar
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 10px;
      transition: background 0.3s;

      &:hover {
        background: #a8a8a8;
      }
    }
  }

  // &-footer {
  //   padding: 1rem 1.5rem;
  //   border-top: 1px solid #e5e7eb;
  //   display: flex;
  //   justify-content: flex-end;
  //   gap: 0.75rem;
  //   position: sticky;
  //   bottom: 0;
  //   z-index: 10;
  // }
  &-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--nokor-w-b-3);
    
    // Responsive buttons on small screens
    @media (max-width: 640px) {
      flex-direction: column;
      gap: 0.5rem;
      
      .modal-btn {
        width: 100%;
      }
    }
  }
 
  &-btn {
    position: relative;
    padding: 0.5rem 1.25rem;
    border-radius: 0.375rem;
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.25rem;
    transition: all 150ms ease;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transform: translateY(0);

    &:not(.is-disabled):hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    &:not(.is-disabled):active {
      transform: translateY(1px);
    }

    &.is-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    // Disabled state
    &[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    // Button variants
    &.is-primary {
      background-color: $btn-primary;
      color: white;
      
      &:not([disabled]):hover {
        background-color: darken($btn-primary, 10%);
        transform: translateY(-1px);
      }
    }
    
    &.is-danger {
      background-color: $btn-danger;
      color: white;
      
      &:not([disabled]):hover {
        background-color: darken($btn-danger, 10%);
      }
    }
    
    &.is-success {
      background-color: $btn-success;
      color: white;
      
      &:not([disabled]):hover {
        background-color: darken($btn-success, 10%);
      }
    }
    
    &.is-warning {
      background-color: $btn-warning;
      color: white;
      
      &:not([disabled]):hover {
        background-color: darken($btn-warning, 10%);
      }
    }
    
    &.is-secondary {
      background-color: $btn-secondary;
      color: white;
      
      &:not([disabled]):hover {
        background-color: darken($btn-secondary, 10%);
      }
    }
    
    &.is-cancel {
      background-color: #f3f4f6;
      color: #4b5563;
      
      &:not([disabled]):hover {
        background-color: #e5e7eb;
      }
    }

    // Loading state
    &.is-loading {
      color: transparent !important;
      pointer-events: none;
      
      &::after {
        content: "";
        position: absolute;
        width: 1rem;
        height: 1rem;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s linear infinite;
      }
    }
  }
  
}

// Transition animations
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity $modal-animation-duration ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
<!-- 
Basic Close Prevention:
<RTModal
  v-model="showModal"
  modal-title="Important Action"
  :prevent-close="true"
>
  <p>You must complete this action before closing</p>
  <template #footer>
    <button @click="completeAction" class="modal-btn is-primary">
      Complete Action
    </button>
  </template>
</RTModal>

Custom Before-Close Check:
<RTModal
  v-model="showModal"
  modal-title="Unsaved Changes"
  :before-close="checkForUnsavedChanges"
>
</RTModal>

<script setup>
const checkForUnsavedChanges = () => {
  if (hasUnsavedChanges.value) {
    return confirm('You have unsaved changes. Really close?')
  }
  return true
}
</script>

Conditional Close Prevention:
<RTModal
  v-model="showModal"
  modal-title="Form Submission"
  :prevent-close="formIsDirty"
  @close="handleCloseAttempt"
>
</RTModal> -->
<!-- 
<template>
  <button @click="showModal = true">Open Modal</button>
  
  <RTModal
    v-model="showModal"
    modal-title="Student Details"
    size="lg"
    :action-buttons="[
      { label: 'Cancel', event: 'close', class: 'bg-gray-100 hover:bg-gray-200' },
      { label: 'Save', event: 'save', class: 'bg-blue-500 text-white hover:bg-blue-600' }
    ]"
    @close="showModal = false"
    @save="handleSave"
  >
    <div class="p-4">
      <p>Modal content goes here</p>
    </div>
  </RTModal>
</template>

<script setup>
import { ref } from 'vue'
const showModal = ref(false)

const handleSave = () => {
  console.log('Data saved')
  showModal.value = false
}
</script> -->