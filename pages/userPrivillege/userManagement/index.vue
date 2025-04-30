<template>
  <RTPageWrapper>
    <div>
      <!-- Button to open the Slideover for adding a user -->
      <UButton @click="openSlideover(null)" class="mb-4">{{ $t('add') }}</UButton>

      <!-- Display loading message or the User Table -->
      <div v-if="isLoading">Loading...</div>
      
      <!-- Display the User Table when not loading -->
      <UserTable
        v-else 
        :columns="columns" 
        :data="userList" 
        :actions="[
          { label: $t('edit'), method: openSlideover },
          { label: $t('delete'), method: deleteUser }
        ]" 
      />
      
      <!-- Slideover component for adding/editing users -->
      <RTYSlideover 
        v-model:isOpen="isSlideoverOpen" 
        :formData="selectedUser" 
        :fields="userFields" 
        :title="headText"
        :isEditMode="isEditMode" 
        @save="saveUser" 
        @delete="deleteUser" 
      />
    </div>
    
    <!-- Debugging output (user list) -->
    {{ userList }}
  </RTPageWrapper>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

// Translation function
const { t } = useI18n();

// Reactive states
const userList = ref([]);
const isSlideoverOpen = ref(false);
const isEditMode = ref(false);
const isLoading = ref(false);
const headText = ref('');
const selectedUser = ref({
  id: null,
  username: '',
  email: '',
  role: '',
  name: '',
  nameEnglish: '',
  gender: '',
  userType: '',
  dateOfBirth: '',
  placeOfBirth: '',
  address: '',
  phoneNumber: '',
  createdBy: '',
  roleId: '',
});

// Dynamic fields for user form in Slideover
const userFields = ref([
  { key: 'Username', label: t('username'), type: 'text' },
  { key: 'Email', label: t('email'), type: 'email' },
  { key: 'role', label: t('role'), type: 'text' },
  { key: 'Name', label: t('name'), type: 'text' },
  { key: 'NameEnglish', label: t('nameEnglish'), type: 'text' },
  { key: 'password', label: t('password'), type: 'password' },
  { key: 'gender', label: t('gender'), type: 'text' },
  { key: 'userType', label: t('userType'), type: 'text' },
  { key: 'dateOfBirth', label: t('dateOfBirth'), type: 'date' },
  { key: 'placeOfBirth', label: t('placeOfBirth'), type: 'text' },
  { key: 'address', label: t('address'), type: 'text' },
  { key: 'phoneNumber', label: t('phoneNumber'), type: 'text' },
  { key: 'createdBy', label: t('createdBy'), type: 'text' },
  { key: 'roleId', label: t('roleId'), type: 'text' },
]);

// Table columns configuration
const columns = [
  { key: 'username', label: t('username') },
  { key: 'email', label: t('email') },
  { key: 'role', label: t('role') },
  { key: 'name', label: t('name') },
  { key: 'nameEnglish', label: t('nameEnglish') },
  { key: 'gender', label: t('gender') },
  { key: 'userType', label: t('userType') },
  { key: 'dateOfBirth', label: t('dateOfBirth') },
  { key: 'placeOfBirth', label: t('placeOfBirth') },
  { key: 'address', label: t('address') },
  { key: 'phoneNumber', label: t('phoneNumber') },
];

// Fetch user data when component is mounted
onMounted(async () => {
  userList.value = await fetchUserData();
});

// Fetch user data from the API
async function fetchUserData() {
  isLoading.value = true;
  try {
    const { data, error } = await useHttp('/api/user/list', { method: 'POST' });
    if (error) {
      console.log('Error fetching user data:', error.message);
      return;
    }
    userList.value = data; // Update user list reactively
  } catch (error) {
    console.log('Error fetching user data:', error);
  } finally {
    isLoading.value = false;
  }
}

// Open the Slideover component for editing or adding a user
const openSlideover = (user = { id: null, username: '', email: '', role: '' }) => {
  headText.value = user?.id ? t('edit') : t('add'); // Set the header text based on edit mode
  selectedUser.value = { ...user }; // Clone the user object for editing
  isEditMode.value = !!user?.id; // Set edit mode based on whether the user has an ID
  isSlideoverOpen.value = true; // Open the slideover
};

// Save or update a user
const saveUser = async () => {
  try {
    if (selectedUser.value.id) {
      // Update user
      await useHttp(`/api/user/update/${selectedUser.value.id}`, {
        method: 'PUT',
        body: selectedUser.value,
      });
    } else {
      // Create new user
      await useHttp('/api/user/create', {
        method: 'POST',
        body: selectedUser.value,
      });
    }
    await fetchUserData(); // Refresh the user list
    isSlideoverOpen.value = false; // Close the slideover after saving
  } catch (error) {
    console.log('Error saving user:', error);
  }
};

// Delete a user
const deleteUser = async (user) => {
  try {
    await useHttp(`/api/user/delete/${user.id}`, {
      method: 'DELETE',
    });
    await fetchUserData(); // Refresh the user list
  } catch (error) {
    console.log('Error deleting user:', error);
  }
};

definePageMeta({ layout: 'layout', middleware: 'auth' });
</script>
