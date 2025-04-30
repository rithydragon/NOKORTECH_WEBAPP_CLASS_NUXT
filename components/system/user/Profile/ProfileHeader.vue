
<template>
  <div class="profile-detail">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Personal Information -->
      <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {{$t('personal_information')}}
        </h3>
        <div class="space-y-3">
          <ProfileDetailItem label="Full Name" :value="user.Name" />
          <ProfileDetailItem label="English Name" :value="user.NameEnglish" />
          <ProfileDetailItem label="Username" :value="user.Username" />
          <ProfileDetailItem label="Email" :value="user.Email" />
          <ProfileDetailItem label="Gender" :value="user.Gender" />
          <ProfileDetailItem label="Date of Birth" :value="userStore.formattedBirthDate" />
          <ProfileDetailItem label="Place of Birth" :value="user.PlaceOfBirth" />
        </div>
      </div>

      <!-- Contact Information -->
      <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Contact Information
        </h3>
        <div class="space-y-3">
          <ProfileDetailItem label="Address" :value="user.Address" />
          <ProfileDetailItem label="Phone Number" :value="user.PhoneNumber" />
        </div>
      </div>

      <!-- Account Information -->
      <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Account Information
        </h3>
        <div class="space-y-3">
          <ProfileDetailItem label="User Type" :value="user.UserType" />
          <ProfileDetailItem label="Last Login" :value="userStore.formattedLastLogin" />
          <ProfileDetailItem label="Account Status" :value="user.UserActive ? 'Active' : 'Inactive'" />
        </div>
      </div>

      <!-- Roles & Permissions -->
      <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Roles & Permissions
        </h3>
        <div class="space-y-3">
          <ProfileDetailItem label="Roles">
            <div v-for="role in userStore.userRoles" :key="role" class="badge badge-primary mr-2">
              {{ role }}
            </div>
          </ProfileDetailItem>
          <ProfileDetailItem label="Permissions">
            <div v-for="permission in userStore.userPermissions" :key="permission" class="badge badge-secondary mr-2 mb-2">
              {{ permission }}
            </div>
          </ProfileDetailItem>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import ProfileDetailItem from './ProfileDetailItem.vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
const user = ref({});
console.log('User Data:', user); // Debugging line to check user data 

onMounted(() => {
  if (!userStore.userData) {
    userStore.getUserProfile().then(() => {
      user.value = userStore.userData;
    });
  } else {
    user.value = userStore.userData;
  }
}); 

</script>

<style lang="scss" scoped>
.profile-detail {
  max-width: 1200px;
  margin: 0 auto;
}
</style>