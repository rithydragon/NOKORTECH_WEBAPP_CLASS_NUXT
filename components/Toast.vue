<script setup lang="ts">
const toasts = useToast().toasts;
</script>

<template>
  <div class="toast toast-end toast-top z-50">
    <div v-for="toast in toasts" :key="toast.id" class="alert" :class="`alert-${toast.type}`">
      <div>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>