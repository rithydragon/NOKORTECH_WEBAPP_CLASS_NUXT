<template>
  <RTYHead :title="$t('user_profile')" description="Discover our amazing platform with cutting-edge features"
    :keywords="['technology', 'web app', 'innovation']" />
  <RTPageWrapper>
    <RTYHead :title="$t('user_profile')" description="Discover our amazing platform with cutting-edge features"
      :keywords="['technology', 'web app', 'innovation']" />
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 sm:px-6 lg:px-8">
      <div class="mx-auto">
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
            <p class="text-gray-600 dark:text-gray-300">Manage your account settings</p>

          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div class="p-6 sm:p-8">
              <div class="flex flex-col md:flex-row gap-8">
                <!-- Left Sidebar -->
                <div class="md:w-1/3">
                  <SystemUserProfileAvatarUpload class="mb-6" />

                  <div class="space-y-1">
                    <button v-for="tab in ['profile', 'update', 'password', 'profile detail']" :key="tab"
                      @click="activeTab = tab" class="w-full text-left px-4 py-2 rounded-lg transition-all" :class="{
                        'bg-primary text-white': activeTab === tab,
                        'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': activeTab !== tab,
                      }">
                      {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
                    </button>
                  </div>
                </div>

                <!-- Right Content -->
                <div class="md:w-2/3">
                  <SystemUserProfileHeader v-if="activeTab === 'profile'" />
                  <SystemUserProfileForm v-if="activeTab === 'update'" />
                  <!-- <SystemUserProfilePasswordForm v-else-if="activeTab === 'password'" /> -->
                  <PasswordForm  v-else-if="activeTab === 'password'" />
                  <div v-else-if="activeTab === 'profile detail'">
                    <SystemUserProfileHeader />
                    <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                      {{ $t('profile_detail') }}
                    </h3>
                    <NuxtLink to="/userProfileInfo" class="text-blue-500 hover:underline"> {{ $t('view_profile_detail') }} </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </RTPageWrapper>
</template>

<script setup>
import { useUserStore } from '~/stores/user'

const activeTab = ref('profile')
const userStore = useUserStore()

// Initialize user data
onMounted(async () => {
  if (!userStore.userData) {
    await userStore.getUserProfile()
  }
})

definePageMeta({
  layout: 'layout',
  middleware: 'auth',
  title: 'User Profile',
  description: 'View user profile information',
});

</script>