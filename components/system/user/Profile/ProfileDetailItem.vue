<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <div class="profile-detail-item">
    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
      {{ label }}
    </dt>
    <dd class="mt-1 text-sm text-gray-900 dark:text-gray-200">
      <slot>{{ value || 'N/A' }}</slot>
    </dd>
  </div>
</template>

<style scoped>
.profile-detail-item {
  @apply py-2 border-b border-gray-100 dark:border-gray-600;
}
</style>