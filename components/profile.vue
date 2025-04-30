<script setup>
definePageMeta({
  middleware: 'auth'
});
// Import the store properly
import { useUserStore } from '~/stores/user'

const activeTab = ref('profile')
const userStore = useUserStore()

// Initialize user data
onMounted(async () => {
  if (!userStore.userData) {
    await userStore.getUserProfile()
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Loading state -->
      <div v-if="userStore.loading" class="flex justify-center py-20">
        <span class="loading loading-spinner loading-lg"></span>
      </div>

      <!-- Error state -->
      <div v-else-if="userStore.error" class="alert alert-error mb-8">
        {{ userStore.error }}
      </div>

      <!-- Content when loaded -->
      <template v-else>
        <div class="text-center mb-8 fade-in">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {{ userStore.fullName }}
          </h1>
          <p class="text-gray-600 dark:text-gray-300">Manage your account settings</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div class="p-6 sm:p-8">
            <div class="flex flex-col md:flex-row gap-8">
              <!-- Left Sidebar -->
              <div class="md:w-1/3">
                <SystemUserProfileAvatarUpload class="mb-6" />
                
                <div class="space-y-1">
                  <button
                    v-for="tab in ['profile', 'password','profile_detail']"
                    :key="tab"
                    @click="activeTab = tab"
                    class="w-full text-left px-4 py-2 rounded-lg transition-all"
                    :class="{
                      'bg-primary text-white': activeTab === tab,
                      'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': activeTab !== tab,
                    }"
                  >
                    {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
                  </button>
                </div>
              </div>

              <!-- Right Content -->
              <div class="md:w-2/3">
                <SystemUserProfileProfileForm 
                  v-if="activeTab === 'profile'" 
                />
                <SystemUserProfilePasswordForm 
                  v-else-if="activeTab === 'password'" 
                />
                <div v-else-if="activeTab === 'profile_detail'"> 
                  <NuxtLink to="/userProfileInfo" class="text-blue-500 hover:underline" > {{ $t('view_profile_detail') }} </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>