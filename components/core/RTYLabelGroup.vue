<template>
    <div class="group-list">
      <span class="label-group-modal">{{ label }}</span>
      <span class="value-group-detail">
        <slot v-if="$slots.value" name="value"></slot>
        <span v-else>{{ threeDot(value) }}</span>
      </span>
    </div>
  </template>
  
  <script setup>
  import { computed } from "vue";
  
  const prop = defineProps(["label", "value"]);
  const label = computed(() => prop.label);
  const value = computed(() => prop.value);
  </script>
  
  <style lang="scss" scoped>
  .group-list {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 2px;
  
    .label-group-modal {
      font-size: 11px;
      color: var(--color-w-b-2);
    }
  
    .value-group-detail {
      font-size: 12px;
      color: var(--color-w-b-1);
    }
  }
  </style>
  