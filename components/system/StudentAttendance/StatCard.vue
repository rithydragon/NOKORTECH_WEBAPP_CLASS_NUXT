<template>
    <div class="stat-card" :class="`bg-${color}-50`">
      <div class="icon-container" :class="`text-${color}-600`">
        <UIcon :name="icon" class="text-2xl" />
      </div>
      <div class="stat-content">
        <h3 class="stat-title">{{ title }}</h3>
        <p class="stat-value" :class="`text-${color}-600`">{{ value || '...'}}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    title: String,
    value: [String, Number],
    icon: String,
    color: {
      type: String,
      default: 'blue'
    }
  })
  </script>
  
  <style lang="scss" scoped>
  /* stat-card.scss */
.stat-card {
  padding: 1rem; // p-4
  border-radius: 0.5rem; // rounded-lg
  display: flex;
  align-items: center;
  gap: 1rem; // gap-4

  .icon-container {
    padding: 0.75rem; // p-3
    border-radius: 9999px; // rounded-full
    background-color: white; // bg-white
    white-space: nowrap;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .stat-content {
    flex: 1;

    .stat-title {
      font-size: 0.875rem; // text-sm
      font-weight: 500; // font-medium
      color: #6B7280; // text-gray-500
    }

    .stat-value {
      font-size: 1.5rem; // text-2xl
      font-weight: 700; // font-bold
      margin-top: 0.25rem; // mt-1
    }
  }
}

  </style>