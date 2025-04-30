<template>
    <div class="custom-tooltip-container">
      <div
        class="custom-tooltip whitespace-nowrap"
        :class="[positionClass]"
        v-if="isVisible"
      >
        <span>{{ text }}</span>
      </div>
      <div @mouseenter="showTooltip" @mouseleave="hideTooltip" class="tooltip-trigger white-space-nowrap">
        <slot></slot>
      </div>
    </div>

  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const props = defineProps({
    text: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      default: 'top',
    },
  })
  
  const isVisible = ref(false)
  
  const showTooltip = () => {
    isVisible.value = true
  }
  
  const hideTooltip = () => {
    isVisible.value = false
  }
  
  const positionClass = computed(() => `tooltip-${props.position}`)
  </script>
  
  <style scoped lang="scss">
.custom-tooltip-container {
  position: relative;
  display: inline-block;
  overflow: visible; /* Make sure the tooltip is not clipped */
  z-index: 1; /* Higher than default table elements */
}

.custom-tooltip {
  position: absolute;
  background-color: var(--color-tooltip-bg);
  color: var(--color-tooltip-text);
  // padding: 6px 12px;
  border-radius: 3px;
  font-size: 9px;
  white-space: nowrap; // Allow text to no wrap
  z-index: 99999; // Increase above everything

  // Tooltip position styles
  &.tooltip-top {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 1px;
  }

  &.tooltip-bottom {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 1px;
  }

  &.tooltip-left {
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-right: 8px;
  }

  &.tooltip-right {
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 8px;
  }
  
}

.tooltip-trigger {
  display: inline-block; /* Ensure the tooltip trigger is inline-block to fit with text */
  cursor: pointer;
}
</style>