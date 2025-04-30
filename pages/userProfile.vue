<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()


onMounted(async () => {
  try {
    await authStore.getUserProfile()
  } catch (error) {
    console.log('Error loading user profile in component:', error)
  }
})
</script>

<template>
  <div>
    <RTYHead
    title="User Profile"
    description="Discover our amazing platform with cutting-edge features"
    :keywords="['technology', 'web app', 'innovation']"
  />
    <div v-if="authStore.isLoading">Loading user profile...</div>
    <div v-else-if="authStore.user">
      <h2 class="text-xl font-bold">Welcome, {{ authStore.user.Username }}</h2>
      <p>Email: {{ authStore.user.Email }}</p>
      <!-- Add more fields if needed -->
    </div>
    <div v-else>
      <p class="text-red-500">User not found or not authenticated.</p>
    </div>
  </div>
</template>
