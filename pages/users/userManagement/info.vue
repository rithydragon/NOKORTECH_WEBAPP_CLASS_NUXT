<template>
  <RTPageWrapper>
    <!-- Back button and title -->
    <div class=" flex items-center mb-6 gap-4">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" @click="goBack" />
      <h1 class="text-2xl font-bold">
        <USkeleton v-if="isLoading" class="h-6 w-40" />
        <span v-else>{{ $t('user_detail') }}</span>
      </h1>
    </div>

    <!-- User Profile Card -->
    <div class="content-card rounded-lg shadow-md overflow-hidden">
      <!-- Profile Header -->
      <div class="bg-gradient-to-r content-header p-6 ">
        <div class="flex items-center gap-4">
          <div class="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
            <!-- <UIcon name="i-heroicons-user-circle" class="w-12 h-12 text-white" /> -->
            <RTYAvatar :src="userData?.ImagePath" :gender="userData?.Gender" />
          </div>
          <div>
            <h2 class="text-2xl font-bold">
              <USkeleton v-if="isLoading" class="h-6 w-40" />
              <span v-else>{{ tBy({en:userData.NameEnglish,km:userData.Name}) }}</span>
            </h2>
            <p class="text-blue-100">
              <USkeleton v-if="isLoading" class="h-4 w-32" />
              <span v-else>{{ userData.UserCode }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- User Details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <!-- Basic Information -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">{{ $t('basic_information') }}</h3>

          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-500">{{ $t('english_name') }}:</span>
              <span class="font-medium">
                <USkeleton v-if="isLoading" class="h-4 w-32" />
                <span v-else>{{ userData.NameEnglish || '-' }}</span>
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">{{ $t('username') }}:</span>
              <span class="font-medium">
                <USkeleton v-if="isLoading" class="h-4 w-32" />
                <span v-else>{{ userData.Username }}</span>
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">{{ $t('email') }}:</span>
              <span class="font-medium">
                <USkeleton v-if="isLoading" class="h-4 w-40" />
                <span v-else>{{ userData.Email }}</span>
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">{{ $t('user_type') }}:</span>
              <span class="font-medium">
                <USkeleton v-if="isLoading" class="h-4 w-28" />
                <span v-else>{{ userData.UserType }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Personal Information -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">{{ $t('personal_information') }}</h3>

          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-500">{{ $t('gender') }}:</span>
              <span class="font-medium">
                <USkeleton v-if="isLoading" class="h-4 w-16" />
                <span v-else>{{ userData.Gender || '-' }}</span>
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">{{ $t('date_of_birth') }}:</span>
              <span class="font-medium">
                <USkeleton v-if="isLoading" class="h-4 w-40" />
                <span v-else>{{ rtydate(user.DateOfBirth).format('MMMM dd, yyyy') || '-' }}</span>
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">{{ $t('place_of_birth') }}:</span>
              <span class="font-medium">
                <USkeleton v-if="isLoading" class="h-4 w-32" />
                <span v-else>{{ userData.PlaceOfBirth || '-' }}</span>
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">{{ $t('phone_number') }}:</span>
              <span class="font-medium">
                <USkeleton v-if="isLoading" class="h-4 w-32" />
                <span v-else>{{ formatPhoneNumber(userData.PhoneNumber) || '-' }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Address -->
        <div class="md:col-span-2 space-y-4">
          <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">{{ $t('address') }}</h3>
          <p class="text-gray-700">
            <USkeleton v-if="isLoading" class="h-4 w-full max-w-md" />
            <span v-else>{{ userData.Address || $t('no_address_provided') }}</span>
          </p>
        </div>

        <!-- System Information -->
        <div class="md:col-span-2 space-y-4">
          <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">{{ $t('system_information') }}</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex justify-between">
              <span class="text-gray-500">{{ $t('created_by') }}:</span>
              <span class="font-medium">
                <USkeleton v-if="isLoading" class="h-4 w-32" />
                <span v-else>{{ userData.CreatedBy || '-' }}</span>
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">{{ $t('updated_by') }}:</span>
              <span class="font-medium">
                <USkeleton v-if="isLoading" class="h-4 w-32" />
                <span v-else>{{ userData.UpdatedBy || '-' }}</span>
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">{{ $t('created_at') }}:</span>
              <span class="font-medium">
                <USkeleton v-if="isLoading" class="h-4 w-40" />
                <span v-else>{{ rtydate(userData.CreatedAt).format('MMM dd, yyyy hh:mm A') || '-' }}</span>
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">{{ $t('updated_at') }}:</span>
              <span class="font-medium">
                <USkeleton v-if="isLoading" class="h-4 w-40" />
                <span v-else>{{ rtydate(userData.UpdatedAt).format('MMM dd, yyyy hh:mm A') || '-' }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="content-footer px-6 py-4 flex justify-end gap-3">
        <UButton color="gray" variant="outline" :label="$t('back')" @click="goBack" />
        <UButton color="blue" :label="$t('reset_password')" @click="showResetPasswordModal = true" />
        <UButton color="blue" :label="$t('change_password')" @click="showChangePasswordModal = true" />
      </div>
    </div>
  </RTPageWrapper>
  <SystemUserPrivillegeChangePassword v-model="showChangePasswordModal" :user="userData" :open="fn => { ActionOpenChangePassword = fn }" />
  <SystemUserPrivillegeResetPassword v-model="showResetPasswordModal" :user="userData" :open="fn => { ActionOpenChangePassword = fn }" />
</template>
<!-- :open="() => { ActionOpenChangePassword('Open') }" -->

<script setup>
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const isLoading = ref(false)
const userData = ref({})
const showChangePasswordModal = ref(false)
const showResetPasswordModal = ref(false)
const { notify } = useNotification()

const queryParams = useQueryParams();
const param = queryParams().user;

console.log("User param ----------:", param);
console.log("User param with User Id ----------:", param.UserId);
const user = ref({})

const getProfileData = async () => {
  try {
    isLoading.value = true
    const { data, error } = await useHttp('/api/user/userInfo', {
      method: 'POST',
      data: { userId: param?.UserId },
    });

    if (error) throw new Error(error);
    userData.value = data;
  } catch (error) {
    console.log("Error: ", error);
  } finally {
    isLoading.value = false
  }
};


// const goBack = () => {
//   router.go(-1) // Go back to previous page
// }
const goBack = () => {
  navigateTo('/users/userManagement') // Go back to previous page
}

const editUserq = () => {
  if (userParam.value?.UserId) {
    router.push({
      path: '/users/edit',
      query: { user: JSON.stringify(userParam.value) }
    })
  }
}

// Date formatting utilities
const formatDate = (dateString) => {
  if (!dateString) return null
  return new Date(dateString).toLocaleDateString()
}

const formatDateTime = (dateString) => {
  if (!dateString) return null
  return new Date(dateString).toLocaleString()
}

const showChangePassword = ref(false)

const openChangePasswordModal = (action = '') => {
  console.log('openChangePasswordModal  --------:', action)
  showChangePassword.value = true
}

// Fetch user data when component mounts
onMounted(async () => {
  await getProfileData()
})
// Watch for route changes
// Watch for query parameter changes
watch(() => param.value?.user, async (userId) => {
  if (userId) {
    await getProfileData(userId)
  }
}, { immediate: true })
// onBeforeRouteUpdate(async (to, from) => {
//   if (to.params.id !== from.params.id) {
//     await getProfileData(to.params.id)
//   }
// })
definePageMeta({ layout: 'layout', middleware: 'auth' })
</script>

<style scoped>
.content{
  &-header{
    background-color: var(--primary-color);
  }
  &-card{
  background-color: var(--nokor-w-b-5);
  overflow: hidden;}
  &-footer{
    background-color: var(--nokor-w-b-5);
  }
}
</style>